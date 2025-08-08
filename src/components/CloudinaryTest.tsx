"use client";

import { useState } from "react";

const CloudinaryTest = () => {
  const [result, setResult] = useState<string>("");
  
  const testCloudinary = async () => {
    setResult("Testing...");
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      setResult("❌ Environment variables not configured");
      return;
    }
    
    try {
      // Test if the upload preset exists by making a simple request
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: JSON.stringify({
          upload_preset: uploadPreset,
          file: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setResult("✅ Cloudinary configuration is working!");
      } else {
        const error = await response.text();
        setResult(`❌ Error: ${error}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    }
  };
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-4">Cloudinary Configuration Test</h3>
      <div className="space-y-2 mb-4">
        <p><strong>Cloud Name:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "Not set"}</p>
        <p><strong>Upload Preset:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Not set"}</p>
      </div>
      
      <button 
        onClick={testCloudinary}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Configuration
      </button>
      
      {result && (
        <div className="mt-4 p-3 bg-white rounded border">
          <pre className="text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default CloudinaryTest;
