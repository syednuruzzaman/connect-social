# 🚀 Vercel Deployment Guide for Connect Social

## Prerequisites
- [x] Vercel account
- [x] GitHub repository connected to Vercel
- [ ] Neon database account
- [ ] Environment variables configured

## Step-by-Step Deployment

### 1. Set Up Database (Neon - Free PostgreSQL)

1. **Go to Neon.tech**
   - Visit: https://neon.tech
   - Sign up with GitHub or email

2. **Create Database**
   - Click "Create Project"
   - Choose a name: `connect-social-db`
   - Select region closest to your users
   - Click "Create Project"

3. **Get Connection String**
   - After creation, you'll see a connection string like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   - Copy this entire string

### 2. Configure Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your `connect-social` project
   - Click "Settings" → "Environment Variables"

2. **Add These Variables:**

| Name | Value | Environment |
|------|--------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_YXJ0aXN0aWMtbXVsbGV0LTUuY2xlcmsuYWNjb3VudHMuZGV2JA` | Production, Preview, Development |
| `CLERK_SECRET_KEY` | `sk_test_SYIbgOFzOJRZoGgGJJ01WoO20PZ8tXiRzpbtlIVAXL` | Production, Preview, Development |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | Production, Preview, Development |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | Production, Preview, Development |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/` | Production, Preview, Development |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/` | Production, Preview, Development |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dts5to3kg` | Production, Preview, Development |
| `DATABASE_URL` | `[YOUR NEON CONNECTION STRING]` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK` | `1` | Production, Preview, Development |

### 3. Redeploy

1. **Trigger Redeploy**
   - Go to Vercel dashboard
   - Click "Deployments"
   - Click "Redeploy" on the latest deployment

   OR

   - Push any change to your GitHub repo
   - Vercel will automatically deploy

### 4. Test Your Deployment

1. **Check Deployment Status**
   - Wait for deployment to complete
   - Check for any build errors in Vercel logs

2. **Test Your App**
   - Visit your Vercel URL
   - Try signing up/in
   - Create a post
   - Test comments and likes

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Ensure Neon database is active
   - Check Prisma schema is using PostgreSQL

2. **Clerk Authentication Error**
   - Verify all Clerk environment variables
   - Check Clerk dashboard for domain settings

3. **Build Errors**
   - Check Vercel function logs
   - Verify all dependencies are installed
   - Check TypeScript compilation

### Useful Commands

```bash
# Test build locally
npm run build

# Generate Prisma client
npx prisma generate

# Push database schema (for development)
npx prisma db push

# View database in browser
npx prisma studio
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Test locally first with `npm run build`
4. Check Neon database connection

---

✅ **Success Checklist:**
- [ ] Neon database created
- [ ] All environment variables added to Vercel
- [ ] Deployment completed without errors
- [ ] App loads and authentication works
- [ ] Database operations work (posts, comments, etc.)
