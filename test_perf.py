import requests
import time
start = time.time()
try:
    resp = requests.get('http://127.0.0.1:8000/api/products/elsanta?page=1', timeout=5)
    end = time.time()
    print(f'Status: {resp.status_code}, Time: {end - start:.2f}s')
    data = resp.json()
    print(f'Items returned: {len(data.get("items", []))}, Total: {data.get("total")}')
except Exception as e:
    print(str(e))
