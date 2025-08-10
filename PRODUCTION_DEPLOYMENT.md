# Production Deployment Guide

## Database Setup for Vercel

Your application is now configured to automatically switch between SQLite (development) and PostgreSQL (production).

### 1. Set up PostgreSQL Database

You have several options for PostgreSQL hosting:

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel Dashboard
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Follow the setup instructions
7. Copy the `DATABASE_URL` from the connection details

#### Option B: Supabase (Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

#### Option C: Railway (Free tier available)
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the connection URL

### 2. Configure Environment Variables in Vercel

Add these environment variables in your Vercel project settings:

```
DATABASE_URL=your_postgresql_connection_string_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YXJ0aXN0aWMtbXVsbGV0LTUuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_SYIbgOFzOJRZoGgGJJ01WoO20PZ8tXiRzpbtlIVAXL
WEBHOOK_SECRET=sk_test_SYIbgOFzOJRZoGgGJJ01WoO20PZ8tXiRzpbtlIVAXL
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dts5to3kg
CLOUDINARY_API_KEY=678886179136416
CLOUDINARY_API_SECRET=IdSwr-GeC3VhciwzbZhBcD-yU4Q
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=social
CLOUDINARY_URL=cloudinary://678886179136416:IdSwr-GeC3VhciwzbZhBcD-yU4Q@dts5to3kg
```

### 3. Deploy

Once you've set up the environment variables, simply push your code:

```bash
git add .
git commit -m "Fix database configuration for production deployment"
git push
```

Vercel will automatically:
1. Switch to PostgreSQL schema
2. Generate Prisma client
3. Push database schema to PostgreSQL
4. Build and deploy your application

### 4. Verify Deployment

After deployment:
1. Check the deployment logs in Vercel dashboard
2. Visit your deployed application
3. Test video upload functionality
4. Verify database operations are working

## Local Development

For local development, continue using SQLite:
- Your current setup with `DATABASE_URL="file:./dev.db"` will continue to work
- The SQLite database file is already configured
- No changes needed for local development

## Troubleshooting

### If deployment fails:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Ensure PostgreSQL database is accessible
4. Check that `DATABASE_URL` format is correct

### Common PostgreSQL URL formats:
```
postgresql://username:password@hostname:port/database
postgres://username:password@hostname:port/database
```

### If video uploads don't work in production:
1. Verify Cloudinary environment variables are set
2. Check that the 500MB file size limit is supported by your hosting
3. Monitor function execution timeouts in Vercel
