import { useState, useEffect, useCallback, ReactNode } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { DraggableCard, CardType } from './DraggableCard';
import { DockPanel } from './DockPanel';
import { cn } from '@/lib/utils';
import type { LayoutPresetType, CardState, DashboardLayout as DashboardLayoutType } from './types';
import { PRESET_LAYOUTS, GRID_CONFIG } from './types';

interface CardConfig {
  id: string;
  type: CardType;
  title: string;
  content: ReactNode;
  headerActions?: ReactNode;
}

interface DashboardLayoutProps {
  preset: LayoutPresetType;
  cards: CardConfig[];
  onLayoutChange?: (layout: DashboardLayoutType) => void;
  className?: string;
}

const STORAGE_KEY = 'markdown-playground-dashboard-layout';

export function DashboardLayout({
  preset,
  cards,
  onLayoutChange,
  className
}: DashboardLayoutProps) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [isMobile, setIsMobile] = useState(false);

  // Initialize card states
  useEffect(() => {
    const initialStates: Record<string, CardState> = {};
    cards.forEach(card => {
      initialStates[card.id] = {
        id: card.id,
        isMinimized: false,
        isVisible: true,
      };
    });
    setCardStates(initialStates);
  }, [cards]);

  // Load saved layout from localStorage or use preset
  useEffect(() => {
    const loadLayout = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && preset === 'custom') {
          const parsed = JSON.parse(saved) as DashboardLayoutType;
          setLayouts(parsed.layouts);
          setCardStates(parsed.cardStates);
        } else {
          // Use preset layout
          const presetLayout = PRESET_LAYOUTS[preset];
          if (presetLayout) {
            // Filter to only include cards that exist
            const validLayout = presetLayout.filter(l => 
              cards.some(c => c.id === l.i)
            );
            setLayouts(validLayout);
          }
        }
      } catch (error) {
        console.error('Failed to load layout:', error);
        // Fallback to preset
        const presetLayout = PRESET_LAYOUTS[preset];
        if (presetLayout) {
          const validLayout = presetLayout.filter(l => 
            cards.some(c => c.id === l.i)
          );
          setLayouts(validLayout);
        }
      }
    };

    loadLayout();
  }, [preset, cards]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle layout change
  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    setLayouts(newLayout);
    
    // Save to localStorage and notify parent
    const dashboardLayout: DashboardLayoutType = {
      preset: 'custom', // When layout changes manually, it becomes custom
      layouts: newLayout,
      cardStates,
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboardLayout));
      onLayoutChange?.(dashboardLayout);
    } catch (error) {
      console.error('Failed to save layout:', error);
    }
  }, [cardStates, onLayoutChange]);

  // Handle card minimize
  const handleMinimize = useCallback((cardId: string) => {
    setCardStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        isMinimized: true,
      }
    }));
  }, []);

  // Handle card restore
  const handleRestore = useCallback((cardId: string) => {
    setCardStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        isMinimized: false,
      }
    }));
  }, []);

  // Get minimized cards for dock
  const minimizedCards = cards.filter(card => 
    cardStates[card.id]?.isMinimized
  ).map(card => ({
    id: card.id,
    type: card.type,
    title: card.title,
  }));

  // Get visible cards for grid
  const visibleCards = cards.filter(card => 
    cardStates[card.id]?.isVisible && !cardStates[card.id]?.isMinimized
  );

  // Mobile fallback: stack cards vertically
  if (isMobile) {
    return (
      <div className={cn("space-y-4", className)}>
        {cards.map(card => (
          <DraggableCard
            key={card.id}
            id={card.id}
            type={card.type}
            title={card.title}
            headerActions={card.headerActions}
            isMinimized={cardStates[card.id]?.isMinimized}
            onMinimize={() => handleMinimize(card.id)}
            onMaximize={() => handleRestore(card.id)}
          >
            {card.content}
          </DraggableCard>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-4", className)}>
      {/* Main grid area */}
      <div className="flex-1 min-w-0">
        <GridLayout
          className="layout"
          layout={layouts}
          cols={GRID_CONFIG.cols}
          rowHeight={GRID_CONFIG.rowHeight}
          width={1200}
          compactType={GRID_CONFIG.compactType}
          preventCollision={GRID_CONFIG.preventCollision}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".cursor-move"
          isResizable={true}
          isDraggable={true}
          margin={[16, 16]}
          containerPadding={[0, 0]}
        >
          {visibleCards.map(card => (
            <div key={card.id}>
              <DraggableCard
                id={card.id}
                type={card.type}
                title={card.title}
                headerActions={card.headerActions}
                isMinimized={cardStates[card.id]?.isMinimized}
                onMinimize={() => handleMinimize(card.id)}
                onMaximize={() => handleRestore(card.id)}
              >
                {card.content}
              </DraggableCard>
            </div>
          ))}
        </GridLayout>
      </div>

      {/* Dock for minimized cards */}
      {minimizedCards.length > 0 && (
        <DockPanel
          items={minimizedCards}
          onRestore={handleRestore}
          position="right"
          className="w-48"
        />
      )}
    </div>
  );
}
