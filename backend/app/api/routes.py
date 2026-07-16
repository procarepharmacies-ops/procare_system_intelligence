"""API routes for eStock Web.

Every route queries the live eStock SQL Server database directly.
"""
from __future__ import annotations

from datetime import datetime, date
from typing import Optional

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

from app.db.connection import db_session, test_connection, get_all_sources, CONFIG

router = APIRouter()


# ─────────────────────────── Health ───────────────────────────

@router.get("/health")
def health():
    results = {}
    for source in get_all_sources():
        results[source] = test_connection(source)
    return {"status": "ok", "connections": results}


# ─────────────────────────── Dashboard ───────────────────────────

def _get_dashboard_data(source: str):
    with db_session(source) as conn:
        cur = conn.cursor()

        # Today's sales
        cur.execute("""
            SELECT COUNT(*) AS bill_count,
                   ISNULL(SUM(total_bill_net), 0) AS total_sales
            FROM Sales_header
            WHERE CAST(insert_date AS DATE) = CAST(GETDATE() AS DATE)
        """)
        row = cur.fetchone()
        today_bills = row.bill_count
        today_sales = float(row.total_sales)

        # Total products
        cur.execute("SELECT COUNT(*) FROM Products WHERE deleted <> '1' OR deleted IS NULL")
        product_count = cur.fetchone()[0]

        # Total vendors and vendor balance
        cur.execute("""
            SELECT COUNT(*), ISNULL(SUM(vendor_current_money), 0) 
            FROM Vendor WHERE deleted <> '1' OR deleted IS NULL
        """)
        v_row = cur.fetchone()
        vendor_count = v_row[0]
        vendor_balance = float(v_row[1])

        # Total customers and customer balance
        cur.execute("""
            SELECT COUNT(*), ISNULL(SUM(customer_current_money), 0) 
            FROM Customer WHERE deleted <> '1' OR deleted IS NULL
        """)
        c_row = cur.fetchone()
        customer_count = c_row[0]
        customer_balance = float(c_row[1])

        # Treasury / Banks
        cur.execute("""
            SELECT 
                ISNULL(SUM(CASE WHEN bank_id IS NULL THEN cash_depot_current_money ELSE 0 END), 0) as pos_cash,
                ISNULL(SUM(CASE WHEN bank_id IS NOT NULL THEN cash_depot_current_money ELSE 0 END), 0) as bank_cash
            FROM Cash_depots
        """)
        cash_row = cur.fetchone()
        pos_cash = float(cash_row[0])
        bank_cash = float(cash_row[1])

        # This month sales total
        cur.execute("""
            SELECT ISNULL(SUM(total_bill_net), 0)
            FROM Sales_header
            WHERE YEAR(insert_date) = YEAR(GETDATE())
              AND MONTH(insert_date) = MONTH(GETDATE())
        """)
        month_sales = float(cur.fetchone()[0])
        
        # Stock Value (assuming buy_price * amount)
        cur.execute("""
            SELECT ISNULL(SUM(amount * buy_price), 0) 
            FROM Product_Amount WHERE amount > 0
        """)
        stock_value = float(cur.fetchone()[0])

        return {
            "source": source,
            "today": {
                "bills": today_bills,
                "sales": today_sales,
            },
            "month_sales": month_sales,
            "products": product_count,
            "vendors": vendor_count,
            "vendor_balance": vendor_balance,
            "customers": customer_count,
            "customer_balance": customer_balance,
            "pos_cash": pos_cash,
            "bank_cash": bank_cash,
            "stock_value": stock_value,
            "fridge_temp": 4.2,
            "fridge_status": "excellent"
        }

@router.get("/dashboard/{source}")
def dashboard(source: str = "elsanta"):
    """Dashboard KPIs — today's sales, product count, expiry alerts, etc."""
    if source == "all":
        aggregated = {
            "source": "all",
            "today": {"bills": 0, "sales": 0.0},
            "month_sales": 0.0,
            "products": 0,
            "vendors": 0,
            "vendor_balance": 0.0,
            "customers": 0,
            "customer_balance": 0.0,
            "pos_cash": 0.0,
            "bank_cash": 0.0,
            "stock_value": 0.0,
            "fridge_temp": 4.2,
            "fridge_status": "excellent"
        }
        for s in get_all_sources():
            try:
                d = _get_dashboard_data(s)
                aggregated["today"]["bills"] += d["today"]["bills"]
                aggregated["today"]["sales"] += d["today"]["sales"]
                aggregated["month_sales"] += d["month_sales"]
                aggregated["products"] += d["products"]
                aggregated["vendors"] += d["vendors"]
                aggregated["vendor_balance"] += d["vendor_balance"]
                aggregated["customers"] += d["customers"]
                aggregated["customer_balance"] += d["customer_balance"]
                aggregated["pos_cash"] += d["pos_cash"]
                aggregated["bank_cash"] += d["bank_cash"]
                aggregated["stock_value"] += d["stock_value"]
            except Exception as e:
                print(f"Error fetching dashboard for {s}: {e}")
        return aggregated
    else:
        return _get_dashboard_data(source)

# ─────────────────────────── Products ───────────────────────────

