# Connect Social APK Generation Script
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   Connect Social - APK Generation Helper" -ForegroundColor Cyan  
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check current status
Write-Host "📱 Checking APK status..." -ForegroundColor Yellow
$apkPath = "android\app\build\outputs\apk"
if (Test-Path $apkPath) {
    $apkFiles = Get-ChildItem -Path $apkPath -Filter "*.apk" -Recurse
    if ($apkFiles.Count -gt 0) {
        Write-Host "✅ Found existing APK files:" -ForegroundColor Green
        foreach ($apk in $apkFiles) {
            Write-Host "   📦 $($apk.FullName)" -ForegroundColor White
        }
        Write-Host ""
        $choice = Read-Host "Use existing APKs? (y/n)"
        if ($choice -eq "y" -or $choice -eq "Y") {
            exit 0
        }
    }
}

Write-Host ""
Write-Host "🔍 Detecting available APK build methods..." -ForegroundColor Yellow

# Method 1: Check if Android Studio/SDK is available
$androidHome = $env:ANDROID_HOME
$androidSdk = $env:ANDROID_SDK_ROOT
if ($androidHome -or $androidSdk) {
    Write-Host "✅ Android SDK detected" -ForegroundColor Green
    Write-Host "📱 Building APK with Gradle..." -ForegroundColor Yellow
    
    Set-Location android
    if (Test-Path "gradlew.bat") {
        .\gradlew.bat assembleDebug assembleRelease
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ APK build successful!" -ForegroundColor Green
            Write-Host "📱 APK files are available in:" -ForegroundColor Cyan
            Write-Host "   Debug: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
            Write-Host "   Release: android\app\build\outputs\apk\release\app-release-unsigned.apk" -ForegroundColor White
            Set-Location ..
            exit 0
        }
    }
    Set-Location ..
}

# Method 2: Check if Docker is available
Write-Host ""
Write-Host "🐳 Checking Docker availability..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "✅ Docker detected: $dockerVersion" -ForegroundColor Green
        Write-Host "📱 Would you like to build APK using Docker? (y/n): " -ForegroundColor Yellow -NoNewline
        $dockerChoice = Read-Host
        if ($dockerChoice -eq "y" -or $dockerChoice -eq "Y") {
            Write-Host "🐳 Building APK with Docker..." -ForegroundColor Yellow
            .\build-apk-docker.bat
            exit 0
        }
    }
} catch {
    Write-Host "⚠️  Docker not available" -ForegroundColor Yellow
}

# Method 3: Online build service suggestion
Write-Host ""
Write-Host "🌐 Alternative: Use GitHub Actions for APK build" -ForegroundColor Cyan
Write-Host "Steps:" -ForegroundColor White
Write-Host "1. Push your code to GitHub" -ForegroundColor White
Write-Host "2. GitHub Actions will automatically build APK" -ForegroundColor White
Write-Host "3. Download APK from Actions artifacts" -ForegroundColor White
Write-Host ""

# Method 4: Manual Android Studio setup
Write-Host "🛠️  Manual Setup: Install Android Studio" -ForegroundColor Cyan
Write-Host "1. Download Android Studio: https://developer.android.com/studio" -ForegroundColor White
Write-Host "2. Install and setup Android SDK" -ForegroundColor White
Write-Host "3. Run: npx cap open android" -ForegroundColor White
Write-Host "4. Build APK in Android Studio" -ForegroundColor White
Write-Host ""

# Method 5: Simple web version
Write-Host "📱 Quick Alternative: Web App" -ForegroundColor Cyan
Write-Host "Your mobile app is already available at: out/index.html" -ForegroundColor White
Write-Host "You can host this as a PWA (Progressive Web App)" -ForegroundColor White
Write-Host ""

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Choose your preferred method to get APK:" -ForegroundColor Yellow
Write-Host "1. Install Android Studio (recommended)" -ForegroundColor White
Write-Host "2. Use Docker (if available)" -ForegroundColor White  
Write-Host "3. Use GitHub Actions (upload to GitHub)" -ForegroundColor White
Write-Host "4. Deploy as PWA (no APK needed)" -ForegroundColor White
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to continue"
