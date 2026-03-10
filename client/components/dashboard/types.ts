import { Layout } from 'react-grid-layout';

export type LayoutPresetType = 'compare' | 'focus' | 'analyze' | 'custom';

export interface CardState {
  id: string;
  isMinimized: boolean;
  isVisible: boolean;
}

export interface DashboardLayout {
  preset: LayoutPresetType;
  layouts: Layout[];
  cardStates: Record<string, CardState>;
}

// Default layouts for each preset
export const PRESET_LAYOUTS: Record<LayoutPresetType, Layout[]> = {
  // Compare Mode: Input left (30%), Outputs grid right (70%)
  compare: [
    { i: 'input', x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 3 },
    { i: 'output-0', x: 4, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
    { i: 'output-1', x: 8, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
    { i: 'output-2', x: 4, y: 2, w: 4, h: 2, minW: 2, minH: 2 },
    { i: 'output-3', x: 8, y: 2, w: 4, h: 2, minW: 2, minH: 2 },
  ],
  
  // Focus Mode: Large input, outputs stacked below
  focus: [
    { i: 'input', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 2 },
    { i: 'output-0', x: 0, y: 3, w: 6, h: 2, minW: 3, minH: 2 },
    { i: 'output-1', x: 6, y: 3, w: 6, h: 2, minW: 3, minH: 2 },
    { i: 'output-2', x: 0, y: 5, w: 6, h: 2, minW: 3, minH: 2 },
    { i: 'output-3', x: 6, y: 5, w: 6, h: 2, minW: 3, minH: 2 },
  ],
  
  // Analyze Mode: Input minimized, outputs + AST side-by-side
  analyze: [
    { i: 'input', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'output-0', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'output-1', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'ast', x: 9, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'output-2', x: 3, y: 2, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'output-3', x: 6, y: 2, w: 3, h: 2, minW: 2, minH: 2 },
  ],
  
  // Custom: User-defined layout (empty default, will be populated from saved state)
  custom: [],
};

// Grid configuration
export const GRID_CONFIG = {
  cols: 12,
  rowHeight: 100,
  compactType: null as 'vertical' | 'horizontal' | null,
  preventCollision: true,
};

// Mobile breakpoints
export const MOBILE_BREAKPOINT = 768;
