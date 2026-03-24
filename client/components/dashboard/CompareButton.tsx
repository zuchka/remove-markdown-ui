import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CompareButtonProps {
  onCompare: () => void;
  className?: string;
}

export function CompareButton({ onCompare, className }: CompareButtonProps) {
  return (
    <div className={cn("flex items-center justify-center py-2", className)}>
      <Button
        onClick={onCompare}
        size="sm"
        variant="default"
        className="shadow-glow"
      >
        <ArrowLeftRight className="w-4 h-4 mr-2" />
        Compare These
      </Button>
    </div>
  );
}
