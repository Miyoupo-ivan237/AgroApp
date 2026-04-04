# AgroConnect Run Script (Unified)
# This will launch both the PHP backend and the Vite frontend in separate window processes.

Write-Host "--- AgroConnect Unified Launcher ---" -ForegroundColor Green

# Function to find PHP executable
function Get-PhpPath {
    if (Get-Command "php" -ErrorAction SilentlyContinue) { return "php" }
    $commonPaths = @(
        "C:\xampp\php\php.exe",
        "C:\laragon\bin\php\php-8.1.10-Win32-vs16-x64\php.exe",
        "C:\laragon\bin\php\*\php.exe",
        "C:\php\php.exe"
    )
    foreach ($p in $commonPaths) {
        $found = Get-Item $p -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) { return "`"$($found.FullName)`"" }
    }
    return $null
}

$phpPath = Get-PhpPath
if (-not $phpPath) {
    Write-Host "ERROR: PHP not found in PATH or common XAMPP/Laragon folders." -ForegroundColor Red
    Write-Host "Please install PHP or add it to your System PATH."
    pause
    exit
}

# 1. Start PHP Backend (Port 5000)
Write-Host "Using PHP at: $phpPath" -ForegroundColor Gray
Write-Host "Starting PHP Server on 127.0.0.1:5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'php-server'; & $phpPath -S 127.0.0.1:5000 index.php"

# 2. Start Vite Frontend
Write-Host "Starting Vite Frontend..." -ForegroundColor Yellow
if (Get-Command "npm" -ErrorAction SilentlyContinue) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'client'; npm run dev"
} else {
    Write-Host "WARNING: npm (Node.js) not found. Cannot start frontend automatically." -ForegroundColor Red
}

Write-Host "`nAll servers are launching! Keep the new terminal windows open while working." -ForegroundColor Green
Write-Host "Note: If registration still fails, ensure your XAMPP/Laragon MySQL is RUNNING."
