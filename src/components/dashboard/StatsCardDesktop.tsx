interface StatsCardDesktopProps {
  totalRaces: number;
  totalDistance: number;
  timeOnFeet: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export default function StatsCardDesktop({ totalRaces, totalDistance, timeOnFeet }: StatsCardDesktopProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 lg:p-8">
      <div className="grid grid-cols-3 gap-6 lg:gap-8">
        {/* Total Races */}
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Total Races</h3>
          <div className="text-[80px] leading-none font-normal">{totalRaces}</div>
        </div>

        {/* Total Distance */}
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Total Distance</h3>
          <div className="text-[80px] leading-none font-normal">
            {totalDistance}<span className="text-[#fc4c02] text-[20px]">KM</span>
          </div>
        </div>

        {/* Time on Feet */}
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Time on Feet</h3>
          <div className="space-y-1">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-[#fc4c02] text-[40px] leading-none">
                {String(timeOnFeet.hours).padStart(2, '0')}
              </span>
              <span className="text-gray-500 text-[16px]">Hours</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-[#fc4c02] text-[40px] leading-none">
                {String(timeOnFeet.minutes).padStart(2, '0')}
              </span>
              <span className="text-gray-500 text-[16px]">Minutes</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-[#fc4c02] text-[40px] leading-none">
                {String(timeOnFeet.seconds).padStart(2, '0')}
              </span>
              <span className="text-gray-500 text-[16px]">Seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
