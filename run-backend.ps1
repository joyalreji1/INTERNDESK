param(
    [ValidateSet("h2", "mysql")]
    [string]$Profile = "h2"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"
Set-Location $backendDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  INTERN DESK - BACKEND SPRING BOOT SERVER                " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Active Profile : $Profile" -ForegroundColor Green
Write-Host "Server Port    : 8080 (http://localhost:8080)" -ForegroundColor Green
Write-Host "Swagger Docs   : http://localhost:8080/swagger-ui/index.html" -ForegroundColor Green
if ($Profile -eq "h2") {
    Write-Host "H2 Console     : http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:intern_desk_db)" -ForegroundColor Yellow
}
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Starting Spring Boot application..." -ForegroundColor Gray

$cpPath = Join-Path $backendDir "classpath.txt"
if (-not (Test-Path $cpPath)) {
    Write-Host "Classpath file missing. Generating..." -ForegroundColor Yellow
    $exclude = @("slf4j-api-1.7.36.jar", "asm-9.4.jar", "commons-io-2.6.jar", "commons-io-2.11.0.jar", "commons-lang3-3.12.0.jar", "plexus-utils-3.5.0.jar")
    $jars = Get-ChildItem -Path "C:\Users\Lenovo\.m2\repository" -Recurse -Filter "*.jar" | Where-Object { $exclude -notcontains $_.Name } | Select-Object -ExpandProperty FullName
    $cp = ($jars + "$backendDir\target\classes") -join ";"
    $cp | Out-File -FilePath $cpPath -Encoding ascii
}

$cp = Get-Content $cpPath
java -cp $cp com.interndesk.InternDeskApplication --spring.profiles.active=$Profile

