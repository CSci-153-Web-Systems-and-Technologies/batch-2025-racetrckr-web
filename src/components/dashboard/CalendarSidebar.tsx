'use client';

import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

interface UpcomingRace {
  date: string;
  name: string;
  location: string;
}

interface CalendarSidebarProps {
  upcomingRaces: UpcomingRace[];
}

export default function CalendarSidebar({ upcomingRaces }: CalendarSidebarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="bg-white border border-[#fc4c02]/31 rounded-3xl shadow-sm p-4 sticky top-8 w-fit mx-auto">
      <h3 className="text-lg font-semibold mb-3 text-center">Calendar</h3>
      
      <div className="flex justify-center scale-90">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
        />
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2 text-center">Upcoming Races</h4>
        {upcomingRaces.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-gray-400">No upcoming races</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingRaces.map((race, index) => (
              <div key={index} className="border-l-4 border-[#fc4c02] pl-3 py-2">
                <div className="text-sm font-medium">{race.name}</div>
                <div className="text-xs text-gray-500">{race.location}</div>
                <div className="text-xs text-gray-400">{race.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
