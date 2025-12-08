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

      <div className="bg-white border border-[#fc4c02]/31 rounded-3xl shadow-lg p-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:md:col-span-1">
          {achievements.map((achievement, index) => {
            const hasData = achievement.time && achievement.time !== '--:--:--';
            
            return (
              <div key={index} className="text-center">
                <Trophy className={`w-6 h-6 mx-auto mb-2 ${hasData ? 'text-[#fc4c02]' : 'text-gray-300'}`} />
                <div className={`text-[40px] leading-none mb-2 ${hasData ? '' : 'text-gray-300'}`}>
                  {achievement.distance}<span className={hasData ? 'text-[#fc4c02]' : 'text-gray-300'}>KM</span>
                </div>
                <div className={`text-[20px] mb-1 ${hasData ? '' : 'text-gray-300'}`}>
                  {achievement.time}
                </div>
                <div className={`text-[12px] mb-1 ${hasData ? 'text-gray-400' : 'text-gray-300'}`}>
                  {achievement.pace}
                </div>
                {hasData && achievement.raceName && (
                  <div className="text-gray-400 text-[11px]">{achievement.raceName}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
