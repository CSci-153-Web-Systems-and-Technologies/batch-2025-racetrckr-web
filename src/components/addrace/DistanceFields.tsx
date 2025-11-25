'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DistanceFieldsProps {
  formData: {
    distance: string;
    customDistanceValue: string;
    customDistanceUnit: string;
  };
  onDistanceChange: (distance: string) => void;
  onCustomDistanceChange: (value: string, unit: string) => void;
}

export default function DistanceFields({ formData, onDistanceChange, onCustomDistanceChange }: DistanceFieldsProps) {
  const [showUnitPopup, setShowUnitPopup] = useState(false);
  const [customValue, setCustomValue] = useState(formData.customDistanceValue);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDistanceChange(e.target.value);
    // Clear custom when preset selected
    if (e.target.value) {
      onCustomDistanceChange('', '');
      setCustomValue('');
    }
  };

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);
    // Clear preset when custom entered
    if (value) {
      onDistanceChange('');
      setShowUnitPopup(true);
    } else {
      setShowUnitPopup(false);
      onCustomDistanceChange('', '');
    }
  };

  const handleUnitSelect = (unit: string) => {
    onCustomDistanceChange(customValue, unit);
    setShowUnitPopup(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Preset Distance */}
      <div>
        <label className="block text-sm font-medium mb-2">Distance</label>
        <div className="relative">
          <select
            name="distance"
            value={formData.distance}
            onChange={handlePresetChange}
            disabled={!!customValue}
            className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent appearance-none bg-white transition-all ${
              customValue ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
            }`}
          >
            <option value="">Select Distance</option>
            <option value="3">3 KM</option>
            <option value="5">5 KM</option>
            <option value="10">10 KM</option>
            <option value="21.0975">21 KM (Half Marathon)</option>
            <option value="42.195">42 KM (Marathon)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {customValue && (
          <p className="text-xs text-gray-500 mt-1">Clear custom distance to select preset</p>
        )}
      </div>

      {/* Custom Distance */}
      <div className="relative">
        <label className="block text-sm font-medium mb-2">Custom Distance</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={customValue}
          onChange={handleCustomValueChange}
          disabled={!!formData.distance}
          placeholder="Enter distance"
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent transition-all ${
            formData.distance ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
          }`}
        />
        {formData.distance && (
          <p className="text-xs text-gray-500 mt-1">Clear preset distance to enter custom</p>
        )}
        
        {/* Unit Selection Popup */}
        {showUnitPopup && customValue && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <div className="p-2">
              <p className="text-sm font-medium text-gray-700 mb-2 px-2">Select Unit:</p>
              <button
                type="button"
                onClick={() => handleUnitSelect('km')}
                className="w-full text-left px-4 py-2 hover:bg-[#fc4c02] hover:text-white rounded transition-colors"
              >
                Kilometers (km)
              </button>
              <button
                type="button"
                onClick={() => handleUnitSelect('miles')}
                className="w-full text-left px-4 py-2 hover:bg-[#fc4c02] hover:text-white rounded transition-colors"
              >
                Miles (mi)
              </button>
            </div>
          </div>
        )}
        
        {/* Selected Unit Display */}
        {formData.customDistanceUnit && customValue && (
          <div className="mt-2 text-sm text-[#fc4c02] font-medium">
            {customValue} {formData.customDistanceUnit === 'km' ? 'Kilometers' : 'Miles'}
          </div>
        )}
      </div>
    </div>
  );
}