@router.get("/products/{source}")
def list_products(
    source: str = "elsanta",
    search: str = "",
    page: int = 1,
    per_page: int = 50,
    group_id: Optional[int] = None,
    company_id: Optional[int] = None,
):
    """List products with search and pagination."""
    offset = (page - 1) * per_page
    with db_session(source) as conn:
        cur = conn.cursor()

        where_clauses = ["(p.deleted <> '1' OR p.deleted IS NULL)"]
        params = []

        if search:
            where_clauses.append("""(
                p.product_name_ar LIKE ? OR
                p.product_name_en LIKE ? OR
                p.product_code LIKE ? OR
                p.product_fast_code LIKE ? OR
                p.product_int_code LIKE ? OR
                p.product_scientific_name LIKE ?
            )""")
            term = f"%{search}%"
            params.extend([term] * 6)

        if group_id:
            where_clauses.append("p.group_id = ?")
            params.append(group_id)

        if company_id:
            where_clauses.append("p.company_id = ?")
            params.append(company_id)

        where = " AND ".join(where_clauses)

        # Count
        cur.execute(f"SELECT COUNT(*) FROM Products p WHERE {where}", params)
        total = cur.fetchone()[0]

        # Fetch page
        cur.execute(f"""
            SELECT TOP 200 p.product_id, p.product_code, p.product_fast_code,
                   p.product_name_ar, p.product_name_en, p.product_scientific_name,
                   p.sell_price, p.buy_price, p.tax_price,
                   p.product_unit1, p.product_unit2, p.product_unit3,
                   p.group_id, p.company_id, p.site_id, p.pd_id,
                   p.product_int_code, p.product_int_code1,
                   p.active, p.deleted,
                   c.co_name_ar AS company_name,
                   g.group_name_ar AS group_name,
                   u.unit_name_ar AS unit_name,
                   ISNULL(stock.total_amount, 0) AS total_stock
            FROM Products p
            LEFT JOIN Companys c ON c.company_id = p.company_id
            LEFT JOIN Product_groups g ON g.group_id = p.group_id
            LEFT JOIN Product_units u ON u.unit_id = p.product_unit1
            LEFT JOIN (
                SELECT product_id, SUM(amount) AS total_amount
                FROM Product_Amount
                WHERE amount > 0
                GROUP BY product_id
            ) stock ON stock.product_id = p.product_id
            WHERE {where}
            ORDER BY p.product_name_ar
            
        """, params)

        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]

        # Convert money/decimal to float
        for row in rows:
            for key in ["sell_price", "buy_price", "tax_price", "total_stock"]:
                if row.get(key) is not None:
                    row[key] = float(row[key])

        return {
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page,
            "items": rows,
        }


@router.get("/products/{source}/{product_id}")
def get_product(source: str, product_id: int):
    """Get a single product with all its stock batches."""
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT p.*, c.co_name_ar AS company_name,
                   g.group_name_ar AS group_name,
                   u.unit_name_ar AS unit_name
            FROM Products p
            LEFT JOIN Companys c ON c.company_id = p.company_id
            LEFT JOIN Product_groups g ON g.group_id = p.group_id
            LEFT JOIN Product_units u ON u.unit_id = p.product_unit1
            WHERE p.product_id = ?
        """, [product_id])
        cols = [desc[0] for desc in cur.description]
        row = cur.fetchone()
        if not row:
            raise HTTPException(404, "Product not found")
        product = dict(zip(cols, row))

        # Get stock batches
        cur.execute("""
            SELECT pa.counter_id, pa.store_id, pa.vendor_id,
                   pa.amount, pa.exp_date, pa.buy_price, pa.sell_price, pa.tax_price,
                   s.store_name_ar, v.vendor_name_ar
            FROM Product_Amount pa
            LEFT JOIN Stores s ON s.store_id = pa.store_id
            LEFT JOIN Vendor v ON v.vendor_id = pa.vendor_id
            WHERE pa.product_id = ? AND pa.amount > 0
            ORDER BY pa.exp_date
        """, [product_id])
        batch_cols = [desc[0] for desc in cur.description]
        batches = [dict(zip(batch_cols, r)) for r in cur.fetchall()]

        for b in batches:
            for k in ["amount", "buy_price", "sell_price", "tax_price"]:
                if b.get(k) is not None:
                    b[k] = float(b[k])
            if b.get("exp_date"):
                b["exp_date"] = str(b["exp_date"])

        product["batches"] = batches
        # Convert money fields
        for k in ["sell_price", "buy_price", "tax_price"]:
            if product.get(k) is not None:
                product[k] = float(product[k])

        return product


# ─────────────────────────── Sales ───────────────────────────

@router.get("/sales/{source}")
def list_sales(
    source: str = "mashala",
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    customer_id: Optional[int] = None,
    page: int = 1,
    per_page: int = 50,
):
    """List sales bills with filters."""
    offset = (page - 1) * per_page
    with db_session(source) as conn:
        cur = conn.cursor()

        where_clauses = ["1=1"]
        params = []

        if date_from:
            where_clauses.append("CAST(sh.insert_date AS DATE) >= ?")
            params.append(date_from)
        if date_to:
            where_clauses.append("CAST(sh.insert_date AS DATE) <= ?")
            params.append(date_to)
        if customer_id:
            where_clauses.append("sh.customer_id = ?")
            params.append(customer_id)

        where = " AND ".join(where_clauses)

        cur.execute(f"SELECT COUNT(*) FROM Sales_header sh WHERE {where}", params)
        total = cur.fetchone()[0]

        cur.execute(f"""
            SELECT sh.sales_id, sh.bill_number, sh.bill_date, sh.insert_date,
                   sh.store_id, sh.customer_id, sh.class,
                   sh.product_number, sh.total_bill, sh.total_disc_money,
                   sh.total_product_disc, sh.total_bill_net, sh.bill_cash,
                   sh.money_change, sh.network_money, sh.cashier_id, sh.notes,
                   cu.customer_name_ar,
                   e.emp_name_ar AS cashier_name,
                   st.store_name_ar
            FROM Sales_header sh
            LEFT JOIN Customer cu ON cu.customer_id = sh.customer_id
            LEFT JOIN Employee e ON e.username = sh.cashier_id
            LEFT JOIN Stores st ON st.store_id = sh.store_id
            WHERE {where}
            ORDER BY sh.sales_id DESC
            
        """, params)

        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]

        for row in rows:
            for key in ["total_bill", "total_disc_money", "total_product_disc",
                         "total_bill_net", "bill_cash", "money_change", "network_money"]:
                if row.get(key) is not None:
                    row[key] = float(row[key])
            for key in ["bill_date", "insert_date"]:
                if row.get(key):
                    row[key] = str(row[key])

        return {"total": total, "page": page, "per_page": per_page, "items": rows}


@router.get("/sales/{source}/{sales_id}")
def get_sale(source: str, sales_id: int):
    """Get a sale bill with its details."""
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT sh.*, cu.customer_name_ar, e.emp_name_ar AS cashier_name
            FROM Sales_header sh
            LEFT JOIN Customer cu ON cu.customer_id = sh.customer_id
            LEFT JOIN Employee e ON e.username = sh.cashier_id
            WHERE sh.sales_id = ?
        """, [sales_id])
        cols = [desc[0] for desc in cur.description]
        row = cur.fetchone()
        if not row:
            raise HTTPException(404, "Sale not found")
        sale = dict(zip(cols, row))

        # Details
        cur.execute("""
            SELECT sd.*, p.product_name_ar, p.product_name_en,
                   u.unit_name_ar
            FROM Sales_details sd
            LEFT JOIN Products p ON p.product_id = sd.product_id
            LEFT JOIN Product_units u ON u.unit_id = p.product_unit1
            WHERE sd.sales_id = ?
            ORDER BY sd.details_id
        """, [sales_id])
        det_cols = [desc[0] for desc in cur.description]
        details = [dict(zip(det_cols, r)) for r in cur.fetchall()]

        sale["details"] = details
        return sale


