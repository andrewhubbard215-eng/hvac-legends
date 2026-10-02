@echo off
setlocal EnableExtensions
title HVAC Allstars · PC classroom
color 0C
cd /d "%~dp0"

echo.
echo  ============================================
echo   HVAC ALLSTARS  ·  PC CLASSROOM BENCH
echo   This PC hosts  ·  phones join this Wi-Fi
echo  ============================================
echo.

if exist "index.html" goto :ready
echo  Keep PLAY-PC.bat in the same folder as index.html.
pause
exit /b 1

:ready
set PORT=8080
if not "%HVAC_PORT%"=="" set PORT=%HVAC_PORT%

echo  Allowing this PC on the shop network (Windows may ask once)...
netsh advfirewall firewall delete rule name="HVAC Allstars classroom" >nul 2>&1
netsh advfirewall firewall add rule name="HVAC Allstars classroom" dir=in action=allow protocol=TCP localport=%PORT% >nul 2>&1
netsh http add urlacl url=http://+:%PORT%/ user=%USERNAME% >nul 2>&1

echo  Leave this window OPEN. Close it to stop the classroom.
echo.

start "" "http://localhost:%PORT%/pc.html"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port=$env:PORT; if (-not $port) { $port=%PORT% };" ^
  "$root=(Get-Location).Path;" ^
  "$lan='127.0.0.1';" ^
  "try { $n=Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | Select-Object -First 1; if ($n) { $lan=$n.IPAddress } } catch {};" ^
  "$pc='http://localhost:'+$port+'/pc.html'; $join='http://'+$lan+':'+$port+'/';" ^
  "$info=@{ lan=$join; pc=$pc; share=$true } | ConvertTo-Json;" ^
  "Set-Content -Path (Join-Path $root 'classroom-net.json') -Value $info -Encoding UTF8;" ^
  "Write-Host ('This PC:     ' + $pc);" ^
  "Write-Host ('Student phones (same Wi-Fi):  ' + $join);" ^
  "Write-Host '';" ^
  "$l=New-Object System.Net.HttpListener;" ^
  "$l.Prefixes.Add('http://+:'+$port+'/');" ^
  "try { $l.Start() } catch { $l.Prefixes.Clear(); $l.Prefixes.Add('http://localhost:'+$port+'/'); $l.Start(); Write-Host 'Windows blocked shop Wi-Fi. Click Allow on the firewall, or run this .bat as Administrator once.' };" ^
  "while ($l.IsListening) {" ^
  "  $c=$l.GetContext(); $req=$c.Request; $res=$c.Response;" ^
  "  if ($req.HttpMethod -eq 'OPTIONS') { $res.StatusCode=204; $res.AddHeader('Access-Control-Allow-Origin','*'); $res.AddHeader('Access-Control-Allow-Methods','GET, OPTIONS'); $res.Close(); continue };" ^
  "  $path=$req.Url.LocalPath.TrimStart('/'); if ([string]::IsNullOrWhiteSpace($path)) { $path='pc.html' };" ^
  "  $full=Join-Path $root ($path -replace '/','\');" ^
  "  if (Test-Path $full -PathType Container) { $full=Join-Path $full 'index.html' };" ^
  "  $res.AddHeader('Access-Control-Allow-Origin','*');" ^
  "  $res.AddHeader('Cache-Control','no-cache');" ^
  "  if (Test-Path $full -PathType Leaf) {" ^
  "    $bytes=[IO.File]::ReadAllBytes($full);" ^
  "    $ext=[IO.Path]::GetExtension($full).ToLower();" ^
  "    $res.ContentType=switch ($ext) { '.html' {'text/html'} '.js' {'application/javascript'} '.css' {'text/css'} '.json' {'application/json'} '.png' {'image/png'} '.jpg' {'image/jpeg'} '.jpeg' {'image/jpeg'} '.webp' {'image/webp'} '.svg' {'image/svg+xml'} '.webmanifest' {'application/manifest+json'} '.mp4' {'video/mp4'} '.pdf' {'application/pdf'} '.zip' {'application/zip'} '.woff2' {'font/woff2'} default {'application/octet-stream'} };" ^
  "    $res.StatusCode=200; $res.ContentLength64=$bytes.Length; $res.OutputStream.Write($bytes,0,$bytes.Length)" ^
  "  } else { $res.StatusCode=404; $msg=[Text.Encoding]::UTF8.GetBytes('Not found'); $res.OutputStream.Write($msg,0,$msg.Length) };" ^
  "  $res.Close()" ^
  "}"

echo.
echo  Classroom stopped.
pause
