import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  handleReset: () => void;
  isSubmitting?: boolean;
}

export default function FormActions({ handleReset, isSubmitting = false }: FormActionsProps) {
  return (
    <div className="flex gap-4 pt-4">
      <Button
        type="button"
        onClick={handleReset}
        variant="outline"
        className="flex-1"
        disabled={isSubmitting}
      >
        Reset
      </Button>
      <Button
        type="submit"
        className="flex-1 bg-[#fc4c02] hover:bg-[#e64402]"
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
