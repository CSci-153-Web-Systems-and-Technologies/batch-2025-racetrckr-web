'use client';

import { useMemo } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface FinishTimeFieldsProps {
  formData: {
    hours: string;
    minutes: string;
    seconds: string;
  };
  distance: number; // in kilometers
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FinishTimeFields({ formData, distance, handleInputChange }: FinishTimeFieldsProps) {
  const validation = useMemo(() => {
    const hours = parseInt(formData.hours) || 0;
    const minutes = parseInt(formData.minutes) || 0;
    const seconds = parseInt(formData.seconds) || 0;

    const errors: string[] = [];
    
    if (minutes > 59) errors.push('Minutes cannot exceed 59');
    if (seconds > 59) errors.push('Seconds cannot exceed 59');
    if (hours < 0 || minutes < 0 || seconds < 0) errors.push('Time values cannot be negative');
    
    // Check for unrealistic times
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (distance > 0 && totalSeconds > 0) {
      const pacePerKm = totalSeconds / distance / 60; // minutes per km
      if (pacePerKm < 2) errors.push('Pace seems too fast (< 2 min/km)');
      if (pacePerKm > 20) errors.push('Pace seems too slow (> 20 min/km)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      totalSeconds
    };
  }, [formData.hours, formData.minutes, formData.seconds, distance]);

  const pace = useMemo(() => {
    if (!distance || validation.totalSeconds === 0) return null;

    const totalMinutes = validation.totalSeconds / 60;
    const pacePerKm = totalMinutes / distance;
    const paceMinutes = Math.floor(pacePerKm);
    const paceSeconds = Math.round((pacePerKm - paceMinutes) * 60);

    return {
      perKm: `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')} /km`,
      perMile: `${Math.floor(pacePerKm * 1.60934)}:${Math.round(((pacePerKm * 1.60934) % 1) * 60).toString().padStart(2, '0')} /mi`
    };
  }, [validation.totalSeconds, distance]);

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Finish Time</label>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-600 mb-2">Hours</label>
          <input
            type="number"
            name="hours"
            value={formData.hours}
            onChange={handleInputChange}
            min="0"
            max="23"
            placeholder="00"
            className={`w-full px-4 py-3 border ${
              !validation.isValid && formData.hours ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent text-center`}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-2">Minutes</label>
          <input
            type="number"
            name="minutes"
            value={formData.minutes}
            onChange={handleInputChange}
            min="0"
            max="59"
            placeholder="00"
            className={`w-full px-4 py-3 border ${
              !validation.isValid && formData.minutes ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent text-center`}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-2">Seconds</label>
          <input
            type="number"
            name="seconds"
            value={formData.seconds}
            onChange={handleInputChange}
            min="0"
            max="59"
            placeholder="00"
            className={`w-full px-4 py-3 border ${
              !validation.isValid && formData.seconds ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent text-center`}
          />
        </div>
      </div>

      {/* Validation Errors */}
      {!validation.isValid && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            {validation.errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        </div>
      )}

      {/* Pace Calculator */}
      {pace && validation.isValid && (
        <div className="mt-4 p-4 bg-gradient-to-r from-[#fc4c02]/10 to-orange-50 border border-[#fc4c02]/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-[#fc4c02]" />
            <h4 className="font-semibold text-gray-900">Average Pace</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-[#fc4c02]">{pace.perKm}</div>
              <div className="text-xs text-gray-600 mt-1">Per Kilometer</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-[#fc4c02]">{pace.perMile}</div>
              <div className="text-xs text-gray-600 mt-1">Per Mile</div>
            </div>
          </div>
        </div>
      )}
      
      {!distance && (formData.hours || formData.minutes || formData.seconds) && (
        <div className="mt-3 text-sm text-gray-500 italic">
          Enter a distance to see pace calculation
        </div>
      )}
    </div>
  );
}
