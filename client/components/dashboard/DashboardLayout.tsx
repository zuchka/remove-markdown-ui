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
    <div className={cn("space-y-10", className)}>
      {/* Input Section */}
      {inputCard && (
        <section className="w-full">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1.5 w-16 bg-gradient-primary rounded-full shadow-glow"></div>
            <h2 className="text-base font-bold text-foreground uppercase tracking-wide">Markdown Input</h2>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-blue-400/40">
            {inputCard.content}
          </div>
        </section>
      )}

      {/* Divider */}
      {inputCard && outputCards.length > 0 && (
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-glass-border"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="glass-surface-elevated backdrop-blur-md px-4 py-1 rounded-full border border-glass-border shadow-soft">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Outputs Below</span>
            </div>
          </div>
        </div>
      )}

      {/* Output Section */}
      {outputCards.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1.5 w-16 bg-gradient-primary rounded-full shadow-glow"></div>
            <h2 className="text-base font-bold text-foreground uppercase tracking-wide">Library Outputs</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {outputCards.map(card => (
              <div key={card.id}>
                {card.content}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
