@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*watch.mjs*' } | ForEach-Object { Stop-Process -Id $_.ProcessId }"
set VBS=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\AntigravitySkin-watch.vbs
> "%VBS%" echo CreateObject("WScript.Shell").Run "cmd /c node ""%~dp0watch.mjs"" > ""%~dp0watch.log"" 2>&1", 0, False
start "" wscript "%VBS%"
echo [OK] Antigravity Koi Theme Autostart is now ON!
echo Whenever you start Windows or launch Antigravity App, the theme will auto-apply.
echo To turn off autostart: run autostart-off.bat
pause
