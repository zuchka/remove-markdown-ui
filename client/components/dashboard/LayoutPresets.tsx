import { LayoutGrid, Focus, Microscope, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LayoutPresetType } from './types';

interface LayoutPresetsProps {
  currentPreset: LayoutPresetType;
  onChange: (preset: LayoutPresetType) => void;
  className?: string;
}

const presets: Array<{
  id: LayoutPresetType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  recommended?: boolean;
}> = [
  {
    id: 'compare',
    name: 'Compare',
    description: 'Input left, outputs grid right - optimized for side-by-side comparison',
    icon: LayoutGrid,
    recommended: true,
  },
  {
    id: 'focus',
    name: 'Focus',
    description: 'Large input, outputs below - best for editing and writing',
    icon: Focus,
  },
  {
    id: 'analyze',
    name: 'Analyze',
    description: 'Compact input, outputs + AST - perfect for deep inspection',
    icon: Microscope,
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Your personalized layout',
    icon: Palette,
  },
];

export function LayoutPresets({ currentPreset, onChange, className }: LayoutPresetsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-foreground">
          Layout Mode
        </label>
        {currentPreset === 'custom' && (
          <Badge variant="gradient" className="text-xs">
            Custom Layout Active
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {presets.map((preset) => {
          const Icon = preset.icon;
          const isActive = currentPreset === preset.id;
          
          return (
            <button
              key={preset.id}
              onClick={() => onChange(preset.id)}
              className={cn(
                "relative p-4 rounded-lg border transition-all duration-300 text-left",
                "hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0",
                isActive
                  ? "bg-gradient-primary border-0 shadow-glass shadow-glow"
                  : "glass-surface backdrop-blur-md border-glass-border shadow-soft hover:glass-surface-elevated hover:shadow-glass hover:border-glass-border-strong"
              )}
            >
              {preset.recommended && !isActive && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge variant="gradient" className="text-xs shadow-glow">
                    ⭐ Recommended
                  </Badge>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-soft",
                  isActive ? "bg-white/20 backdrop-blur-sm" : "glass-surface backdrop-blur-sm border border-glass-border"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-primary" : "text-foreground"
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "text-sm font-bold mb-1",
                    isActive ? "text-white" : "text-foreground"
                  )}>
                    {preset.name}
                  </h3>
                  <p className={cn(
                    "text-xs line-clamp-2",
                    isActive ? "text-white/90" : "text-muted-foreground"
                  )}>
                    {preset.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
