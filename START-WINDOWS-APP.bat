@echo off
title HVAC Allstars · PC classroom
cd /d "%~dp0"

set URL=https://andrewhubbard215-eng.github.io/allstars/pc.html
if exist "index.html" (
  rem Prefer local folder if they already have PLAY-PC running; else GitHub.
  set URL=https://andrewhubbard215-eng.github.io/allstars/pc.html
)

echo.
echo  HVAC Allstars  —  PC classroom window
echo.

where msedge >nul 2>&1
if %ERRORLEVEL%==0 (
  start "HVAC Allstars PC" msedge --app="%URL%" --window-size=1600,960
  goto :done
)
where chrome >nul 2>&1
if %ERRORLEVEL%==0 (
  start "HVAC Allstars PC" chrome --app="%URL%" --window-size=1600,960
  goto :done
)

echo  Edge/Chrome not found — opening in default browser.
start "" "%URL%"

:done
echo  Phone app: use the Play Store / AAB, or Clock In on a phone.
echo  This window is the PC bench — parts, board, and gauges all on screen.
echo.
