#!/bin/bash

# Production deployment script for Vercel
# This script switches to PostgreSQL schema for production builds

echo "🚀 Starting production build process..."

# Check if we're in production environment
if [ "$NODE_ENV" = "production" ] || [ "$VERCEL" = "1" ]; then
    echo "📦 Production environment detected"
    
    # Copy PostgreSQL schema for production
    if [ -f "prisma/schema.postgresql.prisma" ]; then
        echo "🔄 Switching to PostgreSQL schema for production..."
        cp prisma/schema.postgresql.prisma prisma/schema.prisma
    fi
fi

echo "🔧 Generating Prisma client..."
prisma generate

echo "🗄️ Pushing database schema..."
prisma db push

echo "🏗️ Building Next.js application..."
next build

echo "✅ Build completed successfully!"
