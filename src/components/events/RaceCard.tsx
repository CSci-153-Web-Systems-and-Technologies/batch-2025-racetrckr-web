'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase';
import { Toast } from '@/components/ui/toast';

interface RaceCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  distances: string[];
}

export default function RaceCard({ id, title, description, imageUrl, distances }: RaceCardProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [showDistanceModal, setShowDistanceModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleRegister = async (distance: string) => {
    try {
      setIsRegistering(true);
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setToast({ message: 'Please login to register for events', type: 'error' });
        return;
      }

      // Check if already registered
      const { data: existing } = await supabase
        .from('user_events')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', id)
        .single();

      if (existing) {
        setToast({ message: 'You are already registered for this event!', type: 'info' });
        return;
      }

      // Register for event
      const { error } = await supabase
        .from('user_events')
        .insert([
          {
            user_id: user.id,
            event_id: id,
            registered_distance: distance,
            registration_status: 'registered'
          }
        ]);

      if (error) {
        console.error('Error registering for event:', error);
        setToast({ message: 'Failed to register. Please try again.', type: 'error' });
        return;
      }

      setToast({ message: `Successfully registered for ${distance}!`, type: 'success' });
      setShowDistanceModal(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      setToast({ message: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRegisterClick = () => {
    if (distances.length === 1) {
      handleRegister(distances[0]);
    } else {
      setShowDistanceModal(true);
    }
  };
  return (
    <>
      <div className="bg-white rounded-lg border border-[#fc4c02]/31 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4 pb-3">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-gray-500 text-sm mb-3">{description}</p>
        </div>
        
        <div className="px-4 pb-4">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-md mb-4">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2 flex-wrap">
              {distances.map((distance) => (
                <span
                  key={distance}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {distance}
                </span>
              ))}
            </div>
            <Button 
              onClick={handleRegisterClick}
              disabled={isRegistering}
              className="bg-[#fc4c02] hover:bg-[#fc4c02]/90 text-white whitespace-nowrap"
            >
              {isRegistering ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </div>
      </div>

      {/* Distance Selection Modal */}
      {showDistanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Select Distance</h3>
            <p className="text-gray-600 mb-4">Choose the distance you want to register for:</p>
            <div className="space-y-2">
              {distances.map((distance) => (
                <button
                  key={distance}
                  onClick={() => handleRegister(distance)}
                  disabled={isRegistering}
                  className="w-full p-3 border border-gray-300 rounded-lg hover:border-[#fc4c02] hover:bg-orange-50 transition-colors text-left font-medium disabled:opacity-50"
                >
                  {distance}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowDistanceModal(false)}
              className="mt-4 w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
