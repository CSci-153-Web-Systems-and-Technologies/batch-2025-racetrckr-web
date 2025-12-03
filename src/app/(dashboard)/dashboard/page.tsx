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

        // Fetch user races for stats
        const { data: races } = await supabase
          .from('races')
          .select('distance, hours, minutes, seconds')
          .eq('user_id', user.id);

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

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Format name
        const displayName = profile
          ? `${profile.first_name || ''}${profile.last_name ? ' ' + profile.last_name : ''}`.trim()
          : 'Runner';

        // Fetch upcoming race (next race in the future)
        const now = new Date().toISOString();
        const { data: upcomingRaces } = await supabase
          .from('races')
          .select('race_name, race_date, city, province')
          .eq('user_id', user.id)
          .gte('race_date', now)
          .order('race_date', { ascending: true })
          .limit(1);

        const upcomingRace = upcomingRaces && upcomingRaces.length > 0 ? upcomingRaces[0] : null;

        setUserData({
          name: displayName,
          totalRaces,
          totalDistance: Math.round(totalDistance * 100) / 100,
          timeOnFeet: { hours, minutes, seconds },
          nextRace: upcomingRace ? {
            raceName: upcomingRace.race_name,
            location: `${upcomingRace.city}, ${upcomingRace.province}`,
            date: new Date(upcomingRace.race_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            raceDate: new Date(upcomingRace.race_date),
          } : null,
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

  const achievements = [
    {
      distance: 3,
      time: '00:12:23',
      pace: '4:07 / km',
      raceName: 'Maasin City Marathon',
    },
    {
      distance: 5,
      time: '--:--:--',
      pace: '-- / km',
      raceName: '',
    },
    {
      distance: 10,
      time: '00:12:23',
      pace: '4:07 / km',
      raceName: 'Maasin City Marathon',
    },
    {
      distance: 21,
      time: '00:12:23',
      pace: '4:07 / km',
      raceName: 'Maasin City Marathon',
    },
    {
      distance: 42,
      time: '00:12:23',
      pace: '4:07 / km',
      raceName: 'Maasin City Marathon',
    },
  ];

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
          <BestEffortsCard achievements={achievements} />
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
                achievements={achievements}
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
