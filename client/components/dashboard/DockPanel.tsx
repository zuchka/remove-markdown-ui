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

// Color mapping for different card types with gradients
const cardColors: Record<CardType, string> = {
  'input': 'bg-gradient-to-r from-blue-400 to-blue-500',
  'output': 'bg-gradient-to-r from-green-400 to-green-500',
  'test-cases': 'bg-gradient-to-r from-yellow-400 to-yellow-500',
  'cheat-sheet': 'bg-gradient-to-r from-purple-400 to-purple-500',
  'ast': 'bg-gradient-to-r from-pink-400 to-pink-500',
  'settings': 'bg-gradient-to-r from-orange-400 to-orange-500',
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
      "glass-surface-elevated backdrop-blur-lg border border-glass-border shadow-glass p-2 rounded-glass",
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
                "flex items-center gap-2 px-3 py-2 rounded-lg glass-surface backdrop-blur-sm",
                "border border-glass-border shadow-soft",
                "hover:-translate-y-0.5 hover:shadow-glass hover:border-glass-border-strong",
                "active:scale-[0.98] active:translate-y-0",
                "transition-all duration-300 text-left",
                isHorizontal ? "min-w-[120px]" : "w-full"
              )}
              title={`Restore ${item.title}`}
            >
              <div className={cn(
                "w-2 h-2 rounded-full shadow-soft flex-shrink-0",
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
