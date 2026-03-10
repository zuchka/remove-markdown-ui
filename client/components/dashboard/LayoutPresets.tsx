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
          <Badge variant="secondary" className="text-xs border-2 border-black font-bold">
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
                "relative p-4 rounded-md border-3 border-black shadow-[4px_4px_0px_0px_black]",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_black]",
                "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
                "transition-all text-left",
                isActive 
                  ? "bg-primary border-primary shadow-[4px_4px_0px_0px_rgb(0,0,0)]" 
                  : "bg-white hover:bg-accent/50"
              )}
            >
              {preset.recommended && !isActive && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-yellow-400 text-black border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_black]">
                    ⭐ Recommended
                  </Badge>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-md border-3 border-black shadow-[3px_3px_0px_0px_black] flex items-center justify-center flex-shrink-0",
                  isActive ? "bg-white" : "bg-accent"
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
