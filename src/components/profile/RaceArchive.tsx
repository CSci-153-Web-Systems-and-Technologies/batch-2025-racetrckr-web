'use client';

import { useState } from "react";
import Link from "next/link";
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import ProfileRaceCard from "./ProfileRaceCard";

interface Race {
  id: string;
  title: string;
  imageUrl: string;
  distance: string;
  time: string;
  pace: string;
}

interface RaceArchiveProps {
  races: Race[];
}

const RACES_PER_PAGE = 9;

export default function RaceArchive({ races }: RaceArchiveProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(races.length / RACES_PER_PAGE);
  const startIndex = (currentPage - 1) * RACES_PER_PAGE;
  const endIndex = startIndex + RACES_PER_PAGE;
  const currentRaces = races.slice(startIndex, endIndex);
  
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-6">Race Archive</h2>
      
      {races.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#fc4c02]/31 shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No races yet</h3>
            <p className="text-gray-600 mb-6">
              Start your racing journey by finding upcoming events or logging your personal races.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#fc4c02] text-white rounded-lg hover:bg-[#e64602] transition-colors font-medium"
              >
                <Calendar className="w-5 h-5" />
                Browse Events
              </Link>
              <Link
                href="/addrace"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#fc4c02] border-2 border-[#fc4c02] rounded-lg hover:bg-[#fc4c02]/5 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Log a Race
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentRaces.map((race) => (
              <ProfileRaceCard
                key={race.id}
                title={race.title}
                imageUrl={race.imageUrl}
                distance={race.distance}
                time={race.time}
                pace={race.pace}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#fc4c02] text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
