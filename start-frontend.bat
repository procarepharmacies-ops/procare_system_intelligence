@echo off
echo ============================================================
echo   eStock Web — Starting Frontend (port 3000)
echo ============================================================
cd /d "%~dp0frontend"
npm run dev
pause
