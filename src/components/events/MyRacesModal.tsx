'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import AttendingRaceCard from './AttendingRaceCard';

interface MyRacesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyRacesModal = ({ isOpen, onClose }: MyRacesModalProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendingRaces, setAttendingRaces] = useState([
    {
      id: '1',
      title: 'Maasin Marathon 2025',
      location: 'Maasin City, Southern Leyte',
      date: new Date('2025-05-07'),
      distance: 'Marathon',
      imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'City Fun Run',
      location: 'Manila, Philippines',
      date: new Date('2025-06-15'),
      distance: '10km',
      imageUrl: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Mountain Trail Challenge',
      location: 'Baguio City, Benguet',
      date: new Date('2025-07-20'),
      distance: 'Ultra Marathon',
      imageUrl: 'https://images.unsplash.com/photo-1472148439583-2f0b5e2d0351?w=400&h=300&fit=crop'
    }
  ]);

  const handleRemoveRace = (id: string) => {
    setAttendingRaces(prev => prev.filter(race => race.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white rounded-lg shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b bg-white px-6 py-4 flex-shrink-0">
          <h2 className="text-2xl font-bold">My Races</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold mb-4">Attending Races ({attendingRaces.length})</h3>
            
            {attendingRaces.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No races yet!</p>
                <p className="text-sm mt-2">Start attending races to see them here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attendingRaces.map((race) => (
                  <AttendingRaceCard
                    key={race.id}
                    {...race}
                    onRemove={handleRemoveRace}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-80 border-l bg-gray-50 p-6 overflow-y-auto flex-shrink-0 hidden lg:block">
            <h3 className="text-lg font-semibold mb-4">Calendar</h3>
            
            <div className="bg-white rounded-lg border border-[#fc4c02]/31 p-4 shadow-sm">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Races</h4>
              <div className="space-y-3">
                {attendingRaces
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((race) => (
                    <div key={race.id} className="border-l-4 border-[#fc4c02] pl-3 py-2 bg-white rounded-r-md shadow-sm">
                      <div className="text-sm font-medium">{race.title}</div>
                      <div className="text-xs text-gray-500">{race.location}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {race.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRacesModal;
