'use client';

import { Calendar } from 'lucide-react';

interface NameDateFieldsProps {
  formData: {
    name: string;
    date: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NameDateFields({ formData, handleInputChange }: NameDateFieldsProps) {
  const handleCalendarClick = () => {
    const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker?.();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Evil Rabbit"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Date</label>
        <div className="relative">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            placeholder="Pick a date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent cursor-pointer"
          />
          <Calendar 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#fc4c02] w-5 h-5 cursor-pointer" 
            onClick={handleCalendarClick}
          />
        </div>
      </div>
    </div>
  );
}
