import Image from "next/image";

interface ProfileRaceCardProps {
  title: string;
  imageUrl: string;
}

export default function ProfileRaceCard({ title, imageUrl }: ProfileRaceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-3">{title}</h3>
        
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
