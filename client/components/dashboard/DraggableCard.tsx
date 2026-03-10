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

// Color mapping for different card types with glassmorphism
const cardColors: Record<CardType, { border: string; bg: string; accent: string }> = {
  'input': {
    border: 'border-l-4 border-l-blue-400/40',
    bg: 'glass-surface-elevated backdrop-blur-lg',
    accent: 'bg-gradient-to-r from-blue-400 to-blue-500'
  },
  'output': {
    border: 'border-l-4 border-l-green-400/40',
    bg: 'glass-surface-elevated backdrop-blur-lg',
    accent: 'bg-gradient-to-r from-green-400 to-green-500'
  },
  'test-cases': {
    border: 'border-l-4 border-l-yellow-400/40',
    bg: 'glass-surface-elevated backdrop-blur-lg',
    accent: 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  },
  'cheat-sheet': {
    border: 'border-l-4 border-l-purple-400/40',
    bg: 'glass-surface-elevated backdrop-blur-lg',
    accent: 'bg-gradient-to-r from-purple-400 to-purple-500'
  },
  'ast': {
    border: 'border-l-4 border-l-pink-400/40',
    bg: 'glass-surface-elevated backdrop-blur-lg',
    accent: 'bg-gradient-to-r from-pink-400 to-pink-500'
  },
  'settings': {
    border: 'border-l-4 border-l-orange-400/40',
    bg: 'glass-surface-elevated backdrop-blur-lg',
    accent: 'bg-gradient-to-r from-orange-400 to-orange-500'
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
        "glass-card overflow-hidden flex flex-col h-full transition-all duration-300",
        colors.border,
        isDragging && "opacity-50 scale-95",
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "border-b border-glass-border px-4 py-3 cursor-move select-none",
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
