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
    <div className={cn("space-y-5", className)}>
      {/* Input Section */}
      {inputCard && (
        <div className="glass-card p-5 border-l-4 border-l-blue-400/40">
          {inputCard.content}
        </div>
      )}

      {/* Output Section */}
      {outputCards.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-0.5 w-8 bg-gradient-primary rounded-full shadow-glow"></div>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Outputs</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {outputCards.map(card => (
              <div key={card.id}>
                {card.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