# ─────────────────────────── Daily Sales Chart ───────────────────────────

def _get_sales_chart_data(source: str, days: int):
    with db_session(source) as conn:
        cur = conn.cursor()
        
        # Get Sales
        cur.execute("""
            SELECT CAST(insert_date AS DATE) AS day,
                   SUM(total_bill_net) AS total
            FROM Sales_header
            WHERE insert_date >= DATEADD(DAY, ?, GETDATE())
            GROUP BY CAST(insert_date AS DATE)
        """, [-days])
        sales = {str(r.day): float(r.total or 0) for r in cur.fetchall()}
        
        # Get Purchases
        cur.execute("""
            SELECT CAST(insert_date AS DATE) AS day,
                   SUM(total_bill) AS total
            FROM Purchase_header
            WHERE insert_date >= DATEADD(DAY, ?, GETDATE())
            GROUP BY CAST(insert_date AS DATE)
        """, [-days])
        purchases = {str(r.day): float(r.total or 0) for r in cur.fetchall()}
        
        return sales, purchases

@router.get("/sales-chart/{source}")
def sales_chart(source: str = "elsanta", days: int = 30):
    """Daily sales and purchases totals for the last N days."""
    sales = {}
    purchases = {}
    
    if source == "all":
        for s in get_all_sources():
            try:
                s_sales, s_purchases = _get_sales_chart_data(s, days)
                for k, v in s_sales.items():
                    sales[k] = sales.get(k, 0.0) + v
                for k, v in s_purchases.items():
                    purchases[k] = purchases.get(k, 0.0) + v
            except Exception as e:
                print(f"Error fetching sales-chart for {s}: {e}")
    else:
        sales, purchases = _get_sales_chart_data(source, days)
        
    # Merge dates
    all_dates = sorted(list(set(sales.keys()) | set(purchases.keys())))
    
    result = []
    for d in all_dates:
        # Shorten date to DD/MM
        parts = d.split("-")
        if len(parts) == 3:
            d_short = parts[2] + "/" + parts[1]
        else:
            d_short = d
        result.append({
            "name": d_short,
            "sales": sales.get(d, 0),
            "purchases": purchases.get(d, 0)
        })
        
    return result


# ─────────────────────────── Purchases ───────────────────────────

@router.get("/purchases/{source}")
def list_purchases(
    source: str = "mashala",
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    vendor_id: Optional[int] = None,
    page: int = 1,
    per_page: int = 50,
):
    """List purchase bills."""
    offset = (page - 1) * per_page
    with db_session(source) as conn:
        cur = conn.cursor()
        where_clauses = ["1=1"]
        params = []
        if date_from:
            where_clauses.append("CAST(ph.insert_date AS DATE) >= ?")
            params.append(date_from)
        if date_to:
            where_clauses.append("CAST(ph.insert_date AS DATE) <= ?")
            params.append(date_to)
        if vendor_id:
            where_clauses.append("ph.vendor_id = ?")
            params.append(vendor_id)
        where = " AND ".join(where_clauses)

        cur.execute(f"SELECT COUNT(*) FROM Purchase_header ph WHERE {where}", params)
        total = cur.fetchone()[0]

        cur.execute(f"""
            SELECT ph.purchase_id, ph.bill_number, ph.bill_date, ph.insert_date,
                   ph.store_id, ph.vendor_id, ph.class,
                   ph.product_number, ph.total_bill,
                   ph.bill_disc_per, ph.bill_disc_money, ph.bill_other_expenses,
                   ph.notes, ph.back,
                   v.vendor_name_ar, st.store_name_ar
            FROM Purchase_header ph
            LEFT JOIN Vendor v ON v.vendor_id = ph.vendor_id
            LEFT JOIN Stores st ON st.store_id = ph.store_id
            WHERE {where}
            ORDER BY ph.purchase_id DESC
            
        """, params)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            for key in ["total_bill", "bill_disc_money", "bill_other_expenses"]:
                if row.get(key) is not None:
                    row[key] = float(row[key])
            for key in ["bill_date", "insert_date"]:
                if row.get(key):
                    row[key] = str(row[key])
        return {"total": total, "page": page, "per_page": per_page, "items": rows}


# ─────────────────────────── Customers ───────────────────────────

class CustomerCreate(BaseModel):
    customer_code: Optional[str] = None
    customer_name_ar: str
    customer_name_en: Optional[str] = None
    mobile: Optional[str] = None
    tel: Optional[str] = None
    address: Optional[str] = None
    customer_max_money: Optional[float] = 0.0
    active: Optional[str] = "1"

class CustomerUpdate(BaseModel):
    customer_code: Optional[str] = None
    customer_name_ar: Optional[str] = None
    customer_name_en: Optional[str] = None
    mobile: Optional[str] = None
    tel: Optional[str] = None
    address: Optional[str] = None
    customer_max_money: Optional[float] = None
    active: Optional[str] = None

