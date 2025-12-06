'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import EventDetailsModal from './EventDetailsModal';

interface RaceCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  distances: string[];
  date: string;
  location: string;
  organizer: string;
  registrationUrl: string;
}

export default function RaceCard({ 
  id, 
  title, 
  description, 
  imageUrl, 
  distances, 
  date, 
  location, 
  organizer, 
  registrationUrl 
}: RaceCardProps) {
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Show only first 3 distances with "+X more" indicator
  const displayDistances = distances.slice(0, 3);
  const remainingCount = distances.length - 3;

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:border-[#fc4c02]/50 flex flex-col h-full">
        {/* Image */}
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

          {/* Description with line clamp */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

          {/* Event Info */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-[#fc4c02]" />
              <span>{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-[#fc4c02]" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-[#fc4c02]" />
              <span>{organizer}</span>
            </div>
          </div>

          {/* Distances */}
          <div className="flex gap-2 flex-wrap mb-4">
            {displayDistances.map((distance) => (
              <span
                key={distance}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {distance}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                +{remainingCount} more
              </span>
            )}
          </div>

          {/* View Details Button - pushed to bottom */}
          <div className="mt-auto">
            <Button
              onClick={() => setShowModal(true)}
              className="w-full bg-[#fc4c02] hover:bg-orange-600 text-white"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        event={{
          id,
          title,
          description,
          cover_image_url: imageUrl,
          event_date: date,
          city_municipality: location.split(',')[0].trim(),
          province: location.split(',')[1]?.trim() || location,
          available_distances: distances,
          organizer,
          registration_url: registrationUrl,
        }}
      />
    </>
  );
}
