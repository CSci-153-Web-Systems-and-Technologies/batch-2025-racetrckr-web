'use client';

import { useState } from 'react';
import { X, Calendar, MapPin, Users, ExternalLink, Check } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { Toast } from '@/components/ui/toast';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    description: string;
    cover_image_url: string | null;
    event_date: string;
    city_municipality: string;
    province: string;
    available_distances: string[];
    organizer: string;
    registration_url: string;
  };
}

export default function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  const [showDistanceModal, setShowDistanceModal] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  if (!isOpen) return null;

  const handleRegistration = () => {
    if (event.registration_url) {
      window.open(event.registration_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMarkAsAttending = () => {
    if (event.available_distances.length === 1) {
      markAttending(event.available_distances[0]);
    } else {
      setShowDistanceModal(true);
    }
  };

  const markAttending = async (distance: string) => {
    try {
      setIsMarking(true);
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setToast({ message: 'Please login to mark as attending', type: 'error' });
        return;
      }

      // Check if already marked as attending
      const { data: existing } = await supabase
        .from('user_events')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', event.id)
        .single();

      if (existing) {
        setToast({ message: 'You are already marked as attending this event!', type: 'info' });
        setShowDistanceModal(false);
        return;
      }

      // Mark as attending
      const { error } = await supabase
        .from('user_events')
        .insert([
          {
            user_id: user.id,
            event_id: event.id,
            registered_distance: distance,
            registration_status: 'registered'
          }
        ]);

      if (error) {
        console.error('Error marking as attending:', error);
        setToast({ message: 'Failed to mark as attending. Please try again.', type: 'error' });
        return;
      }

      setToast({ message: `Successfully marked as attending for ${distance}!`, type: 'success' });
      setShowDistanceModal(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      setToast({ message: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsMarking(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Cover Image */}
          {event.cover_image_url ? (
            <div className="relative w-full h-64 bg-gray-200">
              <Image
                src={event.cover_image_url}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : (
            <div className="relative w-full h-64 bg-gradient-to-br from-[#fc4c02] to-orange-600 flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="RaceTrckr Logo"
                width={80}
                height={80}
                className="opacity-20"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h2>

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Calendar className="w-5 h-5 text-[#fc4c02]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Date</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {formatDate(event.event_date)}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-50">
                  <MapPin className="w-5 h-5 text-[#fc4c02]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Location</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {event.city_municipality}, {event.province}
                  </p>
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Users className="w-5 h-5 text-[#fc4c02]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Organizer</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {event.organizer}
                  </p>
                </div>
              </div>
            </div>

            {/* Available Distances */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Available Distances</h3>
              <div className="flex flex-wrap gap-2">
                {event.available_distances.map((distance) => (
                  <span
                    key={distance}
                    className="px-4 py-2 bg-orange-50 text-[#fc4c02] rounded-full text-sm font-medium"
                  >
                    {distance}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">About This Event</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 items-center justify-center">
              {/* Mark as Attending Button */}
              <button
                onClick={handleMarkAsAttending}
                disabled={isMarking}
                className="px-4 py-2 rounded-lg text-sm font-medium border-2 border-gray-300 text-gray-700 hover:border-[#fc4c02] hover:text-[#fc4c02] hover:bg-orange-50 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMarking ? (
                  'Marking...'
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Mark as Attending
                  </>
                )}
              </button>

              {/* Registration Button */}
              <button
                onClick={handleRegistration}
                disabled={!event.registration_url}
                className={`px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  event.registration_url
                    ? 'bg-[#fc4c02] text-white hover:bg-orange-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {event.registration_url ? (
                  <>
                    Register Now
                    <ExternalLink className="w-4 h-4" />
                  </>
                ) : (
                  'Registration Not Available'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Distance Selection Modal */}
      {showDistanceModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Select Distance</h3>
            <p className="text-gray-600 mb-4">Choose the distance you want to attend:</p>
            <div className="space-y-2">
              {event.available_distances.map((distance) => (
                <button
                  key={distance}
                  onClick={() => markAttending(distance)}
                  disabled={isMarking}
                  className="w-full p-3 border border-gray-300 rounded-lg hover:border-[#fc4c02] hover:bg-orange-50 transition-colors text-left font-medium disabled:opacity-50"
                >
                  {distance}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowDistanceModal(false)}
              disabled={isMarking}
              className="mt-4 w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
