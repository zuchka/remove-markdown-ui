import { useState } from 'react';
import { Copy, Check, Settings2, Code2, Sparkles, CodeXml, FileType } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LibraryInfo } from '@/lib/markdown-libraries/types';

interface OutputCardProps {
  library: LibraryInfo;
  output: string;
  error?: string;
  processingTime?: number;
  hasCustomSettings?: boolean;
  onShowAST?: () => void;
  onShowSettings?: () => void;
}

export function OutputCard({
  library,
  output,
  error,
  processingTime,
  hasCustomSettings = false,
  onShowAST,
  onShowSettings,
}: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = output.split(/\s+/).filter(Boolean).length;
  const charCount = output.length;
  const isHTMLRenderer = library.category === 'renderer';

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Stats Header */}
      <div className="px-4 py-2 border-b-3 border-black bg-muted/50">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-xs font-bold border-2 border-black",
                isHTMLRenderer
                  ? "bg-green-100 text-green-900"
                  : "bg-blue-100 text-blue-900"
              )}
            >
              {isHTMLRenderer ? (
                <>
                  <CodeXml className="w-3 h-3 mr-1" />
                  HTML
                </>
              ) : (
                <>
                  <FileType className="w-3 h-3 mr-1" />
                  Text
                </>
              )}
            </Badge>
            {library.supportsAST && (
              <Badge variant="secondary" className="text-xs border-2 border-black bg-purple-100 text-purple-900 font-bold">
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
                title="View AST"
              >
                <Code2 className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2"
              title="Copy output"
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
      <div className="flex-1 overflow-auto p-4">
        {error ? (
          <div className="bg-destructive/10 border-3 border-black rounded-md p-4 shadow-[4px_4px_0px_0px_black]">
            <p className="text-sm text-destructive font-bold">Error:</p>
            <p className="text-sm text-destructive mt-1 font-medium">{error}</p>
          </div>
        ) : output ? (
          isHTMLRenderer ? (
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
          <div className="flex items-center justify-center h-full text-center text-muted-foreground">
            <p className="text-xs font-medium">Processing...</p>
          </div>
        )}
      </div>
    </div>
  );
}
