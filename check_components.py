import os
import re

frontend_dir = r'd:\procare_system_intelligence\frontend\src'
jsx_files = [f for f in os.listdir(frontend_dir) if f.endswith('.jsx')]
results = []

for f in jsx_files:
    if f in ['App.jsx', 'Layout.jsx', 'main.jsx', 'HeroLanding.jsx']: continue
    filepath = os.path.join(frontend_dir, f)
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
        
        api_imports = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'\"]\./api[\'\"]', content)
        
        if api_imports:
            funcs = [x.strip() for x in api_imports.group(1).split(',')]
            results.append((f, 'Connected to API', funcs))
        elif 'fetch(' in content:
            results.append((f, 'Connected to API (fetch)', []))
        else:
            if 'const data' in content and '[' in content and ']' in content:
                results.append((f, 'Mock Data / Not connected', []))
            else:
                results.append((f, 'UI Placeholder / Under Dev', []))

print('--- PAGE CONNECTION STATUS ---')
for r in sorted(results, key=lambda x: x[1]):
    print(f'{r[0]:<20} | {r[1]:<25} | {r[2]}')
