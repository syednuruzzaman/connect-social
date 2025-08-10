#!/bin/bash

# Vercel Deployment Script
# This script helps set up environment variables for Vercel deployment

echo "🚀 Setting up Vercel deployment for Connect Social"
echo ""

echo "📋 Copy these environment variables to your Vercel dashboard:"
echo "Go to: https://vercel.com/your-username/connect-social/settings/environment-variables"
echo ""

echo "Environment Variables:"
echo "======================"
echo ""

echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "Value: pk_test_YXJ0aXN0aWMtbXVsbGV0LTUuY2xlcmsuYWNjb3VudHMuZGV2JA"
echo ""

echo "CLERK_SECRET_KEY"
echo "Value: sk_test_SYIbgOFzOJRZoGgGJJ01WoO20PZ8tXiRzpbtlIVAXL"
echo ""

echo "NEXT_PUBLIC_CLERK_SIGN_IN_URL"
echo "Value: /sign-in"
echo ""

echo "NEXT_PUBLIC_CLERK_SIGN_UP_URL"
echo "Value: /sign-up"
echo ""

echo "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"
echo "Value: /"
echo ""

echo "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL"
echo "Value: /"
echo ""

echo "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
echo "Value: dts5to3kg"
echo ""

echo "NODE_ENV"
echo "Value: production"
echo ""

echo "PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK"
echo "Value: 1"
echo ""

echo "DATABASE_URL"
echo "Value: [YOUR NEON DATABASE CONNECTION STRING]"
echo "Format: postgresql://username:password@host.neon.tech/database?sslmode=require"
echo ""

echo "🔧 Next Steps:"
echo "1. Sign up at https://neon.tech"
echo "2. Create a new database"
echo "3. Copy the connection string"
echo "4. Add all variables above to Vercel"
echo "5. Redeploy your project"
echo ""
