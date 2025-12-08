'use client';

import CountdownTimer from './CountdownTimer';

interface NextRaceCardDesktopProps {
  raceName: string;
  location: string;
  date: string;
  raceDate: Date;
}

export default function NextRaceCardDesktop({ raceName, location, date, raceDate }: NextRaceCardDesktopProps) {
  return (
    <div>
      <h2 className="text-3xl lg:text-4xl font-semibold mb-6">
        Your <span className="text-[#fc4c02]">Next Race</span>
      </h2>

      <div className="bg-white border border-[#fc4c02]/31 rounded-3xl shadow-sm p-6 lg:p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl lg:text-3xl font-semibold mb-2">{raceName}</h3>
          <p className="text-gray-500 text-sm">
            {location} - {date}
          </p>
        </div>

        <CountdownTimer targetDate={raceDate} />
      </div>
    </div>
  );
}
