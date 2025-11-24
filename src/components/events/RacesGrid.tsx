import RaceCard from './RaceCard';

interface Race {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  distances: string[];
}

interface RacesGridProps {
  races: Race[];
}

export default function RacesGrid({ races }: RacesGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-6">Near Your Place</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {races.map((race) => (
            <RaceCard
              key={race.id}
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
      </div>
    </div>
  );
}
