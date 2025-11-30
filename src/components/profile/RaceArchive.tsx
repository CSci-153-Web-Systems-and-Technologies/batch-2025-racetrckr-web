import ProfileRaceCard from "./ProfileRaceCard";

interface Race {
  id: number;
  title: string;
  imageUrl: string;
  distance: string;
}

interface RaceArchiveProps {
  races: Race[];
}

export default function RaceArchive({ races }: RaceArchiveProps) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-6">Race Archive</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {races.map((race) => (
          <ProfileRaceCard
            key={race.id}
            title={race.title}
            imageUrl={race.imageUrl}
            distance={race.distance}
          />
        ))}
      </div>
    </div>
  );
}
