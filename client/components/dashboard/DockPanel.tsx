import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CardType } from './DraggableCard';

interface DockItem {
  id: string;
  type: CardType;
  title: string;
  icon?: ReactNode;
}

interface DockPanelProps {
  items: DockItem[];
  onRestore: (id: string) => void;
  position?: 'left' | 'right' | 'bottom';
  className?: string;
}

// Color mapping for different card types (same as DraggableCard)
const cardColors: Record<CardType, string> = {
  'input': 'bg-blue-500',
  'output': 'bg-green-500',
  'test-cases': 'bg-yellow-500',
  'cheat-sheet': 'bg-purple-500',
  'ast': 'bg-pink-500',
  'settings': 'bg-orange-500',
};

export function DockPanel({ 
  items, 
  onRestore, 
  position = 'right',
  className 
}: DockPanelProps) {
  if (items.length === 0) return null;

  const isHorizontal = position === 'bottom';
  
  return (
    <div className={cn(
      "bg-muted border-4 border-black shadow-[4px_4px_0px_0px_black] p-2",
      isHorizontal 
        ? "flex flex-row gap-2 overflow-x-auto" 
        : "flex flex-col gap-2 overflow-y-auto",
      className
    )}>
      {items.map((item) => {
        const colorClass = cardColors[item.type];
        
        return (
          <div
            key={item.id}
            className={cn(
              "relative group",
              isHorizontal ? "flex-shrink-0" : "w-full"
            )}
          >
            <button
              onClick={() => onRestore(item.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md border-3 border-black",
                "shadow-[3px_3px_0px_0px_black]",
                "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_black]",
                "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
                "transition-all bg-white text-left",
                isHorizontal ? "min-w-[120px]" : "w-full"
              )}
              title={`Restore ${item.title}`}
            >
              <div className={cn(
                "w-2 h-2 rounded-full border-2 border-black flex-shrink-0",
                colorClass
              )} />
              
              <span className="text-xs font-bold text-foreground truncate flex-1">
                {item.title}
              </span>
              
              <Maximize2 className="w-3 h-3 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
