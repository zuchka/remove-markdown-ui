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
        variant="outline"
        className={cn(
          "border-3 border-black shadow-[4px_4px_0px_0px_black]",
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_black]",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
          "transition-all bg-yellow-100 hover:bg-yellow-200 font-bold"
        )}
      >
        <ArrowLeftRight className="w-4 h-4 mr-2" />
        Compare These
      </Button>
    </div>
  );
}
