import { Trophy } from 'lucide-react';

interface Achievement {
  distance: number;
  time: string;
  pace: string;
  raceName: string;
}

interface BestEffortsDesktopProps {
  achievements: Achievement[];
  userName: string;
}

export default function BestEffortsDesktop({ achievements, userName }: BestEffortsDesktopProps) {
  return (
    <div>
      <h2 className="text-3xl lg:text-4xl font-semibold mb-6">
        Your <span className="text-[#fc4c02]">Best Efforts</span>
      </h2>

      <div className="bg-white border border-[#fc4c02]/31 rounded-3xl shadow-sm p-6 lg:p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">Way to go {userName}!</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
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
