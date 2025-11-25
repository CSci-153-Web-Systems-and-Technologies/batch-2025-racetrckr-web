export default function CoverPhotoField() {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Pick Cover Photo</label>
      <input
        type="file"
        accept="image/*"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
      />
    </div>
  );
}
