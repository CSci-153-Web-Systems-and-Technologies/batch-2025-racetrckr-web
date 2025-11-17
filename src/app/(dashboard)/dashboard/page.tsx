import Greeting from '@/components/dashboard/Greeting';
import StatsCard from '@/components/dashboard/StatsCard';
import NextRaceCard from '@/components/dashboard/NextRaceCard';
import BestEffortsCard from '@/components/dashboard/BestEffortsCard';

export default function DashboardPage() {
  //test
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

  const nextRace = {
    raceName: 'Maasin Marathon',
    location: 'Poblacion 4, Maasin City, Southern Leyte',
    date: 'Wednesday May 7, 2025',
    raceDate: new Date('2025-05-07T06:00:00'),
  };

  const achievements = [
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
    <div className="min-h-screen bg-white">
      {/* Status Bar Space */}
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
  );
}
