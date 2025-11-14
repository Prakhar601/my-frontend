
@echo off
title Jersey Website - Launch Now
color 0A
cls
echo.
echo ========================================
echo   Launching Frontend Server
echo ========================================
echo.

:: Add Node.js to PATH
set "PATH=%PATH%;C:\Program Files\nodejs\;%APPDATA%\npm"

:: Change to frontend directory
cd /d "%~dp0frontend"

echo Checking setup...

:: Clean install if needed
if exist "node_modules" (
    echo Removing old node_modules...
    rmdir /s /q "node_modules"
)
if exist "package-lock.json" (
    del /f "package-lock.json"
)

:: Install dependencies
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo Failed to install dependencies!
    pause
    exit /b 1
)

:: Install Vite globally if needed
call npm install -g vite
if errorlevel 1 (
    echo Failed to install Vite globally!
    pause
    exit /b 1
)

echo.
echo Starting server on http://localhost:5173
echo The browser will open automatically when ready.
echo.
echo ========================================
echo.

:: Start the development server
call npx vite --host --open

pause


