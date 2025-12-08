'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AvatarUpload from './AvatarUpload';
import { createClient } from '@/lib/supabase';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentProfile: {
    email: string;
    first_name: string | null;
    last_name: string | null;
    location: string | null;
    bio: string | null;
    avatar_url: string | null;
    google_avatar_url: string | null;
  };
  onProfileUpdate: (updatedProfile: any) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  userId,
  currentProfile,
  onProfileUpdate,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(currentProfile.first_name || '');
  const [lastName, setLastName] = useState(currentProfile.last_name || '');
  const [location, setLocation] = useState(currentProfile.location || '');
  const [bio, setBio] = useState(currentProfile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentProfile.avatar_url);
  const [isSaving, setIsSaving] = useState(false);

  // Update form when currentProfile changes
  useEffect(() => {
    setFirstName(currentProfile.first_name || '');
    setLastName(currentProfile.last_name || '');
    setLocation(currentProfile.location || '');
    setBio(currentProfile.bio || '');
    setAvatarUrl(currentProfile.avatar_url);
  }, [currentProfile]);

  const handleSave = async () => {
    if (!firstName.trim()) {
      toast.error('First name is required');
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim() || null,
          location: location.trim() || null,
          bio: bio.trim() || null,
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        toast.error('Failed to update profile');
        console.error('Profile update error:', error);
        return;
      }

      toast.success('Profile updated successfully!');
      onProfileUpdate(data);
      onClose();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string | null) => {
    setAvatarUrl(newAvatarUrl);
    onProfileUpdate({ ...currentProfile, avatar_url: newAvatarUrl });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-3">
              Profile Picture
            </label>
            <AvatarUpload
              userId={userId}
              currentAvatarUrl={avatarUrl}
              googleAvatarUrl={currentProfile.google_avatar_url}
              userName={firstName || 'User'}
              onAvatarUpdate={handleAvatarUpdate}
              size="large"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={currentProfile.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSaving}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent disabled:opacity-50"
              placeholder="Enter your first name"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSaving}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent disabled:opacity-50"
              placeholder="Enter your last name"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSaving}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent disabled:opacity-50"
              placeholder="City, Country"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isSaving}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent disabled:opacity-50 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <Button
            onClick={onClose}
            disabled={isSaving}
            variant="outline"
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 bg-[#fc4c02] hover:bg-[#e64602]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
