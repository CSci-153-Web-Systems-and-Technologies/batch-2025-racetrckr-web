import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ActionButtons() {
  return (
    <div className="flex gap-3 w-full lg:w-auto flex-shrink-0">
      <Button
        variant="outline"
        className="flex-1 lg:flex-none border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors"
      >
        <Calendar className="w-4 h-4 mr-2" />
        My Races
      </Button>
      <Button className="flex-1 lg:flex-none bg-[#fc4c02] hover:bg-[#fc4c02]/90 text-white shadow-sm">
        <Plus className="w-4 h-4 mr-2" />
        Add Race
      </Button>
    </div>
  );
}
