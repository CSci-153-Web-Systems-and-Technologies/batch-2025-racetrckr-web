'use client';

import { useEffect, useState } from 'react';
import { calculateTimeRemaining, padNumber } from '@/utils/countdown';

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
    const updateCountdown = () => {
      const remaining = calculateTimeRemaining(targetDate);
      setTimeLeft(remaining);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Days */}
      <div className="border-2 border-[#fc4c02] rounded-xl p-4 text-center">
        <div className="text-[56px] leading-none mb-1">
          {padNumber(timeLeft.days)}
        </div>
        <div className="text-[14px]">Days</div>
      </div>

      {/* Hours */}
      <div className="border-2 border-[#fc4c02] rounded-xl p-4 text-center">
        <div className="text-[56px] leading-none mb-1">
          {padNumber(timeLeft.hours)}
        </div>
        <div className="text-[14px]">Hours</div>
      </div>

      {/* Minutes */}
      <div className="border-2 border-[#fc4c02] rounded-xl p-4 text-center">
        <div className="text-[56px] leading-none mb-1">
          {padNumber(timeLeft.minutes)}
        </div>
        <div className="text-[14px]">Minutes</div>
      </div>

      {/* Seconds */}
      <div className="border-2 border-[#fc4c02] rounded-xl p-4 text-center">
        <div className="text-[56px] leading-none mb-1">
          {padNumber(timeLeft.seconds)}
        </div>
        <div className="text-[14px]">Seconds</div>
      </div>
    </div>
  );
}
