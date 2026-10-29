$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Configuring Git remote..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin https://github.com/joyalreji1/INTERN-DESK.git

Write-Host "Creating initial commit..." -ForegroundColor Cyan
git add .
git commit -m "Initial commit: INTERN DESK full-stack internship management platform" 2>$null

Write-Host "Pushing to GitHub (main branch)..." -ForegroundColor Cyan
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Standard push failed (remote may have existing commits). Retrying with --force..." -ForegroundColor Yellow
    git push -u origin main --force
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully pushed project to https://github.com/joyalreji1/INTERN-DESK.git!" -ForegroundColor Green
} else {
    Write-Host "Push failed with exit code $LASTEXITCODE." -ForegroundColor Red
}
