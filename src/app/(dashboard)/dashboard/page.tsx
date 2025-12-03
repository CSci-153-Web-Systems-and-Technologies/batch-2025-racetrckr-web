'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { FullPageLoading } from '@/components/auth/shared/LoadingSpinner';
import Greeting from '@/components/dashboard/Greeting';
import StatsCard from '@/components/dashboard/StatsCard';
import StatsCardDesktop from '@/components/dashboard/StatsCardDesktop';
import NextRaceCard from '@/components/dashboard/NextRaceCard';
import NextRaceCardDesktop from '@/components/dashboard/NextRaceCardDesktop';
import EmptyNextRace from '@/components/dashboard/EmptyNextRace';
import BestEffortsCard from '@/components/dashboard/BestEffortsCard';
import BestEffortsDesktop from '@/components/dashboard/BestEffortsDesktop';
import CalendarSidebar from '@/components/dashboard/CalendarSidebar';

export default function DashboardPage() {
  const [userData, setUserData] = useState<{
    name: string;
    totalRaces: number;
    totalDistance: number;
    timeOnFeet: {
      hours: number;
      minutes: number;
      seconds: number;
    };
    nextRace: {
      raceName: string;
      location: string;
      date: string;
      raceDate: Date;
    } | null;
    achievements: Array<{
      distance: number;
      time: string;
      pace: string;
      raceName: string;
    }>;
  }>({
    name: '',
    totalRaces: 0,
    totalDistance: 0,
    timeOnFeet: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    nextRace: null,
    achievements: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient();

        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setLoading(false);
          return;
        }

        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        // Fetch user races for stats and best efforts
        const { data: races, error: racesError } = await supabase
          .from('races')
          .select('distance, hours, minutes, seconds, name')
          .eq('user_id', user.id);

        console.log('Dashboard - Fetched races:', races);
        console.log('Dashboard - Races error:', racesError);
        console.log('Dashboard - User ID:', user.id);

        // Calculate stats
        let totalRaces = 0;
        let totalDistance = 0;
        let totalSeconds = 0;

        if (races && races.length > 0) {
          totalRaces = races.length;
          totalDistance = races.reduce((sum, race) => sum + (race.distance || 0), 0);
          totalSeconds = races.reduce((sum, race) => {
            const hours = race.hours || 0;
            const minutes = race.minutes || 0;
            const seconds = race.seconds || 0;
            return sum + (hours * 3600 + minutes * 60 + seconds);
          }, 0);
        }

        console.log('Dashboard - Calculated stats:', { totalRaces, totalDistance, totalSeconds });

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Format name
        const displayName = profile
          ? `${profile.first_name || ''}${profile.last_name ? ' ' + profile.last_name : ''}`.trim()
          : 'Runner';

        // Fetch upcoming race (next race in the future)
        const now = new Date().toISOString().split('T')[0];
        const { data: upcomingRaces } = await supabase
          .from('races')
          .select('name, date, city_municipality, province')
          .eq('user_id', user.id)
          .gte('date', now)
          .order('date', { ascending: true })
          .limit(1);

        const upcomingRace = upcomingRaces && upcomingRaces.length > 0 ? upcomingRaces[0] : null;

        // Calculate best efforts for standard distances
        const STANDARD_DISTANCES = [
          { km: 3, distance: 3 },
          { km: 5, distance: 5 },
          { km: 10, distance: 10 },
          { km: 21.0975, distance: 21 },
          { km: 42.195, distance: 42 },
        ];

        const calculatedAchievements = STANDARD_DISTANCES.map((standard) => {
          if (!races || races.length === 0) {
            return {
              distance: standard.distance,
              time: '--:--:--',
              pace: '-- / km',
              raceName: '',
            };
          }

          // Find best time for this distance
          const matchingRaces = races.filter((race) => {
            if (!race.distance) return false;
            const dist = race.distance;
            return Math.abs(dist - standard.km) < 0.5;
          });

          if (matchingRaces.length === 0) {
            return {
              distance: standard.distance,
              time: '--:--:--',
              pace: '-- / km',
              raceName: '',
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

          const bestTotalSeconds = (bestRace.hours || 0) * 3600 + (bestRace.minutes || 0) * 60 + (bestRace.seconds || 0);
          
          if (bestTotalSeconds === 0) {
            return {
              distance: standard.distance,
              time: '--:--:--',
              pace: '-- / km',
              raceName: '',
            };
          }

          // Format time as HH:MM:SS
          const raceHours = Math.floor(bestTotalSeconds / 3600);
          const raceMinutes = Math.floor((bestTotalSeconds % 3600) / 60);
          const raceSeconds = bestTotalSeconds % 60;
          const timeFormatted = `${String(raceHours).padStart(2, '0')}:${String(raceMinutes).padStart(2, '0')}:${String(raceSeconds).padStart(2, '0')}`;

          // Calculate pace (minutes per km)
          const pacePerKm = bestTotalSeconds / standard.km / 60;
          const paceMinutes = Math.floor(pacePerKm);
          const paceSeconds = Math.round((pacePerKm - paceMinutes) * 60);
          const paceFormatted = `${paceMinutes}:${String(paceSeconds).padStart(2, '0')} / km`;

          return {
            distance: standard.distance,
            time: timeFormatted,
            pace: paceFormatted,
            raceName: bestRace.name || '',
          };
        });

        console.log('Dashboard - Final calculated achievements:', calculatedAchievements);
        console.log('Dashboard - Setting userData with:', {
          name: displayName,
          totalRaces,
          totalDistance: Math.round(totalDistance * 100) / 100,
          timeOnFeet: { hours, minutes, seconds },
          nextRace: upcomingRace,
          achievementsCount: calculatedAchievements.length,
        });

        setUserData({
          name: displayName,
          totalRaces,
          totalDistance: Math.round(totalDistance * 100) / 100,
          timeOnFeet: { hours, minutes, seconds },
          nextRace: upcomingRace ? {
            raceName: upcomingRace.name,
            location: `${upcomingRace.city_municipality}, ${upcomingRace.province}`,
            date: new Date(upcomingRace.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            raceDate: new Date(upcomingRace.date),
          } : null,
          achievements: calculatedAchievements,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return <FullPageLoading />;
  }

  const nextRace = userData.nextRace || {
    raceName: 'Your Next Race',
    location: 'Coming Soon',
    date: 'Check Events for races to join',
    raceDate: new Date(),
  };

  return (
    <>
      {/* Mobile View */}
      <div className="min-h-screen bg-white lg:hidden">
        <div className="h-7 bg-white"></div>
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <Greeting userName={userData.name} />
          <StatsCard
            totalRaces={userData.totalRaces}
            totalDistance={userData.totalDistance}
            timeOnFeet={userData.timeOnFeet}
          />
          {userData.nextRace ? (
            <NextRaceCard
              raceName={nextRace.raceName}
              location={nextRace.location}
              date={nextRace.date}
              raceDate={nextRace.raceDate}
            />
          ) : (
            <EmptyNextRace />
          )}
          <BestEffortsCard achievements={userData.achievements} />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Greeting userName={userData.name} />
              <StatsCardDesktop
                totalRaces={userData.totalRaces}
                totalDistance={userData.totalDistance}
                timeOnFeet={userData.timeOnFeet}
              />
              {userData.nextRace ? (
                <NextRaceCardDesktop
                  raceName={nextRace.raceName}
                  location={nextRace.location}
                  date={nextRace.date}
                  raceDate={nextRace.raceDate}
                />
              ) : (
                <EmptyNextRace />
              )}
              <BestEffortsDesktop 
                achievements={userData.achievements}
                userName={userData.name.split(' ')[0]}
              />
            </div>

            {/* Right Column - Calendar Sidebar */}
            <div className="lg:col-span-1">
              <CalendarSidebar />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
