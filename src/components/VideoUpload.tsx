"use client";

import { useState, useRef, useCallback } from 'react';
import { validateVideoFile, bytesToMB, uploadVideoInChunks, generateVideoThumbnail } from '@/lib/videoUtils';
import Image from 'next/image';

interface VideoUploadProps {
  onVideoUploaded: (videoUrl: string, thumbnail?: string) => void;
  maxSizeMB?: number;
  className?: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ 
  onVideoUploaded, 
  maxSizeMB = 500, // 500MB default
  className = '' 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    
    // Validate file
    const validation = validateVideoFile(file, { maxSize: maxSizeMB });
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    
    try {
      // Generate thumbnail
      const thumbnailUrl = await generateVideoThumbnail(file);
      setThumbnail(thumbnailUrl);
    } catch (err) {
      console.warn('Failed to generate thumbnail:', err);
    }
  }, [maxSizeMB]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Check if file is large - use chunked upload for files > 100MB
      if (bytesToMB(selectedFile.size) > 100) {
        // Use chunked upload
        await uploadVideoInChunks(
          selectedFile,
          '/api/upload/video',
          5 * 1024 * 1024, // 5MB chunks
          setUploadProgress
        );
      } else {
        // Regular upload
        const response = await fetch('/api/upload/video', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        onVideoUploaded(result.url, thumbnail || undefined);
      }

      // Reset state
      setSelectedFile(null);
      setThumbnail(null);
      setUploadProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`video-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM5 8a1 1 0 000 2h8a1 1 0 100-2H5z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Upload Video
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max size: {maxSizeMB}MB • MP4, WebM, MOV, AVI
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              {thumbnail && (
                <Image
                  src={thumbnail}
                  alt="Video thumbnail"
                  width={80}
                  height={60}
                  className="rounded object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {bytesToMB(selectedFile.size).toFixed(1)} MB
                </p>
                {selectedFile.type && (
                  <p className="text-xs text-gray-400">
                    {selectedFile.type}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setThumbnail(null);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="text-gray-600">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex space-x-2">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
            <button
              onClick={openFileDialog}
              disabled={isUploading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
