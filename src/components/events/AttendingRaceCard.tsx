'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AttendingRaceCardProps {
  id: string;
  title: string;
  location: string;
  date: Date;
  distance: string;
  imageUrl: string;
  onRemove: (id: string) => void;
}

export default function AttendingRaceCard({ 
  id, 
  title, 
  location, 
  date, 
  distance, 
  imageUrl,
  onRemove 
}: AttendingRaceCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = date.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [date]);

  return (
    <div className="bg-white border border-[#fc4c02]/31 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold line-clamp-2">{title}</h3>
              <p className="text-sm text-gray-600 truncate">{location}</p>
              <p className="text-xs text-gray-500 mt-1">{date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <button
              onClick={() => onRemove(id)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              title="Remove from attending"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-orange-50 text-[#fc4c02] rounded-full text-sm font-medium">
              {distance}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="border border-[#fc4c02] rounded-lg px-2 py-1.5 text-center">
              <div className="text-xl sm:text-2xl font-bold leading-none text-[#fc4c02]">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">Days</div>
            </div>
            <div className="border border-[#fc4c02] rounded-lg px-2 py-1.5 text-center">
              <div className="text-xl sm:text-2xl font-bold leading-none text-[#fc4c02]">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">Hours</div>
            </div>
            <div className="border border-[#fc4c02] rounded-lg px-2 py-1.5 text-center">
              <div className="text-xl sm:text-2xl font-bold leading-none text-[#fc4c02]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">Mins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
