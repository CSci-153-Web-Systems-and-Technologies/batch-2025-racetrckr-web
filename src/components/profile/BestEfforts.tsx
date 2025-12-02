import { Trophy, Share2 } from "lucide-react";

interface BestEffort {
  distance: string;
  unit: string;
  time: string;
  pace: string;
  race: string;
  date: string;
  hasMedal: boolean;
}

interface BestEffortsProps {
  efforts: BestEffort[];
}

export default function BestEfforts({ efforts }: BestEffortsProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#fc4c02]/31 shadow-sm p-8 relative">
      {/* Share Icon */}
      <div className="absolute top-6 right-6">
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-8">Your Best Efforts</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
        {efforts.map((effort, index) => (
          <div key={index} className="text-center">
            {/* Medal Icon */}
            {effort.hasMedal && (
              <Trophy className="w-6 h-6 mx-auto mb-2 text-[#fc4c02]" />
            )}
            
            {/* Distance */}
            <div className="mb-2">
              <span className="text-4xl font-bold">{effort.distance}</span>
              {effort.unit && (
                <span className={`${effort.unit === "Marathon" || effort.unit === "KM" ? "text-[#fc4c02]" : ""} text-sm ml-1 font-semibold`}>
                  {effort.unit}
                </span>
              )}
            </div>

            {/* Time */}
            <div className="text-lg font-semibold mb-1">{effort.time}</div>

            {/* Pace */}
            <div className="text-xs text-gray-500 mb-1">{effort.pace}</div>

            {/* Race Info */}
            {effort.race && (
              <>
                <div className="text-xs text-gray-400">{effort.race}</div>
                <div className="text-xs text-gray-400">{effort.date}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
