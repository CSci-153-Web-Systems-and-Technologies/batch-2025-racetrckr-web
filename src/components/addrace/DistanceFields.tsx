interface DistanceFieldsProps {
  formData: {
    distance: string;
    customDistance: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function DistanceFields({ formData, handleInputChange }: DistanceFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-2">Distance</label>
        <select
          name="distance"
          value={formData.distance}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent appearance-none bg-white"
        >
          <option value="">Select Distance</option>
          <option value="3km">3 KM</option>
          <option value="5km">5 KM</option>
          <option value="10km">10 KM</option>
          <option value="21km">21 KM (Half Marathon)</option>
          <option value="42km">42 KM (Marathon)</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Custom Distance</label>
        <select
          name="customDistance"
          value={formData.customDistance}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent appearance-none bg-white"
        >
          <option value="">Select Unit</option>
          <option value="km">Kilometers</option>
          <option value="miles">Miles</option>
        </select>
      </div>
    </div>
  );
}
