@echo off
echo ============================================================
echo   eStock Web — Starting Cloudflare Tunnel
echo ============================================================
echo Ensure you have cloudflared installed.
echo This script will tunnel local port 8000 (Backend + Frontend) to the web.
cloudflared tunnel --protocol http2 --url http://localhost:8000
pause
