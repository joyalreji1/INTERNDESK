param(
    [ValidateSet("h2", "mysql")]
    [string]$Profile = "h2"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  INTERN DESK - FULL SYSTEM LAUNCHER                      " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Launching Spring Boot Backend (Port 8080, Profile: $Profile)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -NoExit -File `"$scriptDir\run-backend.ps1`" -Profile $Profile"

Start-Sleep -Seconds 2

Write-Host "Launching Vite Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -NoExit -File `"$scriptDir\run-frontend.ps1`""

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Both services are launching in separate windows." -ForegroundColor Cyan
Write-Host "Frontend  : http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend   : http://localhost:8080" -ForegroundColor Yellow
Write-Host "Swagger   : http://localhost:8080/swagger-ui/index.html" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

