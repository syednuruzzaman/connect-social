#!/usr/bin/env pwsh

# Connect Social - Local APK Builder
# This script builds the APK locally on your Windows machine

Write-Host "🚀 Connect Social - Local APK Builder" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check if we're in the correct directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

$missingTools = @()

if (!(Test-Command "java")) {
    $missingTools += "Java (11 or higher)"
} else {
    $javaVersion = java -version 2>&1 | Select-String "version" | ForEach-Object { $_.ToString() }
    Write-Host "✅ Java found: $javaVersion" -ForegroundColor Green
}

if (!(Test-Command "node")) {
    $missingTools += "Node.js"
} else {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
}

if (!(Test-Command "npm")) {
    $missingTools += "npm"
} else {
    $npmVersion = npm --version
    Write-Host "✅ npm found: v$npmVersion" -ForegroundColor Green
}

if ($missingTools.Count -gt 0) {
    Write-Host "❌ Missing required tools:" -ForegroundColor Red
    $missingTools | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Please install the missing tools and try again." -ForegroundColor Yellow
    Write-Host "Download links:" -ForegroundColor Yellow
    Write-Host "   - Java: https://adoptium.net/" -ForegroundColor Cyan
    Write-Host "   - Node.js: https://nodejs.org/" -ForegroundColor Cyan
    exit 1
}

# Step 1: Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 2: Build the Next.js app
Write-Host ""
Write-Host "🏗️  Building Next.js application..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Next.js build completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Next.js build failed" -ForegroundColor Red
    exit 1
}

# Step 3: Check if Capacitor is installed
Write-Host ""
Write-Host "⚡ Checking Capacitor installation..." -ForegroundColor Yellow

if (!(Test-Path "capacitor.config.ts") -and !(Test-Path "capacitor.config.js")) {
    Write-Host "📱 Setting up Capacitor..." -ForegroundColor Yellow
    
    try {
        # Install Capacitor
        npm install @capacitor/core @capacitor/cli @capacitor/android
        
        # Initialize Capacitor
        npx cap init "Connect Social" "com.connectsocial.app" --web-dir="out"
        
        Write-Host "✅ Capacitor initialized" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to setup Capacitor" -ForegroundColor Red
        exit 1
    }
}

# Step 4: Add Android platform
Write-Host ""
Write-Host "🤖 Setting up Android platform..." -ForegroundColor Yellow

try {
    if (!(Test-Path "android")) {
        npx cap add android
        Write-Host "✅ Android platform added" -ForegroundColor Green
    } else {
        Write-Host "✅ Android platform already exists" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Failed to add Android platform" -ForegroundColor Red
    exit 1
}

# Step 5: Sync the project
Write-Host ""
Write-Host "🔄 Syncing project with Capacitor..." -ForegroundColor Yellow

try {
    npx cap sync android
    Write-Host "✅ Project synced successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to sync project" -ForegroundColor Red
    exit 1
}

# Step 6: Build APK
Write-Host ""
Write-Host "📱 Building APK..." -ForegroundColor Yellow

try {
    Set-Location "android"
    
    # Check if gradlew exists
    if (Test-Path "gradlew.bat") {
        .\gradlew.bat assembleDebug
    } elseif (Test-Path "gradlew") {
        # For WSL or Git Bash users
        bash ./gradlew assembleDebug
    } else {
        Write-Host "❌ Gradle wrapper not found" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ".."
    
    # Check if APK was created
    $apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
    if (Test-Path $apkPath) {
        $apkSize = (Get-Item $apkPath).Length / 1MB
        Write-Host "✅ APK built successfully!" -ForegroundColor Green
        Write-Host "📱 APK Location: $apkPath" -ForegroundColor Cyan
        Write-Host "📊 APK Size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
        
        # Copy APK to project root for easy access
        Copy-Item $apkPath "connect-social.apk" -Force
        Write-Host "📋 APK copied to: connect-social.apk" -ForegroundColor Cyan
        
        Write-Host ""
        Write-Host "🎉 SUCCESS! Your APK is ready!" -ForegroundColor Green
        Write-Host "📱 You can now install 'connect-social.apk' on your Android device" -ForegroundColor Yellow
        Write-Host "🚀 Or upload it to Google Play Console for distribution" -ForegroundColor Yellow
    } else {
        Write-Host "❌ APK not found after build" -ForegroundColor Red
        Write-Host "🔍 Searching for APK files..." -ForegroundColor Yellow
        Get-ChildItem -Path "android" -Filter "*.apk" -Recurse | ForEach-Object {
            Write-Host "   Found: $($_.FullName)" -ForegroundColor Cyan
        }
        exit 1
    }
    
} catch {
    Write-Host "❌ Failed to build APK: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Build Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
Write-Host "   ✅ Next.js app built" -ForegroundColor Green
Write-Host "   ✅ Capacitor configured" -ForegroundColor Green
Write-Host "   ✅ Android platform ready" -ForegroundColor Green
Write-Host "   ✅ APK file created" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Your Connect Social APK is ready for deployment!" -ForegroundColor Cyan
