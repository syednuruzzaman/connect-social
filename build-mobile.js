#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Connect Social Mobile App...\n');

// Step 1: Backup current config
console.log('📦 Step 1: Backing up configurations...');
if (fs.existsSync('next.config.mjs')) {
  fs.copyFileSync('next.config.mjs', 'next.config.web.backup');
}

// Step 2: Use mobile config
console.log('📱 Step 2: Switching to mobile configuration...');
fs.copyFileSync('next.mobile.config.js', 'next.config.mjs');

// Step 3: Create mobile-compatible actions
console.log('⚙️ Step 3: Creating mobile-compatible actions...');
const mobileActions = `
// Mobile-compatible actions for static export
export const switchFollow = async (userId) => {
  console.log('Follow action (mobile mode):', userId);
  return null;
};

export const switchBlock = async (userId) => {
  console.log('Block action (mobile mode):', userId);
  return null;
};

export const acceptFollowRequest = async (userId) => {
  console.log('Accept follow action (mobile mode):', userId);
  return null;
};

export const declineFollowRequest = async (userId) => {
  console.log('Decline follow action (mobile mode):', userId);
  return null;
};

export const updateProfile = async (prevState, payload) => {
  console.log('Update profile (mobile mode)');
  return { success: false, error: "Not available in mobile app" };
};

export const switchLike = async (postId) => {
  console.log('Like action (mobile mode):', postId);
  return null;
};

export const addComment = async (postId, desc) => {
  console.log('Add comment (mobile mode):', postId, desc);
  return null;
};

export const addPost = async (formData, img) => {
  console.log('Add post (mobile mode)');
  return null;
};

export const addStory = async (img) => {
  console.log('Add story (mobile mode)');
  return null;
};

export const deletePost = async (postId) => {
  console.log('Delete post (mobile mode):', postId);
  return null;
};

export const sendMessage = async (prevState, formData) => {
  console.log('Send message (mobile mode)');
  return { success: false, error: "Not available in mobile app" };
};

export const markMessagesAsRead = async (senderId) => {
  console.log('Mark messages as read (mobile mode):', senderId);
  return null;
};
`;

// Backup original actions
if (fs.existsSync('src/lib/actions.ts')) {
  fs.copyFileSync('src/lib/actions.ts', 'src/lib/actions.web.backup');
}
fs.writeFileSync('src/lib/actions.ts', mobileActions);

try {
  // Step 4: Build the app
  console.log('🔨 Step 4: Building Next.js app for mobile...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 5: Sync with Capacitor
  console.log('📲 Step 5: Syncing with Capacitor...');
  execSync('npx cap sync', { stdio: 'inherit' });

  console.log('\n✅ Mobile app build completed successfully!');
  console.log('📱 Your app is ready in the android/ folder');
  console.log('🎯 Next steps:');
  console.log('   1. Open Android Studio: npx cap open android');
  console.log('   2. Build APK: Build → Build Bundle(s) / APK(s) → Build APK(s)');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Restore original files on failure
  console.log('🔄 Restoring original files...');
  if (fs.existsSync('next.config.web.backup')) {
    fs.copyFileSync('next.config.web.backup', 'next.config.mjs');
    fs.unlinkSync('next.config.web.backup');
  }
  if (fs.existsSync('src/lib/actions.web.backup')) {
    fs.copyFileSync('src/lib/actions.web.backup', 'src/lib/actions.ts');
    fs.unlinkSync('src/lib/actions.web.backup');
  }
  
  process.exit(1);
}

// Step 6: Restore original files for web development
console.log('🔄 Step 6: Restoring web configurations...');
if (fs.existsSync('next.config.web.backup')) {
  fs.copyFileSync('next.config.web.backup', 'next.config.mjs');
  fs.unlinkSync('next.config.web.backup');
}
if (fs.existsSync('src/lib/actions.web.backup')) {
  fs.copyFileSync('src/lib/actions.web.backup', 'src/lib/actions.ts');
  fs.unlinkSync('src/lib/actions.web.backup');
}

console.log('\n🎉 Build process completed!');
console.log('💻 Your web app configuration has been restored');
console.log('📱 Your mobile app is ready for APK generation');
