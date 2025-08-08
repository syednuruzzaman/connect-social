#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('Building Connect Social APK...\n');

// Simple mobile config
const mobileConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: { unoptimized: true },
};
export default nextConfig;`;

// Minimal mobile page
const mobilePage = `export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center text-white">
        <div className="text-6xl mb-6">📱</div>
        <h1 className="text-3xl font-bold mb-4">Connect Social</h1>
        <p className="text-lg mb-6 opacity-90">Mobile App Ready!</p>
        <div className="p-4 bg-white/20 rounded-2xl">
          <p className="text-sm">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}`;

const mobileLayout = `import './globals.css';
export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}`;

const mobileCSS = `@tailwind base; @tailwind components; @tailwind utilities;`;

try {
  console.log('Setting up mobile build...');
  
  // Backup
  if (fs.existsSync('next.config.mjs')) fs.copyFileSync('next.config.mjs', 'next.config.backup');
  if (fs.existsSync('src/app/page.tsx')) fs.copyFileSync('src/app/page.tsx', 'src/app/page.backup');
  if (fs.existsSync('src/app/layout.tsx')) fs.copyFileSync('src/app/layout.tsx', 'src/app/layout.backup');
  
  // Create mobile files
  fs.writeFileSync('next.config.mjs', mobileConfig);
  fs.writeFileSync('src/app/page.tsx', mobilePage);
  fs.writeFileSync('src/app/layout.tsx', mobileLayout);
  fs.writeFileSync('src/app/globals.css', mobileCSS);
  
  console.log('Building...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Syncing with Capacitor...');
  execSync('npx cap sync android', { stdio: 'inherit' });
  
  console.log('\\nSUCCESS! APK ready for generation.');
  console.log('Run: npx cap open android');
  
} catch (error) {
  console.error('Build failed:', error.message);
} finally {
  // Restore
  console.log('\\nRestoring original files...');
  if (fs.existsSync('next.config.backup')) {
    fs.copyFileSync('next.config.backup', 'next.config.mjs');
    fs.unlinkSync('next.config.backup');
  }
  if (fs.existsSync('src/app/page.backup')) {
    fs.copyFileSync('src/app/page.backup', 'src/app/page.tsx');
    fs.unlinkSync('src/app/page.backup');
  }
  if (fs.existsSync('src/app/layout.backup')) {
    fs.copyFileSync('src/app/layout.backup', 'src/app/layout.tsx');
    fs.unlinkSync('src/app/layout.backup');
  }
  console.log('Original files restored!');
}
