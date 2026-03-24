import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CardType = 'input' | 'output';

interface CardProps {
  id: string;
  type: CardType;
  title: string;
  children: ReactNode;
  headerActions?: ReactNode;
  className?: string;
}

// Color mapping for different card types with glassmorphism
const cardColors: Record<CardType, { border: string; bg: string }> = {
  'input': {
    border: 'border-l-4 border-l-blue-400/40',
    bg: 'glass-surface-elevated backdrop-blur-lg',
  },
  'output': {
    border: 'border-l-4 border-l-green-400/40',
    bg: 'glass-surface-elevated backdrop-blur-lg',
  },
};

export function Card({
  id,
  type,
  title,
  children,
  headerActions,
  className,
}: CardProps) {
  const colors = cardColors[type];

  return (
    <div
      className={cn(
        "glass-card overflow-hidden flex flex-col",
        type === 'input' ? 'min-h-[500px] h-[500px]' : 'min-h-[350px]',
        colors.border,
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "border-b border-glass-border px-4 py-3",
        colors.bg
      )}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">
            {title}
          </span>

          {/* Actions */}
          {headerActions && (
            <div className="flex items-center gap-1">
              {headerActions}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

// Export as DraggableCard for backward compatibility
export { Card as DraggableCard };
