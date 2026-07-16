import pyodbc
import json

conn_str = "DRIVER={ODBC Driver 18 for SQL Server};SERVER=196.202.93.37,1433;DATABASE=stock;UID=ahmedpharm22;PWD=Egstart211078$;Encrypt=yes;TrustServerCertificate=yes;"

try:
    conn = pyodbc.connect(conn_str)
    cur = conn.cursor()
    
    # Get all tables
    cur.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
    tables = [row[0] for row in cur.fetchall()]
    
    schema = {}
    for table in tables:
        cur.execute(f"SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table}'")
        columns = [{"name": row[0], "type": row[1]} for row in cur.fetchall()]
        schema[table] = columns
        
    with open("schema_dump.json", "w") as f:
        json.dump(schema, f, indent=2)
        
    print(f"Schema dumped successfully to schema_dump.json with {len(tables)} tables")
except Exception as e:
    print(f"Error: {e}")
