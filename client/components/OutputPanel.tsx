import { useState } from 'react';
import { Copy, Check, Settings2, Code2, FileText, Sparkles, CodeXml, FileType } from 'lucide-react';
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
  hasCustomSettings?: boolean;
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
  hasCustomSettings = false,
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
  const isHTMLRenderer = library.category === 'renderer';

  return (
    <div className={cn(
      "glass-card overflow-hidden flex flex-col h-[350px]",
      "border-l-4",
      isHTMLRenderer ? "glass-border-category-html" : "glass-border-category-text"
    )}>
      {/* Header */}
      <div className="glass-surface-elevated backdrop-blur-lg border-b border-glass-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-soft"></div>
              <div className="w-2 h-2 rounded-full bg-accent shadow-soft"></div>
              <div className="w-2 h-2 rounded-full bg-destructive shadow-soft"></div>
            </div>
            <span className="ml-2 text-sm font-bold text-foreground">
              {library.name}
            </span>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                isHTMLRenderer
                  ? "glass-category-html"
                  : "glass-category-text"
              )}
            >
              {isHTMLRenderer ? (
                <>
                  <CodeXml className="w-3.5 h-3.5 mr-1" />
                  HTML
                </>
              ) : (
                <>
                  <FileType className="w-3.5 h-3.5 mr-1" />
                  Text
                </>
              )}
            </Badge>
            {library.supportsAST && (
              <Badge variant="gradient" className="text-xs">
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
                className="h-7 px-2 relative"
                title={hasCustomSettings ? "Custom settings applied" : "Configure settings"}
              >
                <Settings2 className="w-3.5 h-3.5" />
                {hasCustomSettings && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary border-2 border-white rounded-full" />
                )}
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
                <Check className="w-3.5 h-3.5 text-blue-600" />
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
      <div className="flex-1 overflow-auto p-4 bg-transparent">
        {error ? (
          <div className="glass-surface backdrop-blur-sm border border-destructive/30 rounded-lg p-4 bg-destructive/5">
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
          <div className="flex items-center justify-center h-full text-center text-muted-foreground py-8">
            <div>
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg glass-surface backdrop-blur-sm border border-dashed border-glass-border flex items-center justify-center">
                <FileText className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-xs font-medium">Processing...</p>
            </div>
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
  libraryOptions?: Record<string, Record<string, any>>;
  onCopyOutput?: (libraryId: string, output: string) => void;
  onShowAST?: (libraryId: string) => void;
  onShowSettings?: (libraryId: string) => void;
}

export function OutputGrid({
  outputs,
  libraryOptions = {},
  onCopyOutput,
  onShowAST,
  onShowSettings,
}: OutputGridProps) {
  // Helper to check if library has custom settings
  const hasCustomSettings = (libraryId: string): boolean => {
    const options = libraryOptions[libraryId];
    if (!options) return false;

    // Import needed here to avoid circular dependency
    const { getLibraryAdapter } = require('@/lib/markdown-libraries/registry');
    const adapter = getLibraryAdapter(libraryId);
    if (!adapter) return false;

    const defaults = adapter.getDefaultOptions();
    return Object.keys(defaults).some(key => options[key] !== defaults[key]);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {outputs.map(({ libraryId, library, output, error, processingTime }) => (
        <OutputPanel
          key={libraryId}
          library={library}
          output={output}
          error={error}
          processingTime={processingTime}
          isHTML={library.category === 'renderer'}
          hasCustomSettings={hasCustomSettings(libraryId)}
          onCopy={() => onCopyOutput?.(libraryId, output)}
          onShowAST={library.supportsAST ? () => onShowAST?.(libraryId) : undefined}
          onShowSettings={() => onShowSettings?.(libraryId)}
        />
      ))}
    </div>
  );
}
