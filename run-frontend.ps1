param(
    [switch]$Preview
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $scriptDir "frontend"
Set-Location $frontendDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  INTERN DESK - FRONTEND REACT APPLICATION               " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor Green
Write-Host "Connecting to Backend at: http://localhost:8080/api" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

if ($Preview) {
    Write-Host "Serving production build via Vite preview..." -ForegroundColor Gray
    npm run preview -- --port 5173 --host
} else {
    Write-Host "Starting Vite development server..." -ForegroundColor Gray
    npm run dev -- --port 5173 --host
}

