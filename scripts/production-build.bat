@echo off
REM Windows batch version of production build script

echo 🚀 Starting production build process...

REM Check if we're in production environment
if "%NODE_ENV%"=="production" goto production
if "%VERCEL%"=="1" goto production
goto development

:production
echo 📦 Production environment detected

REM Copy PostgreSQL schema for production
if exist "prisma\schema.postgresql.prisma" (
    echo 🔄 Switching to PostgreSQL schema for production...
    copy "prisma\schema.postgresql.prisma" "prisma\schema.prisma" >nul
)

:development
echo 🔧 Generating Prisma client...
call npx prisma generate

echo 🗄️ Pushing database schema...
call npx prisma db push

echo 🏗️ Building Next.js application...
call npx next build

echo ✅ Build completed successfully!
