'use client';

import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddEventModal from './AddEventModal';
import MyRacesModal from './MyRacesModal';

interface ActionButtonsProps {
  onEventAdded?: () => void;
}

export default function ActionButtons({ onEventAdded }: ActionButtonsProps) {
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isMyRacesModalOpen, setIsMyRacesModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3 w-full lg:w-auto flex-shrink-0">
        <Button
          variant="outline"
          className="flex-1 lg:flex-none border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors"
          onClick={() => setIsMyRacesModalOpen(true)}
        >
          <Calendar className="w-4 h-4 mr-2" />
          My Races
        </Button>
        <Button 
          className="flex-1 lg:flex-none bg-[#fc4c02] hover:bg-[#fc4c02]/90 text-white shadow-sm"
          onClick={() => setIsAddEventModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>
      
      <AddEventModal 
        isOpen={isAddEventModalOpen} 
        onClose={() => setIsAddEventModalOpen(false)}
        onEventAdded={onEventAdded}
      />
      
      <MyRacesModal 
        isOpen={isMyRacesModalOpen} 
        onClose={() => setIsMyRacesModalOpen(false)} 
      />
    </>
  );
}
