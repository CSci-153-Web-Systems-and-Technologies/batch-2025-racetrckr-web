import { createClient } from './supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Validate avatar file
 */
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 5MB.',
    };
  }

  return { valid: true };
}

/**
 * Compress and resize image before upload
 */
export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          0.9
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Upload avatar to Supabase Storage
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string; error?: string }> {
  try {
    const supabase = createClient();

    // Validate file
    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      return { url: '', error: validation.error };
    }

    // Compress image
    const compressedBlob = await compressImage(file);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

    // Delete old avatar if exists
    const { data: existingFiles } = await supabase.storage
      .from('avatars')
      .list(userId);

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map((file) => `${userId}/${file.name}`);
      await supabase.storage.from('avatars').remove(filesToDelete);
    }

    // Upload new avatar
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, compressedBlob, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      return { url: '', error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl };
  } catch (error) {
    console.error('Avatar upload error:', error);
    return { url: '', error: 'Failed to upload avatar' };
  }
}

/**
 * Update user profile with new avatar URL
 */
export async function updateProfileAvatar(
  userId: string,
  avatarUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
        .from('profiles')
        // set custom avatar and clear google avatar so custom takes precedence
        .update({ avatar_url: avatarUrl, google_avatar_url: null })
      .eq('id', userId);

    if (error) {
      console.error('RLS Error details:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

/**
 * Delete avatar from storage and profile
 */
export async function deleteAvatar(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // Delete from storage
    const { data: files } = await supabase.storage.from('avatars').list(userId);

    if (files && files.length > 0) {
      const filesToDelete = files.map((file) => `${userId}/${file.name}`);
      await supabase.storage.from('avatars').remove(filesToDelete);
    }

    // Update profile to remove avatar_url (keep google_avatar_url)
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Avatar deletion error:', error);
    return { success: false, error: 'Failed to delete avatar' };
  }
}

/**
 * Get avatar URL with fallback logic
 * Priority: custom avatar > Google avatar > default/initials
 */
export function getAvatarUrl(
  avatarUrl: string | null,
  googleAvatarUrl: string | null
): string | null {
  return avatarUrl || googleAvatarUrl || null;
}

/**
 * Generate initials from name for default avatar
 */
export function getInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
