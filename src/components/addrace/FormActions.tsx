import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  handleReset: () => void;
  isSubmitting?: boolean;
}

export default function FormActions({ handleReset, isSubmitting = false }: FormActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <Button
        type="button"
        onClick={handleReset}
        variant="outline"
        className="w-full py-3 bg-gray-400 hover:bg-gray-500 text-white border-0"
        disabled={isSubmitting}
      >
        Reset
      </Button>
      <Button
        type="submit"
        className="w-full py-3 bg-black hover:bg-gray-800 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </div>
  );
}
