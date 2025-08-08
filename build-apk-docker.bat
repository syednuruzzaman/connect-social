@echo off
echo.
echo ========================================
echo   Connect Social - Docker APK Builder
echo ========================================
echo.

echo This will build APK files using Docker...
echo Make sure Docker Desktop is installed and running.
echo.
pause

echo Building Docker image...
docker build -f Dockerfile.apk -t connect-social-apk .

if errorlevel 1 (
    echo ERROR: Docker build failed
    pause
    exit /b 1
)

echo.
echo Running APK build in container...
docker run --rm -v "%CD%\apk-output:/output" connect-social-apk

echo.
echo APK files should be available in: apk-output\
echo - app-debug.apk (for testing)
echo - app-release-unsigned.apk (for Play Store - needs signing)
echo.
pause
