import Image from "next/image";
import { Timer, TrendingUp } from "lucide-react";

interface ProfileRaceCardProps {
  title: string;
  imageUrl: string;
  distance: string;
  time: string;
  pace: string;
}

export default function ProfileRaceCard({ title, imageUrl, distance, time, pace }: ProfileRaceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#fc4c02]/31 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-[#fc4c02] font-medium">{distance}</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Timer className="w-4 h-4 text-[#fc4c02]" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 text-[#fc4c02]" />
            <span>{pace}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
