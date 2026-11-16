@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in PATH.
    pause
    exit /b 1
)
node off.mjs
pause
