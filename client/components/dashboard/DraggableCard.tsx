import { useState, ReactNode } from 'react';
import { GripVertical, Minimize2, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CardType = 'input' | 'output' | 'test-cases' | 'cheat-sheet' | 'ast' | 'settings';

interface DraggableCardProps {
  id: string;
  type: CardType;
  title: string;
  children: ReactNode;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  headerActions?: ReactNode;
  className?: string;
  accent?: string;
}

// Color mapping for different card types
const cardColors: Record<CardType, { border: string; bg: string; accent: string }> = {
  'input': { 
    border: 'border-l-blue-500', 
    bg: 'bg-blue-50', 
    accent: 'bg-blue-500' 
  },
  'output': { 
    border: 'border-l-green-500', 
    bg: 'bg-green-50', 
    accent: 'bg-green-500' 
  },
  'test-cases': { 
    border: 'border-l-yellow-500', 
    bg: 'bg-yellow-50', 
    accent: 'bg-yellow-500' 
  },
  'cheat-sheet': { 
    border: 'border-l-purple-500', 
    bg: 'bg-purple-50', 
    accent: 'bg-purple-500' 
  },
  'ast': { 
    border: 'border-l-pink-500', 
    bg: 'bg-pink-50', 
    accent: 'bg-pink-500' 
  },
  'settings': { 
    border: 'border-l-orange-500', 
    bg: 'bg-orange-50', 
    accent: 'bg-orange-500' 
  },
};

export function DraggableCard({
  id,
  type,
  title,
  children,
  isMinimized = false,
  onMinimize,
  onMaximize,
  onClose,
  headerActions,
  className,
}: DraggableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const colors = cardColors[type];

  return (
    <div
      className={cn(
        "bg-white rounded-md border-4 border-black shadow-[8px_8px_0px_0px_black] overflow-hidden flex flex-col h-full transition-all",
        "border-l-[6px]",
        colors.border,
        isDragging && "opacity-50",
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "border-b-4 border-black px-4 py-3 cursor-move select-none",
        colors.bg
      )}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Drag Handle */}
            <div className="flex items-center gap-1">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            
            {/* Title */}
            <span className="text-sm font-bold text-foreground">
              {title}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {headerActions}
            
            {onMinimize && !isMinimized && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMinimize}
                className="h-7 px-2"
                title="Minimize to dock"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </Button>
            )}
            
            {onMaximize && isMinimized && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMaximize}
                className="h-7 px-2"
                title="Restore"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
            )}
            
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-7 px-2 hover:bg-destructive/10"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      )}
    </div>
  );
}
