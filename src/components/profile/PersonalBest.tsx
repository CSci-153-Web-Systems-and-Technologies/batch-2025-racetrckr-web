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

interface PersonalBestProps {
  efforts: BestEffort[];
}

export default function PersonalBest({ efforts }: PersonalBestProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#fc4c02]/31 shadow-sm p-8 relative mb-8">
      {/* Share Icon */}
      <div className="absolute top-6 right-6">
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-8">Personal Best</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:md:col-span-1">
        {efforts.map((effort, index) => (
          <div key={index} className="text-center">
            {/* Medal Icon */}
            {effort.hasMedal && (
              <Trophy className="w-6 h-6 mx-auto mb-2 text-[#fc4c02]" />
            )}
            
            {/* Distance */}
            <div className="text-[28px] md:text-[40px] leading-none mb-2">
              {effort.distance}
              {effort.unit && (
                <span className={`${effort.unit === "Marathon" || effort.unit === "KM" ? "text-[#fc4c02]" : ""}`}>
                  {effort.unit}
                </span>
              )}
            </div>

            {/* Time */}
            <div className="text-[20px] mb-1">{effort.time}</div>

            {/* Pace */}
            <div className="text-gray-400 text-[12px] mb-1">{effort.pace}</div>

            {/* Race Info */}
            {effort.race && (
              <>
                <div className="text-gray-400 text-[11px]">{effort.race}</div>
                <div className="text-gray-400 text-[11px]">{effort.date}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
