$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"
$targetClasses = Join-Path $backendDir "target\classes"
$targetTestClasses = Join-Path $backendDir "target\test-classes"

if (-not (Test-Path $targetClasses)) { New-Item -ItemType Directory -Path $targetClasses -Force }
if (-not (Test-Path $targetTestClasses)) { New-Item -ItemType Directory -Path $targetTestClasses -Force }

$cpPath = Join-Path $backendDir "classpath.txt"
$cp = Get-Content $cpPath

Write-Host "Compiling src/main/java..." -ForegroundColor Cyan
$mainSources = Get-ChildItem -Path (Join-Path $backendDir "src\main\java") -Recurse -Filter "*.java" | Select-Object -ExpandProperty FullName
$sourceFile = Join-Path $backendDir "sources.txt"
$mainSources | Out-File -FilePath $sourceFile -Encoding ascii

& javac -parameters -cp "$cp" -d "$targetClasses" "@$sourceFile"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Main compilation failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "Main compilation successful!" -ForegroundColor Green

Write-Host "Compiling src/test/java..." -ForegroundColor Cyan
$testSources = Get-ChildItem -Path (Join-Path $backendDir "src\test\java") -Recurse -Filter "*.java" | Select-Object -ExpandProperty FullName
$testSourceFile = Join-Path $backendDir "test-sources.txt"
$testSources | Out-File -FilePath $testSourceFile -Encoding ascii

$testCp = "$cp;$targetClasses;$targetTestClasses"
& javac -parameters -cp "$testCp" -d "$targetTestClasses" "@$testSourceFile"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Test compilation failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "All compilation successful!" -ForegroundColor Green
Remove-Item $sourceFile, $testSourceFile -ErrorAction SilentlyContinue

