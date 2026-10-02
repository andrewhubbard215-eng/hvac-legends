@echo off
setlocal EnableExtensions
title Lincoln Tech HVAC Allstars
color 0C
cd /d "%~dp0"

echo.
echo  ============================================
echo   LINCOLN TECH HVAC ALLSTARS
echo   Double-click play  ·  this PC + classroom
echo  ============================================
echo.

if exist "index.html" goto :ready
echo  Keep PLAY.bat in the same folder as index.html.
pause
exit /b 1

:ready
set PORT=8080
set LANIP=127.0.0.1
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /c:"IPv4"') do (
  for /f "tokens=1" %%B in ("%%A") do set LANIP=%%B
)

echo  This PC:    http://localhost:%PORT%
echo  Students:   http://%LANIP%:%PORT%
echo.
echo  Leave this window OPEN while you play.
echo  Close it to stop.
echo.

start "" "http://localhost:%PORT%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port=%PORT%;" ^
  "$root=(Get-Location).Path;" ^
  "$l=New-Object System.Net.HttpListener;" ^
  "$l.Prefixes.Add('http://+:'+$port+'/');" ^
  "try { $l.Start() } catch { $l.Prefixes.Clear(); $l.Prefixes.Add('http://localhost:'+$port+'/'); $l.Start() };" ^
  "Write-Host ('Serving ' + $root + ' on port ' + $port);" ^
  "while ($l.IsListening) {" ^
  "  $c=$l.GetContext(); $req=$c.Request; $res=$c.Response;" ^
  "  $path=$req.Url.LocalPath.TrimStart('/'); if ([string]::IsNullOrWhiteSpace($path)) { $path='index.html' };" ^
  "  $full=Join-Path $root ($path -replace '/','\');" ^
  "  if (Test-Path $full -PathType Container) { $full=Join-Path $full 'index.html' };" ^
  "  if (Test-Path $full -PathType Leaf) {" ^
  "    $bytes=[IO.File]::ReadAllBytes($full);" ^
  "    $ext=[IO.Path]::GetExtension($full).ToLower();" ^
  "    $res.ContentType=switch ($ext) { '.html' {'text/html'} '.js' {'application/javascript'} '.css' {'text/css'} '.json' {'application/json'} '.png' {'image/png'} '.jpg' {'image/jpeg'} '.jpeg' {'image/jpeg'} '.webp' {'image/webp'} '.svg' {'image/svg+xml'} '.webmanifest' {'application/manifest+json'} '.mp4' {'video/mp4'} '.woff2' {'font/woff2'} default {'application/octet-stream'} };" ^
  "    $res.StatusCode=200; $res.ContentLength64=$bytes.Length; $res.OutputStream.Write($bytes,0,$bytes.Length)" ^
  "  } else { $res.StatusCode=404; $msg=[Text.Encoding]::UTF8.GetBytes('Not found'); $res.OutputStream.Write($msg,0,$msg.Length) };" ^
  "  $res.Close()" ^
  "}"

echo.
echo  Server stopped.
pause
