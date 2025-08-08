@echo off
echo.
echo ==============================================
echo   Connect Social - APK Build Script
echo ==============================================
echo.

echo [1/3] Syncing mobile app with Android...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Failed to sync with Android platform
    pause
    exit /b 1
)

echo.
echo [2/3] Opening Android Studio...
start /min cmd /c "npx cap open android"

echo.
echo [3/3] APK Build Instructions:
echo.
echo In Android Studio (when it opens):
echo 1. Wait for Gradle sync to complete
echo 2. Go to: Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo 3. Wait for build to complete
echo 4. APK will be available at:
echo    android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo For Google Play Store (Production APK):
echo 1. Go to: Build ^> Generate Signed Bundle / APK
echo 2. Choose APK
echo 3. Create or select keystore
echo 4. Build release APK
echo.
echo ==============================================
echo   APK Generation Process Started!
echo ==============================================
echo.
pause
