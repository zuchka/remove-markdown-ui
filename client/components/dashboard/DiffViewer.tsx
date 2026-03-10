import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DiffViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  library1Name: string;
  library2Name: string;
  output1: string;
  output2: string;
  isHTML?: boolean;
}

export function DiffViewer({
  open,
  onOpenChange,
  library1Name,
  library2Name,
  output1,
  output2,
  isHTML = false,
}: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');
  const [copied, setCopied] = useState<1 | 2 | null>(null);

  const handleCopy = async (text: string, which: 1 | 2) => {
    await navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };

  // Simple diff highlighting (character-level)
  const highlightDifferences = (text1: string, text2: string) => {
    if (text1 === text2) return { text1, text2, identical: true };
    
    // For simplicity, we'll just mark if they're different
    // A more sophisticated implementation would use a proper diff algorithm
    return { text1, text2, identical: false };
  };

  const diff = highlightDifferences(output1, output2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0 border-4 border-black shadow-[12px_12px_0px_0px_black]">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">
                Output Comparison
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                Comparing: <span className="font-bold">{library1Name}</span> vs <span className="font-bold">{library2Name}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex border-3 border-black rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold transition-colors",
                    viewMode === 'side-by-side'
                      ? "bg-primary text-white"
                      : "bg-white text-foreground hover:bg-accent"
                  )}
                >
                  Side-by-Side
                </button>
                <div className="w-px bg-black" />
                <button
                  onClick={() => setViewMode('unified')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold transition-colors",
                    viewMode === 'unified'
                      ? "bg-primary text-white"
                      : "bg-white text-foreground hover:bg-accent"
                  )}
                >
                  Unified
                </button>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {diff.identical ? (
            <Badge className="mt-3 border-3 border-black bg-green-100 text-green-900 font-bold">
              ✓ Outputs are identical
            </Badge>
          ) : (
            <Badge className="mt-3 border-3 border-black bg-yellow-100 text-yellow-900 font-bold">
              ⚠ Outputs differ
            </Badge>
          )}
        </DialogHeader>

        {/* Comparison View */}
        <div className="flex-1 overflow-auto p-6 pt-4">
          {viewMode === 'side-by-side' ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Left Panel */}
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3 pb-2 border-b-3 border-black">
                  <h3 className="text-sm font-bold text-foreground">
                    {library1Name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(output1, 1)}
                    className="h-7 px-2"
                  >
                    {copied === 1 ? (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
                <div className="flex-1 overflow-auto bg-muted/30 border-3 border-black rounded-md p-4">
                  {isHTML ? (
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: output1 }}
                    />
                  ) : (
                    <pre className="font-mono text-xs whitespace-pre-wrap text-foreground">
                      {output1}
                    </pre>
                  )}
                </div>
              </div>

              {/* Right Panel */}
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3 pb-2 border-b-3 border-black">
                  <h3 className="text-sm font-bold text-foreground">
                    {library2Name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(output2, 2)}
                    className="h-7 px-2"
                  >
                    {copied === 2 ? (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
                <div className="flex-1 overflow-auto bg-muted/30 border-3 border-black rounded-md p-4">
                  {isHTML ? (
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: output2 }}
                    />
                  ) : (
                    <pre className="font-mono text-xs whitespace-pre-wrap text-foreground">
                      {output2}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Unified View
            <div className="space-y-4">
              <div className="bg-green-50 border-3 border-green-500 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-green-900">
                    {library1Name}
                  </h3>
                  <Badge className="border-2 border-green-700 bg-green-100 text-green-900 font-bold text-xs">
                    Library 1
                  </Badge>
                </div>
                {isHTML ? (
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: output1 }}
                  />
                ) : (
                  <pre className="font-mono text-xs whitespace-pre-wrap text-foreground">
                    {output1}
                  </pre>
                )}
              </div>

              <div className="bg-blue-50 border-3 border-blue-500 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-blue-900">
                    {library2Name}
                  </h3>
                  <Badge className="border-2 border-blue-700 bg-blue-100 text-blue-900 font-bold text-xs">
                    Library 2
                  </Badge>
                </div>
                {isHTML ? (
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: output2 }}
                  />
                ) : (
                  <pre className="font-mono text-xs whitespace-pre-wrap text-foreground">
                    {output2}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black p-4 bg-muted/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              <span className="font-semibold">Stats:</span>{' '}
              {library1Name}: {output1.length} chars | {library2Name}: {output2.length} chars
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-3 border-black shadow-[3px_3px_0px_0px_black]"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
