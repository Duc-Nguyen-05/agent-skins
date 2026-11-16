@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*watch.mjs*' } | ForEach-Object { Stop-Process -Id $_.ProcessId }"
set VBS=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\ClaudeSkin-watch.vbs
> "%VBS%" echo CreateObject("WScript.Shell").Run "cmd /c node ""%~dp0watch.mjs"" koi > ""%~dp0watch.log"" 2>&1", 0, False
start "" wscript "%VBS%"
echo [OK] Claude Koi Theme Autostart is now ON!
echo Requires Main Process Debugger to remain enabled in Claude.
echo To turn off: run autostart-off.bat
pause
