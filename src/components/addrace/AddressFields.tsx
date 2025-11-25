interface AddressFieldsProps {
  formData: {
    region: string;
    province: string;
    cityMunicipality: string;
    baranggay: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function AddressFields({ formData, handleInputChange }: AddressFieldsProps) {
  return (
    <>
      {/* Row 2: Region and Province */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent appearance-none bg-white"
          >
            <option value="">Select Region</option>
            <option value="region1">Region 1</option>
            <option value="region2">Region 2</option>
            <option value="region3">Region 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Province</label>
          <select
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent appearance-none bg-white"
          >
            <option value="">Select Province</option>
            <option value="province1">Province 1</option>
            <option value="province2">Province 2</option>
            <option value="province3">Province 3</option>
          </select>
        </div>
      </div>

      {/* Row 3: City/Municipality and Baranggay */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">City / Municipality</label>
          <select
            name="cityMunicipality"
            value={formData.cityMunicipality}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent appearance-none bg-white"
          >
            <option value="">Select City / Municipality</option>
            <option value="city1">City 1</option>
            <option value="city2">City 2</option>
            <option value="city3">City 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Baranggay <span className="text-gray-400">( Optional )</span>
          </label>
          <select
            name="baranggay"
            value={formData.baranggay}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent appearance-none bg-white"
          >
            <option value="">Select Baranggay</option>
            <option value="baranggay1">Baranggay 1</option>
            <option value="baranggay2">Baranggay 2</option>
            <option value="baranggay3">Baranggay 3</option>
          </select>
        </div>
      </div>
    </>
  );
}
