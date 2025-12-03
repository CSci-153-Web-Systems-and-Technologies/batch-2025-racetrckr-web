import { useRef } from 'react';
import Image from 'next/image';
import { X, Upload, Loader2 } from 'lucide-react';

interface CoverPhotoFieldProps {
  onPhotoChange: (file: File | null) => void;
  preview: string | null;
  isUploading?: boolean;
}

export default function CoverPhotoField({ onPhotoChange, preview, isUploading = false }: CoverPhotoFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      onPhotoChange(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    onPhotoChange(file);
  };

  const handleRemove = () => {
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Pick Cover Photo</label>
      
      {preview ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
          <Image
            src={preview}
            alt="Cover photo preview"
            fill
            className="object-cover"
          />
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-600 file:text-white file:font-medium hover:file:bg-gray-500 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <Upload className="w-3 h-3" />
            <span>Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</span>
          </div>
        </div>
      )}
    </div>
  );
}
