import { Trophy } from 'lucide-react';

interface Achievement {
  distance: number;
  time: string;
  pace: string;
  raceName: string;
}

interface BestEffortsCardProps {
  achievements: Achievement[];
}

export default function BestEffortsCard({ achievements }: BestEffortsCardProps) {
  return (
    <div className="mb-8">
      <h2 className="text-[32px] leading-tight mb-6">
        Your <span className="text-[#fc4c02]">Best Efforts</span>
      </h2>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8">
        <div className="grid grid-cols-2 gap-6">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-[#fc4c02]" />
              <div className="text-[40px] leading-none mb-2">
                {achievement.distance}<span className="text-[#fc4c02]">KM</span>
              </div>
              <div className="text-[20px] mb-1">{achievement.time}</div>
              <div className="text-gray-400 text-[12px] mb-1">{achievement.pace}</div>
              <div className="text-gray-400 text-[11px]">{achievement.raceName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
