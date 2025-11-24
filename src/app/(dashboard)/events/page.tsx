'use client';

import { useState } from 'react';
import EventsHero from '@/components/events/EventsHero';
import SearchBar from '@/components/events/SearchBar';
import ActionButtons from '@/components/events/ActionButtons';
import DistanceFilters from '@/components/events/DistanceFilters';
import RacesGrid from '@/components/events/RacesGrid';

const distanceFilters = ['Marathon', 'Half Marathon', '10km', '5km', '3km'];

const mockRaces = [
  {
    id: 1,
    title: 'Maasin Marathon',
    description: 'This is a card with an image.',
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80',
    distances: ['42km', '21km', '10km'],
  },
  {
    id: 2,
    title: 'Ormoc City Ultra Marathon',
    description: 'This is a card with an image.',
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
    distances: ['52km', '25km', '16km'],
  },
  {
    id: 3,
    title: 'Macrohon Half Marathon',
    description: 'This is a card with an image.',
    imageUrl: 'https://images.unsplash.com/photo-1565411642431-7e2c99f2d686?w=800&q=80',
    distances: ['42km', '21km', '10km'],
  },
  {
    id: 4,
    title: 'Cebu City Marathon',
    description: 'This is a card with an image.',
    imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
    distances: ['42km', '21km', '10km', '5km'],
  },
  {
    id: 5,
    title: 'Manila Bay Run',
    description: 'This is a card with an image.',
    imageUrl: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800&q=80',
    distances: ['21km', '10km', '5km'],
  },
  {
    id: 6,
    title: 'Davao Mountain Trail',
    description: 'This is a card with an image.',
    imageUrl: 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=800&q=80',
    distances: ['30km', '15km', '8km'],
  },
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <EventsHero />

      {/* Search and Filters Section */}
      <div className="bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Row: Search and Actions */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search Bar */}
            <div className="flex-1">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>

            {/* Action Buttons */}
            <ActionButtons />
          </div>

          {/* Bottom Row: Distance Filters */}
          <DistanceFilters
            filters={distanceFilters}
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
          />
        </div>
      </div>

      {/* Races Grid */}
      <RacesGrid races={mockRaces} />
    </div>
  );
}
