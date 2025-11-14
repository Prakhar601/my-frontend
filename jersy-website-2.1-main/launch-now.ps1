# Jersey Website - Launch Script (PowerShell)
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Launching Frontend Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Add Node.js to PATH
$env:PATH += ";C:\Program Files\nodejs\;$env:APPDATA\npm"

# Change to frontend directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $scriptPath "frontend"
Set-Location $frontendPath

Write-Host "Checking Node.js installation..." -ForegroundColor Yellow

# Check if Node.js is available
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "After installation, restart this script." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev

