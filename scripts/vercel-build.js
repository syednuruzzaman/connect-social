const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production build process...');

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

if (isProduction) {
    console.log('📦 Production environment detected');
    
    // Copy PostgreSQL schema for production
    const postgresSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.postgresql.prisma');
    const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
    
    if (fs.existsSync(postgresSchemaPath)) {
        console.log('🔄 Switching to PostgreSQL schema for production...');
        fs.copyFileSync(postgresSchemaPath, schemaPath);
    }
} else {
    console.log('🔧 Development environment - using SQLite schema');
}

try {
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('🗄️ Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('🏗️ Building Next.js application...');
    execSync('npx next build', { stdio: 'inherit' });
    
    console.log('✅ Build completed successfully!');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
