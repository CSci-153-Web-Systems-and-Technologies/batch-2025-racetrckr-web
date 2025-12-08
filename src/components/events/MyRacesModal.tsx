'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import AttendingRaceCard from './AttendingRaceCard';
import { createClient } from '@/lib/supabase';

interface MyRacesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AttendingRace {
  id: string;
  title: string;
  location: string;
  date: Date;
  distance: string;
  imageUrl: string;
  registrationId: string;
}

const MyRacesModal = ({ isOpen, onClose }: MyRacesModalProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendingRaces, setAttendingRaces] = useState<AttendingRace[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMyRaces();
    }
  }, [isOpen]);

  const fetchMyRaces = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user's registered events
      const { data: userEvents, error: userEventsError } = await supabase
        .from('user_events')
        .select('id, event_id, registered_distance')
        .eq('user_id', user.id)
        .eq('registration_status', 'registered');

      if (userEventsError) {
        console.error('Error fetching user events:', userEventsError);
        return;
      }

      if (!userEvents || userEvents.length === 0) {
        setAttendingRaces([]);
        return;
      }

      // Get event IDs
      const eventIds = userEvents.map(ue => ue.event_id);

      // Fetch event details
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, title, event_date, city_municipality, province, cover_image_url')
        .in('id', eventIds);

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        return;
      }

      // Combine data
      const races: AttendingRace[] = userEvents
        .map(userEvent => {
          const event = events?.find(e => e.id === userEvent.event_id);
          if (!event) return null;

          return {
            id: event.id,
            registrationId: userEvent.id,
            title: event.title,
            location: `${event.city_municipality}, ${event.province}`,
            date: new Date(event.event_date),
            distance: userEvent.registered_distance,
            imageUrl: event.cover_image_url || 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&h=300&fit=crop'
          };
        })
        .filter((race): race is AttendingRace => race !== null);

      setAttendingRaces(races);
    } catch (err) {
      console.error('Unexpected error fetching races:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRace = async (registrationId: string) => {
    try {
      const supabase = createClient();

      // Delete the registration
      const { error } = await supabase
        .from('user_events')
        .delete()
        .eq('id', registrationId);

      if (error) {
        console.error('Error removing race:', error);
        return;
      }

      // Update local state
      setAttendingRaces(prev => prev.filter(race => race.registrationId !== registrationId));
    } catch (err) {
      console.error('Unexpected error removing race:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white rounded-lg shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b bg-white px-6 py-4 flex-shrink-0">
          <h2 className="text-2xl font-bold">My Races</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold mb-4">Attending Races ({attendingRaces.length})</h3>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#fc4c02]"></div>
                <p className="mt-4 text-gray-600">Loading your races...</p>
              </div>
            ) : attendingRaces.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No races yet!</p>
                <p className="text-sm mt-2">Start attending races to see them here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attendingRaces.map((race) => (
                  <AttendingRaceCard
                    key={race.registrationId}
                    id={race.registrationId}
                    title={race.title}
                    location={race.location}
                    date={race.date}
                    distance={race.distance}
                    imageUrl={race.imageUrl}
                    onRemove={handleRemoveRace}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-80 border-l bg-gray-50 p-6 overflow-y-auto flex-shrink-0 hidden lg:block">
            <h3 className="text-lg font-semibold mb-4">Calendar</h3>
            
            <div className="bg-white rounded-lg border border-[#fc4c02]/31 p-4 shadow-sm overflow-hidden">
              <div className="scale-90 origin-top-left">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Races</h4>
              <div className="space-y-3">
                {attendingRaces
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((race) => (
                    <div key={race.id} className="border-l-4 border-[#fc4c02] pl-3 py-2 bg-white rounded-r-md shadow-sm">
                      <div className="text-sm font-medium">{race.title}</div>
                      <div className="text-xs text-gray-500">{race.location}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {race.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRacesModal;
