'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import EventsHero from '@/components/events/EventsHero';
import SearchBar from '@/components/events/SearchBar';
import ActionButtons from '@/components/events/ActionButtons';
import DistanceFilters from '@/components/events/DistanceFilters';
import RacesGrid from '@/components/events/RacesGrid';

const distanceFilters = ['Marathon', '½ Marathon', '10km', '5km', '3km'];

interface Event {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  event_date: string;
  city_municipality: string;
  province: string;
  available_distances: string[];
  registration_url: string;
  organizer: string;
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  // Fetch events from database
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        // Fetch active events ordered by date
        const { data, error: fetchError } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true });

        if (fetchError) {
          console.error('Error fetching events:', fetchError);
          setError('Failed to load events. Please try again later.');
          setEvents([]);
        } else {
          setEvents(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Filter events based on search query and selected distance filters
  const filteredEvents = events.filter((event) => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city_municipality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.province.toLowerCase().includes(searchQuery.toLowerCase());

    // Distance filter
    const matchesDistance = selectedFilters.length === 0 ||
      selectedFilters.some((filter) => {
        switch (filter) {
          case 'Marathon':
            return event.available_distances.some((d) => d.includes('42') || d.toLowerCase().includes('marathon'));
          case '½ Marathon':
            return event.available_distances.some((d) => d.includes('21') || d.toLowerCase().includes('half'));
          case '10km':
            return event.available_distances.some((d) => d.includes('10'));
          case '5km':
            return event.available_distances.some((d) => d.includes('5'));
          case '3km':
            return event.available_distances.some((d) => d.includes('3'));
          default:
            return false;
        }
      });

    return matchesSearch && matchesDistance;
  });

  // Transform events to match RacesGrid expected format
  const racesData: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    distances: string[];
  }> = filteredEvents.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description || `${event.city_municipality}, ${event.province} • ${new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    imageUrl: event.cover_image_url || 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80',
    distances: event.available_distances,
  }));

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
      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg border border-[#fc4c02]/31 p-6">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#fc4c02]"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <RacesGrid 
          races={racesData} 
          isFiltering={searchQuery !== '' || selectedFilters.length > 0}
        />
      )}
    </div>
  );
}
