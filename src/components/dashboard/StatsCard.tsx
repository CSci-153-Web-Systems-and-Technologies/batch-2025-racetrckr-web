interface StatsCardProps {
  totalRaces: number;
  totalDistance: number;
  timeOnFeet: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export default function StatsCard({ totalRaces, totalDistance, timeOnFeet }: StatsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8 mb-8">
      {/* Total Races */}
      <div className="text-center pb-6 border-b border-gray-200">
        <h3 className="mb-2">Total Races</h3>
        <div className="text-[80px] leading-none">{totalRaces}</div>
      </div>

      {/* Total Distance */}
      <div className="text-center py-6 border-b border-gray-200">
        <h3 className="mb-2">Total Distance</h3>
        <div className="text-[80px] leading-none">
          {totalDistance}<span className="text-[#fc4c02] text-[20px]">KM</span>
        </div>
      </div>

      {/* Time on Feet */}
      <div className="text-center pt-6">
        <h3 className="mb-2">Time on Feet</h3>
        <div className="space-y-1">
          <div>
            <span className="text-[#fc4c02] text-[40px] leading-none">
              {String(timeOnFeet.hours).padStart(2, '0')}
            </span>
            <span className="text-gray-500 text-[16px] ml-2">Hours</span>
          </div>
          <div>
            <span className="text-[#fc4c02] text-[40px] leading-none">
              {String(timeOnFeet.minutes).padStart(2, '0')}
            </span>
            <span className="text-gray-500 text-[16px] ml-2">Minutes</span>
          </div>
          <div>
            <span className="text-[#fc4c02] text-[40px] leading-none">
              {String(timeOnFeet.seconds).padStart(2, '0')}
            </span>
            <span className="text-gray-500 text-[16px] ml-2">Seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
