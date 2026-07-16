import sys
from pathlib import Path

# Add the backend dir to sys.path so we can import app.db.connection
backend_path = Path(__file__).resolve().parents[1] / "backend"
sys.path.append(str(backend_path))

from app.db.connection import test_connection

def main():
    print("Testing connection to 'elsanta' source of truth...")
    result = test_connection("elsanta")
    
    if result["status"] == "connected":
        print("[SUCCESS] Connected to Elsanta DB.")
        print(f"Server: {result.get('server')}")
        print(f"Database: {result.get('database')}")
        print(f"Server Time: {result.get('server_time')}")
    else:
        print("[FAILED] Could not connect to Elsanta DB.")
        print(f"Error: {result.get('error')}")

if __name__ == "__main__":
    main()
