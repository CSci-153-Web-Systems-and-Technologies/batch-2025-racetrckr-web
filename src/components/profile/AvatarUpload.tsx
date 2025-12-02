'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  uploadAvatar,
  updateProfileAvatar,
  deleteAvatar,
  getInitials,
} from '@/lib/avatar';

interface AvatarUploadProps {
  userId?: string | null;
  currentAvatarUrl?: string | null;
  googleAvatarUrl?: string | null;
  userName?: string;
  onAvatarUpdate?: (newUrl: string | null) => void;
  size?: 'default' | 'large';
  showCamera?: boolean;
}

export default function AvatarUpload({
  userId,
  currentAvatarUrl,
  googleAvatarUrl,
  userName = 'User',
  onAvatarUpdate,
  size = 'default',
  showCamera = true,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine which avatar to display
  const displayAvatar = currentAvatarUrl || googleAvatarUrl;
  const hasCustomAvatar = !!currentAvatarUrl;
  const initials = getInitials(userName);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setShowModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    if (!userId) {
      toast.error('Profile still loading. Please try again in a moment.');
      return;
    }

    setIsUploading(true);
    const file = fileInputRef.current.files[0];

    try {
      // Upload to storage
      const { url, error: uploadError } = await uploadAvatar(userId, file);
      if (uploadError) {
        toast.error(`Upload failed: ${uploadError}`);
        return;
      }

      // Update profile
      const { success, error: updateError } = await updateProfileAvatar(userId, url);
      if (updateError) {
        toast.error(`Profile update failed: ${updateError}`);
        return;
      }

      toast.success('Avatar updated successfully!');
      setShowModal(false);
      setPreviewUrl(null);
      onAvatarUpdate?.(url);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!hasCustomAvatar) return;
    if (!userId) {
      toast.error('Profile still loading. Please try again in a moment.');
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await deleteAvatar(userId);
      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Avatar removed. Using default avatar.');
      onAvatarUpdate?.(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to remove avatar');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const avatarSize = size === 'large' ? 'w-32 h-32' : 'w-32 h-32';
  const textSize = size === 'large' ? 'text-4xl' : 'text-3xl';
  const cameraIconSize = size === 'large' ? 'w-10 h-10' : 'w-8 h-8';
  const badgeSize = size === 'large' ? 'p-3' : 'p-2';
  const badgeIconSize = size === 'large' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <>
      {/* Avatar Display */}
      <div className="relative group">
        <div className={`relative ${avatarSize} rounded-full overflow-hidden bg-gray-200 border-4 border-gray-100 shadow-lg flex-shrink-0`}>
          {displayAvatar ? (
            <Image
              src={displayAvatar}
              alt={userName}
              fill
              className="object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-[#fc4c02] text-white ${textSize} font-bold`}>
              {initials}
            </div>
          )}
        </div>

        {/* Edit Button Overlay */}
        {showCamera && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              disabled={isUploading || isDeleting}
            >
              <Camera className={`${cameraIconSize} text-white`} />
            </button>

            {/* Camera Icon Badge */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`absolute bottom-0 right-0 ${badgeSize} bg-[#fc4c02] rounded-full shadow-lg hover:bg-[#e64602] transition-colors`}
              disabled={isUploading || isDeleting}
            >
              <Camera className={`${badgeIconSize} text-white`} />
            </button>
          </>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading || isDeleting}
        />
      </div>

      {/* Remove Avatar Button (only show if has custom avatar) */}
      {hasCustomAvatar && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center gap-1 disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Removing...
            </>
          ) : (
            <>
              <X className="w-4 h-4" />
              Remove Avatar
            </>
          )}
        </button>
      )}

      {/* Google avatar note removed per request */}

      {/* Upload Preview Modal */}
      {showModal && previewUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upload Avatar</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
                disabled={isUploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>• Image will be resized to 500x500px</p>
              <p>• Maximum file size: 5MB</p>
              <p>• Formats: JPEG, PNG, WebP, GIF</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 bg-[#fc4c02] hover:bg-[#e64602] text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
