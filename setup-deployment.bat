@echo off
echo 🚀 Connect Social - Vercel Deployment Setup
echo ==========================================
echo.

echo 📋 Environment Variables for Vercel:
echo.
echo NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_YXJ0aXN0aWMtbXVsbGV0LTUuY2xlcmsuYWNjb3VudHMuZGV2JA
echo CLERK_SECRET_KEY = sk_test_SYIbgOFzOJRZoGgGJJ01WoO20PZ8tXiRzpbtlIVAXL
echo NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
echo NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
echo NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /
echo NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /
echo NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = dts5to3kg
echo NODE_ENV = production
echo PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK = 1
echo DATABASE_URL = [YOUR NEON CONNECTION STRING]
echo.

echo 📝 Next Steps:
echo 1. Create Neon database at https://neon.tech
echo 2. Copy connection string
echo 3. Add all variables to Vercel at:
echo    https://vercel.com/your-username/connect-social/settings/environment-variables
echo 4. Redeploy your project
echo.

echo 🔧 Quick Links:
echo - Neon: https://neon.tech
echo - Vercel Dashboard: https://vercel.com/dashboard
echo - Deployment Guide: See DEPLOYMENT_GUIDE.md
echo.

pause
