'use client';

import { X, Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import Image from 'next/image';

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
  if (!isOpen) return null;

  const handleRegistration = () => {
    if (event.registration_url) {
      window.open(event.registration_url, '_blank', 'noopener,noreferrer');
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

            {/* Registration Button */}
            <button
              onClick={handleRegistration}
              disabled={!event.registration_url}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                event.registration_url
                  ? 'bg-[#fc4c02] hover:bg-orange-600 hover:shadow-lg hover:scale-[1.02]'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {event.registration_url ? (
                <>
                  Register Now
                  <ExternalLink className="w-5 h-5" />
                </>
              ) : (
                'Registration Not Available'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
