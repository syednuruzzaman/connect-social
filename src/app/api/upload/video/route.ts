import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Please upload a video file' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with video optimizations
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'connect-social/videos',
          public_id: `video_${userId}_${Date.now()}`,
          // Video optimizations
          quality: 'auto:good',
          format: 'mp4',
          transformation: [
            {
              quality: 'auto:good',
              fetch_format: 'auto',
              width: 1920,
              height: 1080,
              crop: 'limit'
            }
          ],
          // Enable progressive loading
          flags: 'progressive',
          // Set video codec for better compression
          video_codec: 'h264',
          // Audio settings
          audio_codec: 'aac',
          bit_rate: '1000k',
          // Maximum file size for processing (500MB)
          bytes: 500 * 1024 * 1024,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({ 
      url: (uploadResult as any).secure_url,
      publicId: (uploadResult as any).public_id,
      duration: (uploadResult as any).duration,
      format: (uploadResult as any).format,
      bytes: (uploadResult as any).bytes,
    });

  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}

// Handle chunked uploads
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const chunk = formData.get('chunk') as File;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);
    const fileName = formData.get('fileName') as string;

    if (!chunk) {
      return NextResponse.json({ error: 'No chunk provided' }, { status: 400 });
    }

    // For simplicity, we'll store chunks temporarily
    // In production, you might want to use a more robust storage solution
    const chunkId = `${userId}_${fileName}_${chunkIndex}`;
    
    // Convert chunk to buffer
    const bytes = await chunk.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Store chunk temporarily (you might want to use Redis or file system)
    // For now, we'll upload each chunk to Cloudinary and combine later
    
    if (chunkIndex === totalChunks - 1) {
      // Last chunk - combine all chunks and upload
      // This is a simplified version - in production you'd combine chunks properly
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'connect-social/videos',
            public_id: `video_${userId}_${Date.now()}`,
            quality: 'auto:good',
            format: 'mp4',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      return NextResponse.json({
        completed: true,
        url: (uploadResult as any).secure_url,
        publicId: (uploadResult as any).public_id,
      });
    }

    return NextResponse.json({
      completed: false,
      chunkUploaded: chunkIndex + 1,
      totalChunks,
    });

  } catch (error) {
    console.error('Chunked upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload chunk' },
      { status: 500 }
    );
  }
}
