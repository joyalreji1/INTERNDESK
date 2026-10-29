param()

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"
Set-Location $backendDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  INTERN DESK - RUNNING AUTOMATED TEST SUITE              " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$cp = Get-Content (Join-Path $backendDir "classpath.txt")
$cp = "$cp;$backendDir\target\test-classes"
$agentJar = "C:\Users\Lenovo\.m2\repository\net\bytebuddy\byte-buddy-agent\1.14.13\byte-buddy-agent-1.14.13.jar"

java -javaagent:"$agentJar" -XX:+EnableDynamicAgentLoading -cp $cp com.interndesk.TestRunner

