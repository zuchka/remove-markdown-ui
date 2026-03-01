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
      "flex items-center gap-3 px-4 py-2 bg-muted border-3 border-black rounded-md shadow-[4px_4px_0px_0px_black]",
      className
    )}>
      <span className="text-sm font-bold text-foreground">
        Selected: {total} {total === 1 ? 'library' : 'libraries'}
      </span>
      
      {htmlCount > 0 && (
        <Badge className="neo-bg-category-html border-3 border-black shadow-[2px_2px_0px_0px_black] text-xs font-bold">
          <CodeXml className="w-3.5 h-3.5 mr-1" />
          {htmlCount} HTML {htmlCount === 1 ? 'Renderer' : 'Renderers'}
        </Badge>
      )}
      
      {textCount > 0 && (
        <Badge className="neo-bg-category-text border-3 border-black shadow-[2px_2px_0px_0px_black] text-xs font-bold">
          <FileType className="w-3.5 h-3.5 mr-1" />
          {textCount} Text {textCount === 1 ? 'Converter' : 'Converters'}
        </Badge>
      )}
      
      {htmlCount > 0 && textCount > 0 && (
        <Badge variant="outline" className="text-xs border-2 border-purple-300 bg-purple-50 text-purple-700 font-bold">
          Mixed comparison
        </Badge>
      )}
    </div>
  );
}
