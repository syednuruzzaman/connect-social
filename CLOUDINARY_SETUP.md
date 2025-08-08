# Cloudinary Upload Preset Setup

## ⚠️ URGENT: Fix "Upload preset not found" Error

You're getting this error because the "social" upload preset doesn't exist in your Cloudinary account yet.

## Quick Fix Steps:

### 1. **Log into Cloudinary Dashboard**
   - Go to: https://cloudinary.com/console
   - Use your account credentials

### 2. **Navigate to Upload Settings**
   - Click the "Settings" (⚙️) icon in the top-right corner
   - Select "Upload" from the left sidebar menu

### 3. **Create the Upload Preset**
   - Scroll down to find "Upload presets" section
   - Click "Add upload preset" button
   - **Preset name**: `social` (exactly this name)
   - **Signing mode**: Select "Unsigned" (important!)

### 4. **Configure Upload Settings**
   ```
   Basic Settings:
   - Folder: social_uploads (or leave blank)
   - Resource type: Image
   - Access mode: Public
   
   File Restrictions:
   - Allowed formats: jpg,jpeg,png,gif,webp
   - Max file size: 10000000 (10MB)
   - Max image width: 2000
   - Max image height: 2000
   ```

### 5. **Enable Mobile Features** (Optional but recommended)
   ```
   Media Analysis & AI:
   ✅ Auto quality
   ✅ Auto format
   
   Transformations:
   ✅ Quality: auto
   ✅ Format: auto
   ```

### 6. **Save the Preset**
   - Click "Save" at the bottom
   - The preset "social" should now appear in your list

## Test the Fix:
1. After creating the preset, wait 1-2 minutes for it to propagate
2. Try uploading a profile picture or cover photo again
3. You should now be able to upload successfully

## Environment Variables Check:
Your `.env.local` should have:
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dts5to3kg
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=social
```

## Expected Upload Options:
- ✅ From file (browse device storage)
- ✅ Camera (take photo directly)

These are the correct mobile-optimized options.

## Still Having Issues?

### Alternative Upload Preset Names to Try:
If "social" doesn't work, try creating presets with these names:
- `ml_default` (often exists by default)
- `upload_preset`
- `social_media`

Then update your `.env.local` file:
```bash
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default
```

### Verify Your Account:
1. Check that your cloud name is correct: `dts5to3kg`
2. Ensure your account is active and not suspended
3. Try creating a simple test upload in the Cloudinary console

## Contact Support:
If you continue having issues, the problem might be:
1. Account permissions
2. Cloud name mismatch
3. Billing/quota issues

Check your Cloudinary dashboard for any warnings or notifications.
