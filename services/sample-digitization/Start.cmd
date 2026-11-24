@echo off
cd /d "%~dp0"
if not exist .env (
 echo IT debe configurar .env siguiendo INSTALL.md antes de iniciar.
 pause
 exit /b 1
)
docker compose up -d --build
pause
