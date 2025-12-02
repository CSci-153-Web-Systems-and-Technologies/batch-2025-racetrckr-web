'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import ProfileHeader from "@/components/profile/ProfileHeader";
import RaceArchive from "@/components/profile/RaceArchive";
import PersonalBest from "@/components/profile/PersonalBest";
import { FullPageLoading } from '@/components/auth/shared/LoadingSpinner';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  google_avatar_url: string | null;
}

const profileRaces = [
  {
    id: 1,
    title: "Bohol International Marathon",
    imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80",
    distance: "Full Marathon",
  },
  {
    id: 2,
    title: "Bohol International Marathon",
    imageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80",
    distance: "21K",
  },
  {
    id: 3,
    title: "Bohol International Marathon",
    imageUrl: "https://images.unsplash.com/photo-1565411642431-7e2c99f2d686?w=800&q=80",
    distance: "10K",
  },
];

const bestEfforts = [
  {
    distance: "3",
    unit: "KM",
    time: "00:12:23",
    pace: "4:07 / km",
    race: "Maasin City Marathon",
    date: "August 3, 2025",
    hasMedal: true,
  },
  {
    distance: "5",
    unit: "KM",
    time: "--:--:--",
    pace: "-- / km",
    race: "",
    date: "",
    hasMedal: true,
  },
  {
    distance: "10",
    unit: "KM",
    time: "00:12:23",
    pace: "4:07 / km",
    race: "Maasin City Marathon",
    date: "August 3, 2025",
    hasMedal: true,
  },
  {
    distance: "½",
    unit: "Marathon",
    time: "00:12:23",
    pace: "4:07 / km",
    race: "Maasin City Marathon",
    date: "August 3, 2025",
    hasMedal: true,
  },
  {
    distance: "Marathon",
    unit: "",
    time: "00:12:23",
    pace: "4:07 / km",
    race: "Maasin City Marathon",
    date: "August 3, 2025",
    hasMedal: true,
  },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error('Error fetching user:', userError);
          setLoading(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          // Profile doesn't exist, create it
          if (profileError.code === 'PGRST116') {
            // Extract first name from full name or email
            const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
            const firstName = fullName ? fullName.split(' ')[0] : user.email?.split('@')[0] || 'Runner';
            
            const { data: newProfile } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                first_name: firstName,
                google_avatar_url: user.user_metadata?.avatar_url || null,
              })
              .select()
              .single();
            
            if (newProfile) {
              setProfile(newProfile);
            }
          }
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        // Unexpected error occurred
      } finally {
        setLoading(false);
      }
    }

    loadProfile();

    // Set up real-time subscription for profile updates
    const supabase = createClient();
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            setProfile(payload.new as UserProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAvatarUpdate = (newAvatarUrl: string | null) => {
    if (profile) {
      setProfile({
        ...profile,
        avatar_url: newAvatarUrl,
      });
    }
  };

  if (loading) {
    return <FullPageLoading />;
  }

  const displayName = profile?.first_name 
    ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`
    : 'Runner';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ProfileHeader
          userId={profile?.id || ''}
          name={displayName}
          location={profile?.location || ''}
          bio={profile?.bio || ''}
          imageUrl={profile?.avatar_url || ''}
          googleAvatarUrl={profile?.google_avatar_url || ''}
          totalRaces={3}
          totalDistance={52}
          timeOnFeet={{
            hours: 4,
            minutes: 45,
            seconds: 36,
          }}
          onAvatarUpdate={handleAvatarUpdate}
        />

        <RaceArchive races={profileRaces} />

        <PersonalBest efforts={bestEfforts} />
      </div>
    </div>
  );
}
