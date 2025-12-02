import Image from "next/image";

interface ProfileRaceCardProps {
  title: string;
  imageUrl: string;
  distance: string;
}

export default function ProfileRaceCard({ title, imageUrl, distance }: ProfileRaceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#fc4c02]/31 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-1">{title}</h3>
        <p className="text-xs text-[#fc4c02] font-medium mb-3">{distance}</p>
        
        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
