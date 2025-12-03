import Link from 'next/link';
import { Calendar } from 'lucide-react';

export default function EmptyNextRace() {
  return (
    <div className="mb-8">
      <h2 className="text-[32px] leading-tight mb-6">
        Your <span className="text-[#fc4c02]">Next Race</span>
      </h2>

      <div className="bg-white border border-[#fc4c02]/31 rounded-3xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#fc4c02]/10 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-[#fc4c02]" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Upcoming Races
        </h3>
        <p className="text-gray-600 mb-6">
          You don't have any races scheduled yet. Browse events to find your next challenge!
        </p>
        <Link
          href="/events"
          className="inline-block bg-[#fc4c02] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#fc4c02]/90 transition-colors"
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
}
