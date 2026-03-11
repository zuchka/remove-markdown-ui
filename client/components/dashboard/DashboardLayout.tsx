import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardConfig {
  id: string;
  type: 'input' | 'output';
  title: string;
  content: ReactNode;
  headerActions?: ReactNode;
}

interface DashboardLayoutProps {
  cards: CardConfig[];
  className?: string;
}

export function DashboardLayout({
  cards,
  className
}: DashboardLayoutProps) {
  // Separate input and output cards
  const inputCard = cards.find(card => card.type === 'input');
  const outputCards = cards.filter(card => card.type === 'output');

  return (
    <div className={cn("space-y-6", className)}>
      {/* Input Card - Full Width */}
      {inputCard && (
        <div className="w-full">
          {inputCard.content}
        </div>
      )}

      {/* Output Cards - Responsive Grid */}
      {outputCards.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {outputCards.map(card => (
            <div key={card.id}>
              {card.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
