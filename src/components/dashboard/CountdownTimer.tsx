'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
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
  }, [targetDate]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Days */}
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
  );
}
