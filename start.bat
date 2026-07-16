@echo off
echo ============================================================
echo   eStock Web — Starting Full Stack
echo ============================================================
start "eStock Backend" cmd /c "%~dp0start-backend.bat"
timeout /t 3 /nobreak > nul
start "eStock Frontend" cmd /c "%~dp0start-frontend.bat"
echo.
echo   Backend:  http://localhost:8000/docs
echo   Frontend: http://localhost:5173
echo.
