@echo off
setlocal
cd /d "%~dp0"

set PROFILE=%1
if "%PROFILE%"=="" set PROFILE=h2

echo ==========================================================
echo   INTERN DESK - BACKEND SPRING BOOT SERVER
echo ==========================================================
echo Active Profile : %PROFILE%
echo Server Port    : 8080 (http://localhost:8080)
echo.
echo Tip: To run with MySQL, execute: run-backend.bat mysql
echo ==========================================================

powershell -ExecutionPolicy Bypass -File "%~dp0run-backend.ps1" -Profile %PROFILE%
pause

