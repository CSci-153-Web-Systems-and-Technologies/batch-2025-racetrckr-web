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

interface Race {
  id: string;
  user_id: string;
  name: string;
  distance: number | null;
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
  date: string | null;
  created_at: string;
}

interface UserStats {
  totalRaces: number;
  totalDistance: number;
  timeOnFeet: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

interface RaceDisplay {
  id: string;
  title: string;
  imageUrl: string;
  distance: string;
}

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
  const [authUserId, setAuthUserId] = useState<string>('');
  const [userStats, setUserStats] = useState<UserStats>({
    totalRaces: 0,
    totalDistance: 0,
    timeOnFeet: { hours: 0, minutes: 0, seconds: 0 },
  });
  const [races, setRaces] = useState<RaceDisplay[]>([]);

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

        setAuthUserId(user.id);

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

  useEffect(() => {
    async function loadRaceStats() {
      if (!authUserId) return;

      try {
        const supabase = createClient();
        const { data: races, error } = await supabase
          .from('races')
          .select('*')
          .eq('user_id', authUserId);

        if (error) {
          console.error('Error fetching races:', error);
          return;
        }

        if (!races || races.length === 0) {
          setUserStats({
            totalRaces: 0,
            totalDistance: 0,
            timeOnFeet: { hours: 0, minutes: 0, seconds: 0 },
          });
          return;
        }

        // Calculate stats
        const totalRaces = races.length;
        const totalDistance = races.reduce((sum, race) => {
          return sum + (race.distance || 0);
        }, 0);

        // Calculate total time on feet
        const totalSeconds = races.reduce((sum, race) => {
          const hours = race.hours || 0;
          const minutes = race.minutes || 0;
          const seconds = race.seconds || 0;
          return sum + (hours * 3600 + minutes * 60 + seconds);
        }, 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setUserStats({
          totalRaces,
          totalDistance: Math.round(totalDistance * 100) / 100, // Round to 2 decimals
          timeOnFeet: { hours, minutes, seconds },
        });

        // Format races for display
        const formattedRaces: RaceDisplay[] = races.map((race) => {
          // Format distance for display
          let distanceDisplay = '';
          if (race.distance) {
            const dist = race.distance;
            if (dist === 42.195 || dist === 42.2 || dist === 42) {
              distanceDisplay = 'Full Marathon';
            } else if (dist === 21.0975 || dist === 21.1 || dist === 21) {
              distanceDisplay = 'Half Marathon';
            } else if (dist >= 1) {
              distanceDisplay = `${dist}K`;
            } else {
              distanceDisplay = `${dist}K`;
            }
          }

          return {
            id: race.id,
            title: race.name,
            imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80', // Default placeholder
            distance: distanceDisplay,
          };
        });

        setRaces(formattedRaces);
      } catch (error) {
        console.error('Unexpected error loading race stats:', error);
      }
    }

    loadRaceStats();
  }, [authUserId]);

  const handleAvatarUpdate = (newAvatarUrl: string | null) => {
    if (profile) {
      setProfile({
        ...profile,
        avatar_url: newAvatarUrl,
      });
    }
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    setProfile(updatedProfile);
  };

  const resolvedUserId = profile?.id ?? authUserId;

  if (loading || !resolvedUserId) {
    return <FullPageLoading />;
  }

  const displayName = profile?.first_name 
    ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`
    : 'Runner';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ProfileHeader
          userId={resolvedUserId}
          email={profile?.email || ''}
          firstName={profile?.first_name || ''}
          lastName={profile?.last_name || ''}
          name={displayName}
          location={profile?.location || ''}
          bio={profile?.bio || ''}
          imageUrl={profile?.avatar_url || ''}
          googleAvatarUrl={profile?.google_avatar_url || ''}
          totalRaces={userStats.totalRaces}
          totalDistance={userStats.totalDistance}
          timeOnFeet={userStats.timeOnFeet}
          onAvatarUpdate={handleAvatarUpdate}
          onProfileUpdate={handleProfileUpdate}
        />

        <RaceArchive races={races} />

        <PersonalBest efforts={bestEfforts} />
      </div>
    </div>
  );
}
