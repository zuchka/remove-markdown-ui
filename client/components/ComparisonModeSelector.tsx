import { Code2, FileText, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ComparisonMode = 'html' | 'text' | 'mixed';

interface ComparisonModeSelectorProps {
  mode: ComparisonMode;
  onChange: (mode: ComparisonMode) => void;
  className?: string;
}

export function ComparisonModeSelector({
  mode,
  onChange,
  className,
}: ComparisonModeSelectorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label className="text-xs font-bold text-foreground whitespace-nowrap">
        Mode:
      </label>
      <Select value={mode} onValueChange={(value) => onChange(value as ComparisonMode)}>
        <SelectTrigger className="w-[180px] h-8 glass-surface backdrop-blur-sm border border-glass-border shadow-soft hover:glass-surface-elevated hover:shadow-glass transition-all duration-300">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="html">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" />
              <span className="font-semibold">HTML Renderers</span>
            </div>
          </SelectItem>
          <SelectItem value="text">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-semibold">Text Converters</span>
            </div>
          </SelectItem>
          <SelectItem value="mixed">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span className="font-semibold">Mixed (Advanced)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      {mode === 'mixed' && (
        <Badge variant="secondary" className="text-xs bg-purple-400/10 border border-purple-400/30 text-purple-700">
          Mixed types
        </Badge>
      )}
    </div>
  );
}
