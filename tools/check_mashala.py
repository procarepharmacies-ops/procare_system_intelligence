import pyodbc
import json

conn_str = "DRIVER={ODBC Driver 18 for SQL Server};SERVER=192.168.1.2,1433;DATABASE=stock;UID=ahmedibrahim;PWD=Egstart211078$;Encrypt=yes;TrustServerCertificate=yes;"

try:
    conn = pyodbc.connect(conn_str)
    cur = conn.cursor()
    
    cur.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
    tables = [row[0] for row in cur.fetchall()]
    
    print(f"Mashala tables: {len(tables)}")
    print(", ".join(tables))
except Exception as e:
    print(f"Error: {e}")
