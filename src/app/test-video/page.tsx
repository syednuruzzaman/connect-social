"use client";

import { useState } from 'react';
import VideoUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';
import Navbar from '@/components/Navbar';

export default function TestVideoPage() {
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleVideoUploaded = (videoUrl: string, thumbnailUrl?: string) => {
    console.log('Video uploaded successfully:', videoUrl);
    setUploadedVideoUrl(videoUrl);
    if (thumbnailUrl) {
      setThumbnail(thumbnailUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Video Upload Test (500MB Support)
          </h1>
          
          <div className="space-y-6">
            {/* Upload Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Upload Your Video (Up to 500MB)
              </h2>
              <VideoUpload
                onVideoUploaded={handleVideoUploaded}
                maxSizeMB={500}
                className="w-full"
              />
            </div>

            {/* Video Player Section */}
            {uploadedVideoUrl && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Uploaded Video
                </h2>
                <div className="bg-black rounded-lg overflow-hidden">
                  <VideoPlayer
                    src={uploadedVideoUrl}
                    poster={thumbnail || undefined}
                    className="w-full"
                  />
                </div>
                
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">
                    <strong>Success!</strong> Video uploaded and ready for playback.
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Video URL: {uploadedVideoUrl}
                  </p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Test Instructions:
              </h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Select a video file up to 500MB in size</li>
                <li>• Supported formats: MP4, WebM, MOV, AVI</li>
                <li>• Large files will be uploaded using chunked upload</li>
                <li>• The video will be automatically optimized by Cloudinary</li>
                <li>• A thumbnail will be generated if possible</li>
              </ul>
            </div>

            {/* Current Status */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Current Configuration:
              </h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Maximum file size: 500MB</li>
                <li>• Chunked upload: Enabled for files over 100MB</li>
                <li>• Video optimization: Enabled</li>
                <li>• Cloudinary integration: Active</li>
                <li>• Environment variables: Configured</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
