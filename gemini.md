# Project Constitution (gemini.md)

## Data Schemas
The application connects directly to the `elsanta` SQL Server database. The primary models based on `routes.py` are:

**Dashboard KPIs**
- `today_bills`: count of `Sales_header` where `insert_date` is today
- `today_sales`: sum of `total_bill_net` where `insert_date` is today
- `products`: count of `Products` where `deleted` is not '1'
- `vendors`: count of `Vendor` where `deleted` is not '1'
- `customers`: count of `Customer` where `deleted` is not '1'

**Products**
- Table: `Products` joined with `Companys`, `Product_groups`, `Product_units`, `Product_Amount`
- Fields: `product_id`, `product_code`, `product_name_ar`, `product_name_en`, `sell_price`, `buy_price`, `total_stock`

## Behavioral Rules
- Follow B.L.A.S.T Protocol
- Data-First: Code only begins once Payload shape is confirmed.
- Deterministic scripts in `tools/`
- SOPs in `architecture/`

## Architectural Invariants
- 3-Layer Build: Architecture, Navigation, Tools
- **Branch Business Rules**:
  - `elsanta` is a company/partnership (شركة). It has shareholders (`company_Owner`) and distributes profits (`Gedo_Dividends_paied`).
  - `mashala` is entirely owned by the user (ملكي). It does not have shareholders.
  - Cash transfers (`Branch_money_convert`) between the two branches' treasuries are critical due to this ownership difference.

## Maintenance Log (Phase 5: Trigger)
- **Data Aggregation**: The `routes.py` API endpoints for `/dashboard` and `/sales-chart` dynamically sum metrics across all branches in `connections.json` when `source="all"` is requested.
- **Startup Script**: Use `start-production.bat` to launch the backend (port 8000) which serves both the API and the built React frontend (`frontend/dist`).
- **Public Tunneling**: Use `start-tunnel.bat` (which maps to port 8000 via Cloudflare) to expose the application safely to the internet.
- **Troubleshooting SQL Server**: 
  - Ensure the credentials in `config/connections.json` are correct if `pyodbc` throws login errors.
  - Test the connection manually by running `tools/handshake.py`.
- **Environment**: Backend runs FastAPI under `.venv`. Frontend runs Vite/React. Tailwind CSS v4 is configured without `postcss.config.js`.
