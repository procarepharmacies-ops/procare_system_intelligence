@echo off
echo ============================================================
echo   ProCare Dashboard - Starting Production Environment
echo ============================================================

echo Starting Unified API + Frontend Server (port 8000)...
cd /d "%~dp0backend"
call .venv\Scripts\activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

echo.
echo ============================================================
echo To expose to the internet, run start-tunnel.bat
echo ============================================================
pause
