'use client';

import { useState } from 'react';
import { Edit, Share2 } from "lucide-react";
import AvatarUpload from "./AvatarUpload";
import EditProfileModal from "./EditProfileModal";

interface ProfileHeaderProps {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  location: string;
  bio: string;
  imageUrl: string;
  googleAvatarUrl: string;
  totalRaces: number;
  totalDistance: number;
  timeOnFeet: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  onAvatarUpdate: (newAvatarUrl: string | null) => void;
  onProfileUpdate: (updatedProfile: any) => void;
}

export default function ProfileHeader({
  userId,
  email,
  firstName,
  lastName,
  name,
  location,
  bio,
  imageUrl,
  googleAvatarUrl,
  totalRaces,
  totalDistance,
  timeOnFeet,
  onAvatarUpdate,
  onProfileUpdate,
}: ProfileHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  return (
    <div className="bg-white rounded-3xl border border-[#fc4c02]/31 shadow-sm p-8 mb-8 relative">
      {/* Edit and Share Icons */}
      <div className="absolute top-6 right-6 flex gap-3 z-10">
        <button 
          onClick={() => setShowEditModal(true)}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Edit className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        userId={userId}
        currentProfile={{
          email,
          first_name: firstName,
          last_name: lastName,
          location,
          bio,
          avatar_url: imageUrl,
          google_avatar_url: googleAvatarUrl,
        }}
        onProfileUpdate={onProfileUpdate}
      />

      <div className="flex flex-col gap-8">
        {/* Profile Image and Info */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
          <AvatarUpload
            userId={userId}
            currentAvatarUrl={imageUrl}
            googleAvatarUrl={googleAvatarUrl}
            userName={name}
            onAvatarUpdate={onAvatarUpdate}
            size="large"
            showCamera={false}
          />
          
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#fc4c02] mb-1">{name}</h1>
            <p className="text-gray-600 text-sm mb-0.5">{location}</p>
            <p className="text-gray-600 text-sm">{bio}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-4xl mx-auto">
          {/* Total Races */}
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-3">Total Races</h3>
            <div className="text-[48px] sm:text-[60px] md:text-[80px] leading-none font-normal">{totalRaces}</div>
          </div>

          {/* Total Distance */}
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-3">Total Distance</h3>
            <div className="text-[48px] sm:text-[60px] md:text-[80px] leading-none font-normal">
              {totalDistance}<span className="text-[#fc4c02] text-[16px] sm:text-[18px] md:text-[20px]">KM</span>
            </div>
          </div>

          {/* Time on Feet */}
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-3">Time on Feet</h3>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                <span className="text-[#fc4c02] text-[20px] sm:text-[24px] md:text-[28px] leading-none">
                  {String(timeOnFeet.hours).padStart(2, '0')}
                </span>
                <span className="text-gray-500 text-[10px] sm:text-[11px] md:text-[13px]">Hours</span>
              </div>
              <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                <span className="text-[#fc4c02] text-[20px] sm:text-[24px] md:text-[28px] leading-none">
                  {String(timeOnFeet.minutes).padStart(2, '0')}
                </span>
                <span className="text-gray-500 text-[10px] sm:text-[11px] md:text-[13px]">Minutes</span>
              </div>
              <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                <span className="text-[#fc4c02] text-[20px] sm:text-[24px] md:text-[28px] leading-none">
                  {String(timeOnFeet.seconds).padStart(2, '0')}
                </span>
                <span className="text-gray-500 text-[10px] sm:text-[11px] md:text-[13px]">Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
