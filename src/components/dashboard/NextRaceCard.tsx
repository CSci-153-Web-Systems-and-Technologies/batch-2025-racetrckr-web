'use client';

import { useEffect, useState } from 'react';

interface NextRaceCardProps {
  raceName: string;
  location: string;
  date: string;
  raceDate: Date;
}

export default function NextRaceCard({ raceName, location, date, raceDate }: NextRaceCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = raceDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [raceDate]);

  return (
    <div className="mb-8">
      <h2 className="text-[32px] leading-tight mb-6">
        Your <span className="text-[#fc4c02]">Next Race</span>
      </h2>

      <div className="bg-white border border-[#fc4c02]/31 rounded-3xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h3 className="text-[24px] mb-1">{raceName}</h3>
          <p className="text-gray-400 text-[12px]">{location}</p>
          <p className="text-gray-400 text-[12px]">{date}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-[#fc4c02] rounded-xl p-4 text-center">
            <div className="text-[56px] leading-none mb-1">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[14px]">Days</div>
          </div>

          {/* Hours */}
          <div className="border-2 border-[#fc4c02] rounded-xl p-4 text-center">
            <div className="text-[56px] leading-none mb-1">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[14px]">Hours</div>
          </div>

          {/* Minutes */}
          <div className="border-2 border-[#fc4c02] rounded-xl p-4 text-center">
            <div className="text-[56px] leading-none mb-1">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[14px]">Minutes</div>
          </div>

          {/* Seconds */}
          <div className="border-2 border-[#fc4c02] rounded-xl p-4 text-center">
            <div className="text-[56px] leading-none mb-1">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[14px]">Seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
}
