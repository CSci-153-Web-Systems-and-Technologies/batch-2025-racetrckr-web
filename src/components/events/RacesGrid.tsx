import RaceCard from './RaceCard';

interface Race {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  distances: string[];
}

interface RacesGridProps {
  races: Race[];
  isFiltering: boolean;
  onAddEvent?: () => void;
}

export default function RacesGrid({ races, isFiltering, onAddEvent }: RacesGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg border border-[#fc4c02]/31 p-6">
        <h2 className="text-2xl font-semibold mb-6">Near Your Place</h2>
        
        {races.length === 0 ? (
          isFiltering ? (
            // Empty state for search/filter with no results
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#fc4c02]/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-[#fc4c02]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Events Found
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any events matching your search criteria.
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or search terms to see more events.
              </p>
            </div>
          ) : (
            // Empty state for no events at all
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#fc4c02]/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-[#fc4c02]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Events Available Yet
              </h3>
              <p className="text-gray-600 mb-6">
                There are no upcoming events at the moment. Be the first to create one!
              </p>
              <button 
                onClick={onAddEvent}
                className="bg-[#fc4c02] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#fc4c02]/90 transition-colors"
              >
                Add New Event
              </button>
            </div>
          )
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {races.map((race) => (
                <RaceCard
                  key={race.id}
                  id={String(race.id)}
                  title={race.title}
                  description={race.description}
                  imageUrl={race.imageUrl}
                  distances={race.distances}
                />
              ))}
            </div>

            <div className="text-right">
              <button className="text-gray-600 hover:text-[#fc4c02] underline font-medium">
                See more...
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
