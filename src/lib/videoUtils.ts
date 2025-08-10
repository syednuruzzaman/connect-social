// Video upload utilities for handling large files

export interface VideoUploadOptions {
  maxSize?: number; // in MB
  quality?: 'auto' | 'low' | 'medium' | 'high';
  format?: 'auto' | 'mp4' | 'webm';
  compression?: boolean;
}

export const DEFAULT_VIDEO_OPTIONS: VideoUploadOptions = {
  maxSize: 500, // 500MB max
  quality: 'auto',
  format: 'auto',
  compression: true,
};

// Convert bytes to MB
export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

// Convert MB to bytes
export const mbToBytes = (mb: number): number => {
  return mb * 1024 * 1024;
};

// Validate video file
export const validateVideoFile = (file: File, options: VideoUploadOptions = DEFAULT_VIDEO_OPTIONS): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('video/')) {
    return { valid: false, error: 'Please select a video file' };
  }

  // Check file size
  const fileSizeMB = bytesToMB(file.size);
  if (options.maxSize && fileSizeMB > options.maxSize) {
    return { 
      valid: false, 
      error: `File size (${fileSizeMB.toFixed(1)} MB) exceeds maximum allowed (${options.maxSize} MB)` 
    };
  }

  // Check supported formats
  const supportedFormats = ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi', 'video/mov'];
  if (!supportedFormats.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Unsupported video format. Please use MP4, WebM, MOV, or AVI' 
    };
  }

  return { valid: true };
};

// Compress video using canvas (basic compression)
export const compressVideo = async (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      // Set canvas dimensions (reduce for compression)
      const scale = quality;
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;

      video.currentTime = 0;
    };

    video.onloadeddata = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'video/mp4',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Compression failed'));
          }
        }, 'video/mp4', quality);
      }
    };

    video.onerror = () => reject(new Error('Video loading failed'));
    video.src = URL.createObjectURL(file);
  });
};

// Chunked upload function
export const uploadVideoInChunks = async (
  file: File,
  uploadUrl: string,
  chunkSize: number = 5 * 1024 * 1024, // 5MB chunks
  onProgress?: (progress: number) => void
): Promise<string> => {
  const totalChunks = Math.ceil(file.size / chunkSize);
  let uploadedChunks = 0;

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', i.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('fileName', file.name);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Chunk ${i} upload failed`);
      }

      uploadedChunks++;
      if (onProgress) {
        onProgress((uploadedChunks / totalChunks) * 100);
      }
    } catch (error) {
      throw new Error(`Failed to upload chunk ${i}: ${error}`);
    }
  }

  return 'Upload completed successfully';
};

// Get video duration
export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
};

// Generate video thumbnail
export const generateVideoThumbnail = (file: File, seekTo: number = 1): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      video.currentTime = seekTo;
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
      } else {
        reject(new Error('Canvas context not available'));
      }
    };

    video.onerror = () => reject(new Error('Video loading failed'));
    video.src = URL.createObjectURL(file);
  });
};

// Cloudinary video transformation options
export const getCloudinaryVideoTransform = (options: VideoUploadOptions) => {
  const transforms = [];

  // Quality optimization
  if (options.quality === 'low') {
    transforms.push('q_auto:low');
  } else if (options.quality === 'medium') {
    transforms.push('q_auto:good');
  } else {
    transforms.push('q_auto:best');
  }

  // Format optimization
  transforms.push('f_auto');

  // Compression
  if (options.compression) {
    transforms.push('c_limit,w_1920,h_1080'); // Limit to 1080p
  }

  return transforms.join(',');
};
