@echo off
title Lincoln Tech HVAC Allstars - Server
cd /d "%~dp0"

echo.
echo  Starting local server on http://127.0.0.1:8765
echo  Leave this window open while you play.
echo  Press Ctrl+C to stop.
echo.

where python >nul 2>&1
if %ERRORLEVEL%==0 (
  start "" http://127.0.0.1:8765/
  python -m http.server 8765
  goto :eof
)
where py >nul 2>&1
if %ERRORLEVEL%==0 (
  start "" http://127.0.0.1:8765/
  py -m http.server 8765
  goto :eof
)

echo  Python not found. Opening index.html instead...
call "%~dp0START-WINDOWS.bat"
pause
