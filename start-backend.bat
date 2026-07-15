@echo off
echo ============================================================
echo   eStock Web — Starting Backend (port 8000)
echo ============================================================
cd /d "%~dp0backend"
call .venv\Scripts\activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
