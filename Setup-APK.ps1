#!/usr/bin/env pwsh

# Connect Social APK Setup Script
# Helps you choose and execute the best APK generation method

Write-Host "🚀 Connect Social APK Generation Setup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

Write-Host "`n📱 Your app is ready! Choose your preferred method:" -ForegroundColor Green

Write-Host "`n1. 🌐 GitHub Actions (Recommended - Cloud Build)" -ForegroundColor Yellow
Write-Host "   ✅ No local Android SDK required"
Write-Host "   ✅ Automatic builds on code changes"
Write-Host "   ✅ Download APK from GitHub"

Write-Host "`n2. 🏗️ Android Studio (Local Build)" -ForegroundColor Yellow
Write-Host "   ⚠️ Requires Android Studio installation"
Write-Host "   ✅ Full control over build process"

Write-Host "`n3. 🐳 Docker Build" -ForegroundColor Yellow
Write-Host "   ⚠️ Requires Docker Desktop"
Write-Host "   ✅ Isolated build environment"

Write-Host "`n4. 📱 PWA Deployment (Instant)" -ForegroundColor Yellow
Write-Host "   ✅ No APK needed"
Write-Host "   ✅ Works on all devices"

$choice = Read-Host "`nEnter your choice (1-4)"

switch ($choice) {
    1 {
        Write-Host "`n🌐 Setting up GitHub Actions..." -ForegroundColor Green
        Write-Host "1. Go to github.com and create a new repository 'connect-social'"
        Write-Host "2. Copy this command and run it:"
        Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/connect-social.git" -ForegroundColor Cyan
        Write-Host "3. Push your code:"
        Write-Host "   git push -u origin main" -ForegroundColor Cyan
        Write-Host "4. APK will be built automatically!"
        Write-Host "5. Download from GitHub Actions > Artifacts"
    }
    
    2 {
        Write-Host "`n🏗️ Setting up Android Studio build..." -ForegroundColor Green
        if (Test-Path ".\android\gradlew.bat") {
            Write-Host "Android project found! Building APK..." -ForegroundColor Green
            cd android
            .\gradlew.bat assembleDebug
            Write-Host "✅ APK built! Check: android\app\build\outputs\apk\debug\" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Please install Android Studio first:" -ForegroundColor Yellow
            Write-Host "https://developer.android.com/studio"
        }
    }
    
    3 {
        Write-Host "`n🐳 Setting up Docker build..." -ForegroundColor Green
        if (Get-Command docker -ErrorAction SilentlyContinue) {
            docker build -f Dockerfile.apk -t connect-social-apk .
            docker run --rm -v ${PWD}/output:/output connect-social-apk
            Write-Host "✅ APK built! Check: output/ directory" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Please install Docker Desktop first:" -ForegroundColor Yellow
            Write-Host "https://www.docker.com/products/docker-desktop"
        }
    }
    
    4 {
        Write-Host "`n📱 Deploying as PWA..." -ForegroundColor Green
        npm run build
        Write-Host "✅ PWA ready! Deploy the 'out' folder to any hosting service" -ForegroundColor Green
        Write-Host "Recommended: Vercel, Netlify, or Firebase Hosting"
    }
    
    default {
        Write-Host "`n❌ Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host "`n📖 For detailed instructions, see: SETUP_APK_GUIDE.md" -ForegroundColor Cyan
Write-Host "🎉 Your Connect Social app is ready for deployment!" -ForegroundColor Green
