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
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0 glass-card">
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
              <div className="flex glass-surface backdrop-blur-md border border-glass-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold transition-all duration-300",
                    viewMode === 'side-by-side'
                      ? "bg-gradient-primary text-white shadow-glow"
                      : "bg-transparent text-foreground hover:bg-white/30"
                  )}
                >
                  Side-by-Side
                </button>
                <div className="w-px bg-glass-border" />
                <button
                  onClick={() => setViewMode('unified')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold transition-all duration-300",
                    viewMode === 'unified'
                      ? "bg-gradient-primary text-white shadow-glow"
                      : "bg-transparent text-foreground hover:bg-white/30"
                  )}
                >
                  Unified
                </button>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {diff.identical ? (
            <Badge variant="secondary" className="mt-3 bg-green-400/10 text-green-700 border border-green-400/30">
              ✓ Outputs are identical
            </Badge>
          ) : (
            <Badge variant="secondary" className="mt-3 bg-yellow-400/10 text-yellow-700 border border-yellow-400/30">
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
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-glass-border">
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
                <div className="flex-1 overflow-auto glass-surface backdrop-blur-sm border border-glass-border rounded-lg p-4">
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
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-glass-border">
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
                <div className="flex-1 overflow-auto glass-surface backdrop-blur-sm border border-glass-border rounded-lg p-4">
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
              <div className="glass-surface backdrop-blur-md border-l-4 border-l-green-400/40 border border-glass-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-green-700">
                    {library1Name}
                  </h3>
                  <Badge variant="secondary" className="bg-green-400/20 text-green-700 border border-green-400/30 text-xs">
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

              <div className="glass-surface backdrop-blur-md border-l-4 border-l-blue-400/40 border border-glass-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-blue-700">
                    {library2Name}
                  </h3>
                  <Badge variant="secondary" className="bg-blue-400/20 text-blue-700 border border-blue-400/30 text-xs">
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
        <div className="border-t border-glass-border p-4 glass-surface-elevated backdrop-blur-lg">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              <span className="font-semibold">Stats:</span>{' '}
              {library1Name}: {output1.length} chars | {library2Name}: {output2.length} chars
            </div>
            <Button
              variant="glass"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
