@echo off
setlocal
cd /d "%~dp0"

set PROFILE=%1
if "%PROFILE%"=="" set PROFILE=h2

echo ==========================================================
echo   INTERN DESK - FULL SYSTEM LAUNCHER
echo ==========================================================
echo Profile: %PROFILE%
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0run-all.ps1" -Profile %PROFILE%

