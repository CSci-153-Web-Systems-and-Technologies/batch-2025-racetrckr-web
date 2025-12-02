import { Button } from '@/components/ui/button';

interface RaceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  distances: string[];
}

export default function RaceCard({ title, description, imageUrl, distances }: RaceCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#fc4c02]/31 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4 pb-3">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-3">{description}</p>
      </div>
      
      <div className="px-4 pb-4">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-md mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {distances.map((distance) => (
              <span
                key={distance}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {distance}
              </span>
            ))}
          </div>
          <Button className="bg-[#fc4c02] hover:bg-[#fc4c02]/90 text-white whitespace-nowrap">
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
