import { useState } from 'react';
import { Copy, Check, Settings2, Code2, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LibraryInfo } from '@/lib/markdown-libraries/types';

interface OutputPanelProps {
  library: LibraryInfo;
  output: string;
  error?: string;
  processingTime?: number;
  isHTML?: boolean;
  onCopy?: () => void;
  onShowAST?: () => void;
  onShowSettings?: () => void;
}

export function OutputPanel({
  library,
  output,
  error,
  processingTime,
  isHTML = false,
  onCopy,
  onShowAST,
  onShowSettings,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
    } else {
      await navigator.clipboard.writeText(output);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = output.split(/\s+/).filter(Boolean).length;
  const charCount = output.length;

  return (
    <div className="bg-white rounded-md border-4 border-black shadow-[8px_8px_0px_0px_black] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-muted border-b-4 border-black px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full neo-bg-green border-2 border-black"></div>
              <div className="w-2 h-2 rounded-full bg-accent border-2 border-black"></div>
              <div className="w-2 h-2 rounded-full bg-destructive border-2 border-black"></div>
            </div>
            <span className="ml-2 text-sm font-bold text-foreground">
              {library.name}
            </span>
            <Badge variant="outline" className="text-xs">
              {library.category === 'renderer' ? 'HTML' : 'Text'}
            </Badge>
            {library.supportsAST && (
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                AST
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onShowSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowSettings}
                className="h-7 px-2"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </Button>
            )}
            {library.supportsAST && onShowAST && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowAST}
                className="h-7 px-2"
              >
                <Code2 className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-semibold">
          <span>{charCount} chars</span>
          <span>{wordCount} words</span>
          {processingTime !== undefined && (
            <span className="text-primary font-bold">
              {processingTime.toFixed(2)}ms
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 bg-white">
        {error ? (
          <div className="bg-destructive/10 border-3 border-black rounded-md p-4 shadow-[4px_4px_0px_0px_black]">
            <p className="text-sm text-destructive font-bold">Error:</p>
            <p className="text-sm text-destructive mt-1 font-medium">{error}</p>
          </div>
        ) : output ? (
          isHTML ? (
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          ) : (
            <div className="font-mono text-sm whitespace-pre-wrap text-foreground font-medium">
              {output}
            </div>
          )
        ) : (
          <div className="text-center text-muted-foreground italic py-8">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Output will appear here...</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface OutputGridProps {
  outputs: Array<{
    libraryId: string;
    library: LibraryInfo;
    output: string;
    error?: string;
    processingTime?: number;
  }>;
  onCopyOutput?: (libraryId: string, output: string) => void;
  onShowAST?: (libraryId: string) => void;
  onShowSettings?: (libraryId: string) => void;
}

export function OutputGrid({
  outputs,
  onCopyOutput,
  onShowAST,
  onShowSettings,
}: OutputGridProps) {
  const gridCols = outputs.length === 1 
    ? 'grid-cols-1' 
    : outputs.length === 2 
    ? 'grid-cols-2' 
    : outputs.length === 3
    ? 'grid-cols-3'
    : 'grid-cols-2';

  return (
    <div className={cn('grid gap-4 h-full', gridCols)}>
      {outputs.map(({ libraryId, library, output, error, processingTime }) => (
        <OutputPanel
          key={libraryId}
          library={library}
          output={output}
          error={error}
          processingTime={processingTime}
          isHTML={library.category === 'renderer'}
          onCopy={() => onCopyOutput?.(libraryId, output)}
          onShowAST={library.supportsAST ? () => onShowAST?.(libraryId) : undefined}
          onShowSettings={() => onShowSettings?.(libraryId)}
        />
      ))}
    </div>
  );
}
