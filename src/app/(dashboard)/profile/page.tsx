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
  cover_photo_url: string | null;
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

interface BestEffort {
  distance: string;
  unit: string;
  time: string;
  pace: string;
  race: string;
  date: string;
  hasMedal: boolean;
}

const STANDARD_DISTANCES = [
  { km: 3, label: '3', unit: 'KM' },
  { km: 5, label: '5', unit: 'KM' },
  { km: 10, label: '10', unit: 'KM' },
  { km: 21.0975, label: '½', unit: 'Marathon' },
  { km: 42.195, label: 'Marathon', unit: '' },
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
  const [bestEfforts, setBestEfforts] = useState<BestEffort[]>([]);

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
            imageUrl: race.cover_photo_url || 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80',
            distance: distanceDisplay,
          };
        });

        setRaces(formattedRaces);

        // Calculate best efforts for standard distances
        const calculatedBestEfforts: BestEffort[] = STANDARD_DISTANCES.map((standard) => {
          // Find best time for this distance
          const matchingRaces = races.filter((race) => {
            if (!race.distance) return false;
            const dist = race.distance;
            // Allow small tolerance for matching distances
            return Math.abs(dist - standard.km) < 0.5;
          });

          if (matchingRaces.length === 0) {
            // No races for this distance
            return {
              distance: standard.label,
              unit: standard.unit,
              time: '--:--:--',
              pace: '-- / km',
              race: '',
              date: '',
              hasMedal: false,
            };
          }

          // Find the race with the best (lowest) time
          const bestRace = matchingRaces.reduce((best, current) => {
            const bestSeconds = (best.hours || 0) * 3600 + (best.minutes || 0) * 60 + (best.seconds || 0);
            const currentSeconds = (current.hours || 0) * 3600 + (current.minutes || 0) * 60 + (current.seconds || 0);
            
            if (currentSeconds === 0) return best;
            if (bestSeconds === 0) return current;
            
            return currentSeconds < bestSeconds ? current : best;
          });

          const totalSeconds = (bestRace.hours || 0) * 3600 + (bestRace.minutes || 0) * 60 + (bestRace.seconds || 0);
          
          if (totalSeconds === 0) {
            return {
              distance: standard.label,
              unit: standard.unit,
              time: '--:--:--',
              pace: '-- / km',
              race: '',
              date: '',
              hasMedal: false,
            };
          }

          // Format time as HH:MM:SS
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

          // Calculate pace (minutes per km)
          const pacePerKm = totalSeconds / standard.km / 60;
          const paceMinutes = Math.floor(pacePerKm);
          const paceSeconds = Math.round((pacePerKm - paceMinutes) * 60);
          const paceFormatted = `${paceMinutes}:${String(paceSeconds).padStart(2, '0')} / km`;

          // Format date
          const dateFormatted = bestRace.date 
            ? new Date(bestRace.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            : '';

          return {
            distance: standard.label,
            unit: standard.unit,
            time: timeFormatted,
            pace: paceFormatted,
            race: bestRace.name,
            date: dateFormatted,
            hasMedal: true,
          };
        });

        setBestEfforts(calculatedBestEfforts);
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
