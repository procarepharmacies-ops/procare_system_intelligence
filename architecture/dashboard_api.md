# Dashboard API SOP

## Goal
Provide a unified endpoint to serve key performance indicators (KPIs) for the ProCare Dashboard UI. The data must be deterministic and pulled directly from the SQL Server database acting as the source of truth.

## Input (Request)
- **Endpoint**: `GET /api/dashboard/kpis`
- **Query Params**:
  - `source` (string, optional, default: `mashala`): The database source to connect to (`elsanta`, `mashala`, etc.).

## Logic & SQL Queries
The endpoint uses `db_session` from `app.db.connection` to execute the following queries:

1. **today_bills**:
   `SELECT COUNT(*) FROM Sales_header WHERE CAST(insert_date AS DATE) = CAST(GETDATE() AS DATE)`
2. **today_sales**:
   `SELECT COALESCE(SUM(total_bill_net), 0) FROM Sales_header WHERE CAST(insert_date AS DATE) = CAST(GETDATE() AS DATE)`
3. **products**:
   `SELECT COUNT(*) FROM Products WHERE deleted != 1`

## Output Schema (Response)
```json
{
  "source": "elsanta",
  "kpis": {
    "today_bills": 142,
    "today_sales": 45230.50,
    "products": 12500
  }
}
```

## Edge Cases
- **Missing Source**: Returns 400 Bad Request or uses a safe fallback.
- **Database Unreachable**: Returns 503 Service Unavailable with error details.
- **Null values**: SQL `COALESCE` guarantees a valid numeric value for sums.
