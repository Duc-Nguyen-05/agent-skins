@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in PATH.
    echo Please install Node.js 22 or newer from https://nodejs.org/
    pause
    exit /b 1
)
node inject.mjs %*
pause