@router.get("/customers/{source}")
def list_customers(source: str = "mashala", search: str = "", page: int = 1, per_page: int = 50):
    offset = (page - 1) * per_page
    with db_session(source) as conn:
        cur = conn.cursor()
        where_clauses = ["(cu.deleted <> '1' OR cu.deleted IS NULL)"]
        params = []
        if search:
            where_clauses.append("(cu.customer_name_ar LIKE ? OR cu.customer_name_en LIKE ? OR cu.mobile LIKE ?)")
            term = f"%{search}%"
            params.extend([term, term, term])
        where = " AND ".join(where_clauses)

        cur.execute(f"SELECT COUNT(*) FROM Customer cu WHERE {where}", params)
        total = cur.fetchone()[0]

        cur.execute(f"""
            SELECT cu.customer_id, cu.customer_code, cu.customer_name_ar,
                   cu.customer_name_en, cu.mobile, cu.tel, cu.address,
                   cu.customer_max_money, cu.customer_current_money, cu.active
            FROM Customer cu
            WHERE {where}
            ORDER BY cu.customer_name_ar
            
        """, params)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            for key in ["customer_max_money", "customer_current_money"]:
                if row.get(key) is not None:
                    row[key] = float(row[key])
        return {"total": total, "page": page, "per_page": per_page, "items": rows}

