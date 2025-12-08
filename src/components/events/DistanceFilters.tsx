'use client';

interface DistanceFiltersProps {
  filters: string[];
  selectedFilters: string[];
  toggleFilter: (filter: string) => void;
}

export default function DistanceFilters({ filters, selectedFilters, toggleFilter }: DistanceFiltersProps) {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <span className="text-sm text-gray-500 font-medium mr-2">Filter by:</span>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => toggleFilter(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedFilters.includes(filter)
              ? 'bg-[#fc4c02] text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
