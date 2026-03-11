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
      "flex items-center gap-2 px-3 py-1.5 glass-card",
      className
    )}>
      <span className="text-xs font-bold text-foreground">
        Selected: {total} {total === 1 ? 'library' : 'libraries'}
      </span>

      {htmlCount > 0 && (
        <Badge className="glass-category-html text-xs px-2 py-0.5">
          <CodeXml className="w-3 h-3 mr-1" />
          {htmlCount} HTML
        </Badge>
      )}

      {textCount > 0 && (
        <Badge className="glass-category-text text-xs px-2 py-0.5">
          <FileType className="w-3 h-3 mr-1" />
          {textCount} Text
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
