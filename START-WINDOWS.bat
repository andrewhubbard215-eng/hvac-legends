@echo off
title Lincoln Tech HVAC Allstars
cd /d "%~dp0"

echo.
echo  Lincoln Tech HVAC Allstars
echo  Opening in your default browser...
echo.

REM Prefer Edge/Chrome if present for best PWA install later
where msedge >nul 2>&1
if %ERRORLEVEL%==0 (
  start "" msedge "%cd%\index.html"
  goto :done
)
where chrome >nul 2>&1
if %ERRORLEVEL%==0 (
  start "" chrome "%cd%\index.html"
  goto :done
)

start "" "%cd%\index.html"

:done
echo  Tip: In Edge or Chrome use the install icon in the address bar
echo  to pin HVAC Allstars as a Windows app.
echo.
