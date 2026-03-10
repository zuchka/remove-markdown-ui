import { CodeXml, FileType } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LibraryInfo } from '@/lib/markdown-libraries/types';

interface LibrarySummaryProps {
  libraries: LibraryInfo[];
  className?: string;
}

export function LibrarySummary({ libraries, className }: LibrarySummaryProps) {
  const htmlCount = libraries.filter(lib => lib.category === 'renderer').length;
  const textCount = libraries.filter(lib => lib.category === 'plaintext').length;
  const total = libraries.length;

  if (total === 0) {
    return null;
  }

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 glass-card",
      className
    )}>
      <span className="text-sm font-bold text-foreground">
        Selected: {total} {total === 1 ? 'library' : 'libraries'}
      </span>

      {htmlCount > 0 && (
        <Badge className="glass-category-html text-xs">
          <CodeXml className="w-3.5 h-3.5 mr-1" />
          {htmlCount} HTML {htmlCount === 1 ? 'Renderer' : 'Renderers'}
        </Badge>
      )}

      {textCount > 0 && (
        <Badge className="glass-category-text text-xs">
          <FileType className="w-3.5 h-3.5 mr-1" />
          {textCount} Text {textCount === 1 ? 'Converter' : 'Converters'}
        </Badge>
      )}

      {htmlCount > 0 && textCount > 0 && (
        <Badge variant="secondary" className="text-xs bg-purple-400/10 text-purple-700 border border-purple-400/30">
          Mixed comparison
        </Badge>
      )}
    </div>
  );
}
