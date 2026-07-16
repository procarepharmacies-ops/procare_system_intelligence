import pyodbc
conn_str = "DRIVER={ODBC Driver 18 for SQL Server};SERVER=196.202.93.37,1433;DATABASE=stock;UID=ahmedpharm22;PWD=Egstart211078$;Encrypt=yes;TrustServerCertificate=yes;"
conn = pyodbc.connect(conn_str)
cur = conn.cursor()

print("Testing dashboard queries...")
cur.execute("SELECT COUNT(*) AS bill_count, ISNULL(SUM(total_bill_net), 0) AS total_sales FROM Sales_header WHERE CAST(insert_date AS DATE) = CAST(GETDATE() AS DATE)")
print("Today sales:", cur.fetchone())

cur.execute("SELECT COUNT(*) FROM Products WHERE deleted <> '1' OR deleted IS NULL")
print("Products:", cur.fetchone())

cur.execute("SELECT COUNT(*), ISNULL(SUM(vendor_current_money), 0) FROM Vendor WHERE deleted <> '1' OR deleted IS NULL")
print("Vendors:", cur.fetchone())

cur.execute("SELECT COUNT(*), ISNULL(SUM(customer_current_money), 0) FROM Customer WHERE deleted <> '1' OR deleted IS NULL")
print("Customers:", cur.fetchone())

cur.execute("SELECT ISNULL(SUM(CASE WHEN bank_id IS NULL THEN cash_depot_current_money ELSE 0 END), 0) as pos_cash, ISNULL(SUM(CASE WHEN bank_id IS NOT NULL THEN cash_depot_current_money ELSE 0 END), 0) as bank_cash FROM Cash_depots")
print("Treasury:", cur.fetchone())

cur.execute("SELECT ISNULL(SUM(total_bill_net), 0) FROM Sales_header WHERE YEAR(insert_date) = YEAR(GETDATE()) AND MONTH(insert_date) = MONTH(GETDATE())")
print("Month sales:", cur.fetchone())

cur.execute("SELECT ISNULL(SUM(amount * buy_price), 0) FROM Product_Amount WHERE amount > 0")
print("Stock value:", cur.fetchone())
print("Done!")
