import { Edit, Share2 } from "lucide-react";
import Image from "next/image";

interface ProfileHeaderProps {
  name: string;
  location: string;
  bio: string;
  imageUrl: string;
  totalRaces: number;
  totalDistance: number;
  timeOnFeet: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export default function ProfileHeader({
  name,
  location,
  bio,
  imageUrl,
  totalRaces,
  totalDistance,
  timeOnFeet,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mb-8 relative">
      {/* Edit and Share Icons */}
      <div className="absolute top-6 right-6 flex gap-3">
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <Edit className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Profile Image and Info */}
        <div className="flex gap-6 items-center flex-1">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 flex-shrink-0 relative">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-[#fc4c02] mb-1">{name}</h1>
            <p className="text-gray-600 text-sm mb-0.5">{location}</p>
            <p className="text-gray-600 text-sm">{bio}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 md:gap-12">
          {/* Total Races */}
          <div className="text-center">
            <h3 className="text-sm text-gray-600 mb-2">Total Races</h3>
            <div className="text-5xl font-bold">{totalRaces}</div>
          </div>

          {/* Total Distance */}
          <div className="text-center">
            <h3 className="text-sm text-gray-600 mb-2">Total Distance</h3>
            <div className="flex items-end justify-center gap-1">
              <span className="text-5xl font-bold">{totalDistance}</span>
              <span className="text-[#fc4c02] font-semibold mb-1">KM</span>
            </div>
          </div>

          {/* Time on Feet */}
          <div className="text-center">
            <h3 className="text-sm text-gray-600 mb-2">Time on Feet</h3>
            <div className="space-y-0">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-[#fc4c02] text-2xl font-bold">{String(timeOnFeet.hours).padStart(2, '0')}</span>
                <span className="text-gray-500 text-xs">Hours</span>
              </div>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-[#fc4c02] text-2xl font-bold">{String(timeOnFeet.minutes).padStart(2, '0')}</span>
                <span className="text-gray-500 text-xs">Minutes</span>
              </div>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-[#fc4c02] text-2xl font-bold">{String(timeOnFeet.seconds).padStart(2, '0')}</span>
                <span className="text-gray-500 text-xs">Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
