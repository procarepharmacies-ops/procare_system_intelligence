import os
import re
import requests

frontend_dir = r'd:\procare_system_intelligence\frontend\src'
api_file = r'd:\procare_system_intelligence\backend\app\api\routes.py'

jsx_files = [f for f in os.listdir(frontend_dir) if f.endswith('.jsx')]

# Simple static analysis
results = []
endpoints_to_test = set()

for f in jsx_files:
    if f in ['App.jsx', 'Layout.jsx', 'main.jsx', 'i18n.js', 'api.js', 'HeroLanding.jsx']:
        continue
        
    filepath = os.path.join(frontend_dir, f)
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
        
        # Check for fetch calls
        fetch_matches = re.findall(r'fetch\([\'"`](/api/[^\'"`?]+)', content)
        if fetch_matches:
            for match in fetch_matches:
                endpoints_to_test.add(match)
            results.append({'file': f, 'status': 'Connected to API', 'endpoints': list(set(fetch_matches))})
        else:
            # Maybe it's just a UI page with hardcoded mock data
            if 'const ' in content and '[' in content and ']' in content and 'id:' in content:
                results.append({'file': f, 'status': 'Uses Mock Data (No Fetch)', 'endpoints': []})
            else:
                results.append({'file': f, 'status': 'No Data/Placeholder', 'endpoints': []})

print('--- FRONTEND STATIC ANALYSIS ---')
for r in sorted(results, key=lambda x: x['status']):
    print(f"{r['file']:<20}: {r['status']:<25} -> {r['endpoints']}")

print('\n--- BACKEND ENDPOINT TEST ---')
for endpoint in sorted(list(endpoints_to_test)):
    # replace parameter with a valid branch
    url = f'http://127.0.0.1:8000{endpoint}'
    url = url.replace('${selectedBranch}', 'elsanta')
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, list):
                print(f'[OK] {url} -> Returned array with {len(data)} items')
            elif isinstance(data, dict):
                print(f'[OK] {url} -> Returned object with {len(data.keys())} keys')
            else:
                print(f'[OK] {url} -> Returned {type(data)}')
        else:
            print(f'[ERROR {resp.status_code}] {url} -> {resp.text[:100]}')
    except Exception as e:
        print(f'[FAILED] {url} -> {str(e)}')
