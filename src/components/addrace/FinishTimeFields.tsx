interface FinishTimeFieldsProps {
  formData: {
    hours: string;
    minutes: string;
    seconds: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FinishTimeFields({ formData, handleInputChange }: FinishTimeFieldsProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-center">Finish Time</label>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent text-center"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent text-center"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent text-center"
          />
        </div>
      </div>
    </div>
  );
}