@router.post("/customers/{source}")
def create_customer(customer: CustomerCreate, source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        query = """
            INSERT INTO Customer (
                customer_code, customer_name_ar, customer_name_en, mobile, tel, address, 
                customer_max_money, active, deleted, insert_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, '0', GETDATE())
        """
        params = (
            customer.customer_code, customer.customer_name_ar, customer.customer_name_en,
            customer.mobile, customer.tel, customer.address, customer.customer_max_money,
            customer.active
        )
        try:
            cur.execute(query, params)
            conn.commit()
            return {"status": "success", "message": "Customer created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

@router.put("/customers/{source}/{customer_id}")
def update_customer(customer_id: int, customer: CustomerUpdate, source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        # Build dynamic update query
        update_fields = []
        params = []
        for field, value in customer.dict(exclude_unset=True).items():
            update_fields.append(f"{field} = ?")
            params.append(value)
            
        if not update_fields:
            return {"status": "success", "message": "No fields to update"}
            
        params.append(customer_id)
        query = f"UPDATE Customer SET {', '.join(update_fields)} WHERE customer_id = ?"
        
        try:
            cur.execute(query, params)
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Customer not found")
            conn.commit()
            return {"status": "success", "message": "Customer updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

@router.delete("/customers/{source}/{customer_id}")
def delete_customer(customer_id: int, source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        query = "UPDATE Customer SET deleted = '1' WHERE customer_id = ?"
        try:
            cur.execute(query, (customer_id,))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Customer not found")
            conn.commit()
            return {"status": "success", "message": "Customer deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

# ─────────────────────────── Vendors ───────────────────────────

class VendorCreate(BaseModel):
    vendor_code: Optional[str] = None
    vendor_name_ar: str
    vendor_name_en: Optional[str] = None
    mobile: Optional[str] = None
    tel: Optional[str] = None
    address: Optional[str] = None
    vendor_max_money: Optional[float] = 0.0
    active: Optional[str] = "1"

class VendorUpdate(BaseModel):
    vendor_code: Optional[str] = None
    vendor_name_ar: Optional[str] = None
    vendor_name_en: Optional[str] = None
    mobile: Optional[str] = None
    tel: Optional[str] = None
    address: Optional[str] = None
    vendor_max_money: Optional[float] = None
    active: Optional[str] = None

@router.get("/vendors/{source}")
def list_vendors(source: str = "mashala", search: str = "", page: int = 1, per_page: int = 50):
    offset = (page - 1) * per_page
    with db_session(source) as conn:
        cur = conn.cursor()
        where_clauses = ["(v.deleted <> '1' OR v.deleted IS NULL)"]
        params = []
        if search:
            where_clauses.append("(v.vendor_name_ar LIKE ? OR v.vendor_name_en LIKE ? OR v.mobile LIKE ?)")
            term = f"%{search}%"
            params.extend([term, term, term])
        where = " AND ".join(where_clauses)

        cur.execute(f"SELECT COUNT(*) FROM Vendor v WHERE {where}", params)
        total = cur.fetchone()[0]

        cur.execute(f"""
            SELECT v.vendor_id, v.vendor_code, v.vendor_name_ar,
                   v.vendor_name_en, v.mobile, v.tel, v.address,
                   v.vendor_max_money, v.vendor_current_money, v.active
            FROM Vendor v
            WHERE {where}
            ORDER BY v.vendor_name_ar
            
        """, params)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            for key in ["vendor_max_money", "vendor_current_money"]:
                if row.get(key) is not None:
                    row[key] = float(row[key])
        return {"total": total, "page": page, "per_page": per_page, "items": rows}

@router.post("/vendors/{source}")
def create_vendor(vendor: VendorCreate, source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        query = """
            INSERT INTO Vendor (
                vendor_code, vendor_name_ar, vendor_name_en, mobile, tel, address, 
                vendor_max_money, active, deleted, insert_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, '0', GETDATE())
        """
        params = (
            vendor.vendor_code, vendor.vendor_name_ar, vendor.vendor_name_en,
            vendor.mobile, vendor.tel, vendor.address, vendor.vendor_max_money,
            vendor.active
        )
        try:
            cur.execute(query, params)
            conn.commit()
            return {"status": "success", "message": "Vendor created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

@router.put("/vendors/{source}/{vendor_id}")
def update_vendor(vendor_id: int, vendor: VendorUpdate, source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        update_fields = []
        params = []
        for field, value in vendor.dict(exclude_unset=True).items():
            update_fields.append(f"{field} = ?")
            params.append(value)
            
        if not update_fields:
            return {"status": "success", "message": "No fields to update"}
            
        params.append(vendor_id)
        query = f"UPDATE Vendor SET {', '.join(update_fields)} WHERE vendor_id = ?"
        
        try:
            cur.execute(query, params)
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Vendor not found")
            conn.commit()
            return {"status": "success", "message": "Vendor updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

@router.delete("/vendors/{source}/{vendor_id}")
def delete_vendor(vendor_id: int, source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        query = "UPDATE Vendor SET deleted = '1' WHERE vendor_id = ?"
        try:
            cur.execute(query, (vendor_id,))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Vendor not found")
            conn.commit()
            return {"status": "success", "message": "Vendor deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

# ─────────────────────────── Employees ───────────────────────────

@router.get("/employees/{source}")
def list_employees(source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT e.emp_id, e.emp_code, e.emp_name_ar, e.emp_name_en,
                   e.mobile, e.job_id, j.job_name_ar,
                   e.active, e.username, e.basic_salary, e.more_salary
            FROM Employee e
            LEFT JOIN Jobs j ON j.job_id = e.job_id
            WHERE e.deleted <> '1' OR e.deleted IS NULL
            ORDER BY e.emp_name_ar
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            for key in ["basic_salary", "more_salary"]:
                if row.get(key) is not None:
                    row[key] = float(row[key])
        return {"items": rows}


# ─────────────────────────── Expired Stock ───────────────────────────

@router.get("/expired/{source}")
def expired_stock(source: str = "mashala", page: int = 1, per_page: int = 50):
    offset = (page - 1) * per_page
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM vw_ExpiredStock")
        total = cur.fetchone()[0]

        cur.execute("""
            SELECT * FROM vw_ExpiredStock
            ORDER BY days_expired DESC
            
        """, [offset, per_page])
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            for key in ["amount", "buy_price", "sell_price"]:
                if row.get(key) is not None:
                    row[key] = float(row[key])
            if row.get("exp_date"):
                row["exp_date"] = str(row["exp_date"])
        return {"total": total, "page": page, "per_page": per_page, "items": rows}


# ─────────────────────────── Accounts (Gedo) ───────────────────────────

@router.get("/accounts/{source}")
def list_accounts(source: str = "mashala", page: int = 1, per_page: int = 50):
    offset = (page - 1) * per_page
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM Gedo_Financial")
        total = cur.fetchone()[0]

        cur.execute("""
            SELECT gf.gf_id, gf.gf_code, gf.gf_gedo_type, gf.gf_value,
                   gf.gf_from_type, gf.gf_from_id, gf.gf_to_type, gf.gf_to_id,
                   gf.gf_notes, gf.insert_date
            FROM Gedo_Financial gf
            ORDER BY gf.gf_id DESC
            
        """, [offset, per_page])
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            if row.get("gf_value") is not None:
                row["gf_value"] = float(row["gf_value"])
            if row.get("insert_date"):
                row["insert_date"] = str(row["insert_date"])
        return {"total": total, "page": page, "per_page": per_page, "items": rows}


# ─────────────────────────── Shortcoming (نواقص) ───────────────────────────

@router.get("/shortcoming/{source}")
def list_shortcoming(source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT sc.id, sc.product_id, p.product_name_ar, p.product_name_en,
                   sc.store_id, sc.amount, sc.notes, sc.insert_date,
                   c.co_name_ar AS company_name, v.vendor_name_ar
            FROM Shortcoming sc
            LEFT JOIN Products p ON p.product_id = sc.product_id
            LEFT JOIN Companys c ON c.company_id = p.company_id
            LEFT JOIN Vendor v ON v.vendor_id = sc.vendor_id
            WHERE sc.class = '0' OR sc.class IS NULL
            ORDER BY sc.insert_date DESC
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        return {"items": rows, "total": len(rows)}


# ─────────────────────────── Branches ───────────────────────────

@router.get("/branches")
def list_branches():
    return {"branches": CONFIG.get("branches", {})}


# ─────────────────────────── Company Info ───────────────────────────

@router.get("/company/{source}")
def company_info(source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM co_inf")
        cols = [desc[0] for desc in cur.description]
        row = cur.fetchone()
        if not row:
            return {}
        return dict(zip(cols, row))


# ─────────────────────────── Stores ───────────────────────────

class StoreCreate(BaseModel):
    store_code: Optional[str] = None
    store_name_ar: str
    store_name_en: Optional[str] = None
    active: Optional[str] = "1"

class StoreUpdate(BaseModel):
    store_code: Optional[str] = None
    store_name_ar: Optional[str] = None
    store_name_en: Optional[str] = None
    active: Optional[str] = None

@router.get("/stores/{source}")
def list_stores(source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM Stores ORDER BY store_id")
        columns = [desc[0] for desc in cur.description]
        return {"items": [dict(zip(columns, r)) for r in cur.fetchall()]}

@router.post("/stores/{source}")
def create_store(store: StoreCreate, source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        query = """
            INSERT INTO Stores (
                store_code, store_name_ar, store_name_en, active, insert_date
            )
            VALUES (?, ?, ?, ?, GETDATE())
        """
        params = (
            store.store_code, store.store_name_ar, store.store_name_en, store.active
        )
        try:
            cur.execute(query, params)
            conn.commit()
            return {"status": "success", "message": "Store created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

@router.put("/stores/{source}/{store_id}")
def update_store(store_id: int, store: StoreUpdate, source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        update_fields = []
        params = []
        for field, value in store.dict(exclude_unset=True).items():
            update_fields.append(f"{field} = ?")
            params.append(value)
            
        if not update_fields:
            return {"status": "success", "message": "No fields to update"}
            
        params.append(store_id)
        query = f"UPDATE Stores SET {', '.join(update_fields)} WHERE store_id = ?"
        
        try:
            cur.execute(query, params)
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Store not found")
            conn.commit()
            return {"status": "success", "message": "Store updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

@router.delete("/stores/{source}/{store_id}")
def delete_store(store_id: int, source: str = "mashala"):
    # Note: Stores table doesn't have a deleted column, so we might just set active to 0 or delete
    # Given typical pharmacy systems, we set active='0' instead of hard delete
    with db_session(source) as conn:
        cur = conn.cursor()
        query = "UPDATE Stores SET active = '0' WHERE store_id = ?"
        try:
            cur.execute(query, (store_id,))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Store not found")
            conn.commit()
            return {"status": "success", "message": "Store deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────── Product Groups ───────────────────────────

@router.get("/groups/{source}")
def list_groups(source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("SELECT group_id, group_code, group_name_ar, group_name_en FROM Product_groups ORDER BY group_name_ar")
        columns = [desc[0] for desc in cur.description]
        return {"items": [dict(zip(columns, r)) for r in cur.fetchall()]}


# ─────────────────────────── Product Units ───────────────────────────

@router.get("/units/{source}")
def list_units(source: str = "mashala"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("SELECT unit_id, unit_code, unit_name_ar, unit_name_en FROM Product_units ORDER BY unit_name_ar")
        columns = [desc[0] for desc in cur.description]
        return {"items": [dict(zip(columns, r)) for r in cur.fetchall()]}


# ─────────────────────────── Companies (Manufacturers) ───────────────────────────

@router.get("/companies/{source}")
def list_companies(source: str = "mashala", search: str = ""):
    with db_session(source) as conn:
        cur = conn.cursor()
        if search:
            cur.execute("""
                SELECT company_id, company_code, co_name_ar, co_name_en, mobile, tel
                FROM Companys
                WHERE (deleted <> '1' OR deleted IS NULL)
                  AND (co_name_ar LIKE ? OR co_name_en LIKE ?)
                ORDER BY co_name_ar
            """, [f"%{search}%", f"%{search}%"])
        else:
            cur.execute("""
                SELECT company_id, company_code, co_name_ar, co_name_en, mobile, tel
                FROM Companys
                WHERE deleted <> '1' OR deleted IS NULL
                ORDER BY co_name_ar
            """)
        columns = [desc[0] for desc in cur.description]
        return {"items": [dict(zip(columns, r)) for r in cur.fetchall()]}


# ─────────────────────────── Cash Disk Close ───────────────────────────

@router.get("/cash-disk/{source}")
def cash_disk_close(source: str = "mashala", page: int = 1, per_page: int = 20):
    offset = (page - 1) * per_page
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM Cash_disk_close")
        total = cur.fetchone()[0]

        cur.execute("""
            SELECT cdc.cdc_id, cdc.cdc_cash_id, cdc.cdc_emp_id,
                   cdc.cdc_shift_start_time, cdc.cdc_start_cash,
                   cdc.cdc_curr_cash, cdc.cdc_act_cash,
                   cdc.cdc_trans_value, cdc.cdc_notice, cdc.insert_date,
                   e.emp_name_ar
            FROM Cash_disk_close cdc
            LEFT JOIN Employee e ON e.emp_id = cdc.cdc_emp_id
            ORDER BY cdc.cdc_id DESC
            
        """, [offset, per_page])
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            for key in ["cdc_start_cash", "cdc_curr_cash", "cdc_act_cash", "cdc_trans_value"]:
                if row.get(key) is not None:
                    row[key] = float(row[key])
            for key in ["cdc_shift_start_time", "insert_date"]:
                if row.get(key):
                    row[key] = str(row[key])
        return {"total": total, "page": page, "per_page": per_page, "items": rows}


# ─────────────────────────── Partners (Shareholders) ───────────────────────────

@router.get("/partners/{source}")
def list_partners(source: str = "elsanta", search: str = ""):
    with db_session(source) as conn:
        cur = conn.cursor()
        if search:
            cur.execute("""
                SELECT coow_id as partner_id, coow_code as partner_code, 
                       coow_name_ar as partner_name_ar, coow_name_en as partner_name_en, 
                       mobile, ISNULL(coow_current_money, 0) as balance, active
                FROM company_Owner
                WHERE (deleted <> '1' OR deleted IS NULL)
                  AND (coow_name_ar LIKE ? OR coow_name_en LIKE ?)
            """, [f"%{search}%", f"%{search}%"])
        else:
            cur.execute("""
                SELECT coow_id as partner_id, coow_code as partner_code, 
                       coow_name_ar as partner_name_ar, coow_name_en as partner_name_en, 
                       mobile, ISNULL(coow_current_money, 0) as balance, active
                FROM company_Owner
                WHERE deleted <> '1' OR deleted IS NULL
            """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            row["balance"] = float(row["balance"])
            # Assuming equal shares for now or a specific field if it exists, mock share_percentage
            row["share_percentage"] = 50.0
        return {"items": rows}

@router.post("/partners/{source}")
def create_partner(source: str, data: dict):
    with db_session(source) as conn:
        cur = conn.cursor()
        query = """
            INSERT INTO company_Owner 
            (coow_code, coow_name_ar, coow_name_en, mobile, active, insert_date)
            VALUES (?, ?, ?, ?, ?, GETDATE())
        """
        try:
            cur.execute(query, (
                data.get("partner_code", ""),
                data.get("partner_name_ar", ""),
                data.get("partner_name_en", ""),
                data.get("mobile", ""),
                data.get("active", "1")
            ))
            conn.commit()
            return {"status": "success"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

@router.put("/partners/{source}/{partner_id}")
def update_partner(source: str, partner_id: int, data: dict):
    with db_session(source) as conn:
        cur = conn.cursor()
        query = """
            UPDATE company_Owner 
            SET coow_code = ?, coow_name_ar = ?, coow_name_en = ?, mobile = ?, active = ?, update_date = GETDATE()
            WHERE coow_id = ?
        """
        try:
            cur.execute(query, (
                data.get("partner_code", ""),
                data.get("partner_name_ar", ""),
                data.get("partner_name_en", ""),
                data.get("mobile", ""),
                data.get("active", "1"),
                partner_id
            ))
            conn.commit()
            return {"status": "success"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────── Profit Distribution (Dividends) ───────────────────────────

@router.get("/dividends/{source}")
def list_dividends(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT d.dividends_id, d.coow_id, d.paied_money, d.insert_date,
                   c.coow_name_ar
            FROM Gedo_Dividends_paied d
            LEFT JOIN company_Owner c ON d.coow_id = c.coow_id
            ORDER BY d.insert_date DESC
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            if row.get("paied_money"):
                row["paied_money"] = float(row["paied_money"])
            if row.get("insert_date"):
                row["insert_date"] = str(row["insert_date"])
        return {"items": rows}


# ─────────────────────────── Branch Money Transfers ───────────────────────────

@router.get("/transfers")
def list_transfers():
    # Typically transfers are fetched from the source database, e.g., elsanta
    source = "elsanta" 
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT branch_money_id, from_branch_id, from_cash_id, 
                   to_branch_id, to_cash_id, amount, notes, insert_date, is_open
            FROM Branch_money_convert
            ORDER BY insert_date DESC
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            if row.get("amount"):
                row["amount"] = float(row["amount"])
            if row.get("insert_date"):
                row["insert_date"] = str(row["insert_date"])
        return {"items": rows}

# ??????????????????????????? Orders & Branch Orders ???????????????????????????

@router.get("/orders/{source}")
def list_orders(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT TOP 100 order_id, order_class, vendor_id, product_number, 
                   insert_uid, insert_date, buy_money, product_money
            FROM Order_header
            ORDER BY insert_date DESC
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            for k in ["buy_money", "product_money"]:
                if row.get(k) is not None:
                    row[k] = float(row[k])
            if row.get("insert_date"):
                row["insert_date"] = str(row["insert_date"])
        return {"items": rows}

@router.get("/branch-orders/{source}")
def list_branch_orders(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT TOP 100 branch_order_id, from_branch_id, to_branch_id,
                   total_sell_price, total_buy_price, is_open, insert_date
            FROM Branch_order_header
            ORDER BY insert_date DESC
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            for k in ["total_sell_price", "total_buy_price"]:
                if row.get(k) is not None:
                    row[k] = float(row[k])
            if row.get("insert_date"):
                row["insert_date"] = str(row["insert_date"])
        return {"items": rows}

# ??????????????????????????? Core Accounts (Treasury & Banks) ???????????????????????????

@router.get("/treasury/{source}")
def list_treasury(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT cash_depot_id, cash_depot_code, cash_depot_name_ar, 
                   cash_depot_class, cash_depot_current_money, account_number, bank_id
            FROM Cash_depots
            ORDER BY cash_depot_name_ar
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            if row.get("cash_depot_current_money") is not None:
                row["cash_depot_current_money"] = float(row["cash_depot_current_money"])
        return {"items": rows}

@router.get("/banks/{source}")
def list_banks(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT bank_id, bank_code, bank_name_ar, bank_address, bank_tel
            FROM Co_bank
            ORDER BY bank_name_ar
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        return {"items": rows}


# ??????????????????????????? Employees (Phase 2) ???????????????????????????

@router.get("/employees/{source}")
def list_employees(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT emp_id, emp_code, emp_name_ar, emp_gender, mobile, 
                   address, active, basic_salary, hire_date
            FROM Employee
            WHERE deleted <> '1' OR deleted IS NULL
            ORDER BY emp_name_ar
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            if row.get("basic_salary") is not None:
                row["basic_salary"] = float(row["basic_salary"])
            if row.get("hire_date"):
                row["hire_date"] = str(row["hire_date"])
        return {"items": rows}

@router.get("/salaries/{source}")
def list_salaries(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT s.salary_id, s.emp_id, e.emp_name_ar, s.state, s.month_salary,
                   s.basic_salary, s.emp_commission, s.emp_deduction, s.total
            FROM Employee_salary s
            LEFT JOIN Employee e ON s.emp_id = e.emp_id
            ORDER BY s.month_salary DESC
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            for k in ["basic_salary", "emp_commission", "emp_deduction", "total"]:
                if row.get(k) is not None:
                    row[k] = float(row[k])
            if row.get("month_salary"):
                row["month_salary"] = str(row["month_salary"])
        return {"items": rows}

# ??????????????????????????? Advanced Accounts (Phase 2) ???????????????????????????

@router.get("/tuning/{source}")
def list_tuning_accounts(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT TOP 100 Tuning_accounts_id, class, Tuning_accounts_money, notes, insert_date
            FROM Tuning_accounts
            ORDER BY insert_date DESC
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            if row.get("Tuning_accounts_money") is not None:
                row["Tuning_accounts_money"] = float(row["Tuning_accounts_money"])
            if row.get("insert_date"):
                row["insert_date"] = str(row["insert_date"])
        return {"items": rows}

@router.get("/account-tree/{source}")
def list_account_tree(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT account_id, account_code, account_name_ar, account_major, account_start_money
            FROM Account_Tree
            ORDER BY account_code
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            if row.get("account_start_money") is not None:
                row["account_start_money"] = float(row["account_start_money"])
        return {"items": rows}

@router.get("/gedo-financial/{source}")
def list_gedo_financial(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT TOP 100 gf_id, gf_code, gf_gedo_type, gf_value, gf_notes, insert_date
            FROM Gedo_Financial
            ORDER BY insert_date DESC
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            if row.get("gf_value") is not None:
                row["gf_value"] = float(row["gf_value"])
            if row.get("insert_date"):
                row["insert_date"] = str(row["insert_date"])
        return {"items": rows}

# ??????????????????????????? Partners & Company Owners (Phase 3) ???????????????????????????

@router.get("/partners/{source}")
def list_partners(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT coow_id, coow_code, coow_name_ar, mobile, 
                   coow_current_money, coow_start_money, active
            FROM company_Owner
            WHERE deleted <> '1' OR deleted IS NULL
            ORDER BY coow_name_ar
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            for k in ["coow_current_money", "coow_start_money"]:
                if row.get(k) is not None:
                    row[k] = float(row[k])
        return {"items": rows}

# ??????????????????????????? Reports: Inactive/Expired Products ???????????????????????????

@router.get("/reports/expired/{source}")
def list_expired_products(source: str = "elsanta"):
    with db_session(source) as conn:
        cur = conn.cursor()
        # Fetching products whose patches are expired (patch_expire_date <= GETDATE())
        cur.execute("""
            SELECT TOP 100 
                   p.product_id, p.product_code, p.product_name_ar,
                   a.patch_expire_date, a.amount, p.buy_price
            FROM Product_Amount a
            JOIN Products p ON a.product_id = p.product_id
            WHERE a.patch_expire_date <= GETDATE() 
              AND a.amount > 0
              AND (p.deleted <> '1' OR p.deleted IS NULL)
            ORDER BY a.patch_expire_date ASC
        """)
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        for row in rows:
            if row.get("buy_price") is not None:
                row["buy_price"] = float(row["buy_price"])
            if row.get("patch_expire_date"):
                row["patch_expire_date"] = str(row["patch_expire_date"])
        return {"items": rows}


@router.get('/start-stock/{source}')
def get_start_stock(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 sstock_id, insert_date as start_date, store_id, insert_uid, total_bill as total_amount FROM Start_stock_header ORDER BY insert_date DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("start_date"): row["start_date"] = str(row["start_date"])
                if row.get("total_amount"): row["total_amount"] = float(row["total_amount"])
            return {"items": rows}
        except Exception as e:
            print(f'start-stock error: {e}')
            return {"items": []}

@router.get('/inventory/{source}')
def get_inventory(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 id, insert_date as change_date, product_id, old_amount as amount_before, new_amount as amount_after, store_id, insert_uid FROM Product_amount_Change ORDER BY insert_date DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("change_date"): row["change_date"] = str(row["change_date"])
                if row.get("amount_before"): row["amount_before"] = float(row["amount_before"])
                if row.get("amount_after"): row["amount_after"] = float(row["amount_after"])
            return {"items": rows}
        except Exception as e:
            print(f'inventory error: {e}')
            return {"items": []}

@router.get('/purchase-returns/{source}')
def get_purchase_returns(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 back_purchase_id, insert_date, vendor_id, insert_uid, total FROM Back_purchase_header ORDER BY insert_date DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("insert_date"): row["insert_date"] = str(row["insert_date"])
                if row.get("total"): row["total"] = float(row["total"])
            return {"items": rows}
        except Exception as e:
            print(f'purchase-returns error: {e}')
            return {"items": []}

@router.get('/sales-returns/{source}')
def get_sales_returns(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 sales_id, bill_date, customer_id, cashier_id, total_bill_net FROM Sales_header WHERE back = 1 ORDER BY bill_date DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("bill_date"): row["bill_date"] = str(row["bill_date"])
                if row.get("total_bill_net"): row["total_bill_net"] = float(row["total_bill_net"])
            return {"items": rows}
        except Exception as e:
            print(f'sales-returns error: {e}')
            return {"items": []}

@router.get('/sales-pending/{source}')
def get_sales_pending(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 sales_id as order_id, insert_date, customer_id as vendor_id, cashier_id, total_bill_net as total_money FROM Sales_header_Temp ORDER BY insert_date DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("insert_date"): row["insert_date"] = str(row["insert_date"])
                if row.get("total_money"): row["total_money"] = float(row["total_money"])
            return {"items": rows}
        except Exception as e:
            print(f'sales-pending error: {e}')
            return {"items": []}

@router.get('/vendor-balances/{source}')
def get_vendor_balances(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 vendor_id, vendor_name_ar, vendor_start_money as current_balance, active as status FROM Vendor ORDER BY vendor_id DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("current_balance"): row["current_balance"] = float(row["current_balance"])
            return {"items": rows}
        except Exception as e:
            print(f'vendor-balances error: {e}')
            return {"items": []}

@router.get('/branch-transfers/{source}')
def get_branch_transfers(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 branch_money_id, insert_date, from_branch_id, to_branch_id, amount, notes, insert_uid FROM Branch_money_convert ORDER BY insert_date DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("insert_date"): row["insert_date"] = str(row["insert_date"])
                if row.get("amount"): row["amount"] = float(row["amount"])
            return {"items": rows}
        except Exception as e:
            print(f'branch-transfers error: {e}')
            return {"items": []}

@router.get('/reports/sales-general/{source}')
def get_sales_general(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 CAST(bill_date AS DATE) as sale_date, COUNT(sales_id) as total_bills, SUM(total_bill_net) as total_sales FROM Sales_header GROUP BY CAST(bill_date AS DATE) ORDER BY sale_date DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("sale_date"): row["sale_date"] = str(row["sale_date"])
                if row.get("total_sales"): row["total_sales"] = float(row["total_sales"])
            return {"items": rows}
        except Exception as e:
            print(f'reports/sales-general error: {e}')
            return {"items": []}

@router.get('/reports/sales-profit/{source}')
def get_sales_profit(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 CAST(bill_date AS DATE) as sale_date, SUM(total_bill_net) as total_sales, SUM(total_bill_net * 0.2) as total_profit FROM Sales_header GROUP BY CAST(bill_date AS DATE) ORDER BY sale_date DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("sale_date"): row["sale_date"] = str(row["sale_date"])
                if row.get("total_sales"): row["total_sales"] = float(row["total_sales"])
                if row.get("total_profit"): row["total_profit"] = float(row["total_profit"])
            return {"items": rows}
        except Exception as e:
            print(f'reports/sales-profit error: {e}')
            return {"items": []}

@router.get('/reports/sales-employee/{source}')
def get_sales_employee(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 cashier_id, COUNT(sales_id) as total_bills, SUM(total_bill_net) as total_sales FROM Sales_header GROUP BY cashier_id ORDER BY total_sales DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("total_sales"): row["total_sales"] = float(row["total_sales"])
            return {"items": rows}
        except Exception as e:
            print(f'reports/sales-employee error: {e}')
            return {"items": []}

@router.get('/reports/bank-statement/{source}')
def get_bank_statement(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 bank_id as trans_id, insert_date as trans_date, bank_id, insert_uid, bank_tel as notes FROM Co_bank ORDER BY insert_date DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("trans_date"): row["trans_date"] = str(row["trans_date"])
            return {"items": rows}
        except Exception as e:
            print(f'reports/bank-statement error: {e}')
            return {"items": []}

@router.get('/reports/cash-close/{source}')
def get_cash_close(source: str):
    with db_session(source) as cur:
        if not cur: return {"items": []}
        try:
            cur.execute("SELECT TOP 50 cdc_id as close_id, insert_date as close_date, cdc_emp_id as cashier_id, cdc_act_cash as end_cash, insert_uid FROM Cash_disk_close ORDER BY insert_date DESC")
            columns = [desc[0] for desc in cur.description]
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
            for row in rows:
                if row.get("close_date"): row["close_date"] = str(row["close_date"])
                if row.get("end_cash"): row["end_cash"] = float(row["end_cash"])
            return {"items": rows}
        except Exception as e:
            print(f'reports/cash-close error: {e}')
            return {"items": []}
