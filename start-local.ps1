# Avvia tutto MAÎTRES in locale
Write-Host "MAÎTRES — avvio servizi locali" -ForegroundColor Magenta

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Chiudi eventuale API già in ascolto sulla 8787
$old = Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($old) {
  Stop-Process -Id $old.OwningProcess -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 1
}

# API
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\maitres-api'; npm start"
Start-Sleep -Seconds 2

# Sito pubblico
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; python -m http.server 8765"

# Admin
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\maitres-admin'; python -m http.server 8788"

Start-Sleep -Seconds 2
Start-Process "http://localhost:8788/login.html"
Start-Process "http://localhost:8765/prenota.html"

Write-Host ""
Write-Host "Sito:  http://localhost:8765" -ForegroundColor Green
Write-Host "Admin: http://localhost:8788/login.html  (demo: qualsiasi codice)" -ForegroundColor Green
Write-Host "API:   http://localhost:8787" -ForegroundColor Green
