@echo off
echo ============================================================
echo   eStock Web — Starting Frontend (port 5173)
echo ============================================================
cd /d "%~dp0frontend"
npm run dev
pause
