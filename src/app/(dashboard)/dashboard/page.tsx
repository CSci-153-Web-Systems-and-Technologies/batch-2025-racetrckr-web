import Greeting from '@/components/dashboard/Greeting';
import StatsCard from '@/components/dashboard/StatsCard';
import StatsCardDesktop from '@/components/dashboard/StatsCardDesktop';
import NextRaceCard from '@/components/dashboard/NextRaceCard';
import NextRaceCardDesktop from '@/components/dashboard/NextRaceCardDesktop';
import BestEffortsCard from '@/components/dashboard/BestEffortsCard';
import BestEffortsDesktop from '@/components/dashboard/BestEffortsDesktop';
import CalendarSidebar from '@/components/dashboard/CalendarSidebar';

export default function DashboardPage() {
  const userData = {
    name: 'Hanni Pham',
    totalRaces: 3,
    totalDistance: 52,
    timeOnFeet: {
      hours: 4,
      minutes: 45,
      seconds: 36,
    },
  };

  // Mock race date for testing countdown (5 minutes from now)
  const mockRaceDate = new Date();
  mockRaceDate.setMinutes(mockRaceDate.getMinutes() + 5);

  const nextRace = {
    raceName: 'Maasin Marathon',
    location: 'Poblacion 4, Maasin City, Southern Leyte',
    date: 'Testing Countdown',
    raceDate: mockRaceDate,
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
          <NextRaceCard
            raceName={nextRace.raceName}
            location={nextRace.location}
            date={nextRace.date}
            raceDate={nextRace.raceDate}
          />
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
              <NextRaceCardDesktop
                raceName={nextRace.raceName}
                location={nextRace.location}
                date={nextRace.date}
                raceDate={nextRace.raceDate}
              />
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
