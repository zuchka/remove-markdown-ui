import { useState } from 'react';
import { Code2, Download, Copy, Check } from 'lucide-react';
import { JSONTree } from 'react-json-tree';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ASTResult } from '@/lib/markdown-libraries/types';

interface ASTVisualizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  astResult: ASTResult | null;
  libraryName: string;
}

const jsonTreeTheme = {
  scheme: 'monokai',
  base00: '#fafafa',
  base01: '#f5f5f5',
  base02: '#eeeeee',
  base03: '#9e9e9e',
  base04: '#757575',
  base05: '#424242',
  base06: '#212121',
  base07: '#000000',
  base08: '#f44336',
  base09: '#ff9800',
  base0A: '#ffc107',
  base0B: '#4caf50',
  base0C: '#00bcd4',
  base0D: '#2196f3',
  base0E: '#9c27b0',
  base0F: '#795548',
};

export function ASTVisualizer({
  open,
  onOpenChange,
  astResult,
  libraryName,
}: ASTVisualizerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!astResult) return;
    
    const jsonString = JSON.stringify(astResult.ast, null, 2);
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!astResult) return;
    
    const jsonString = JSON.stringify(astResult.ast, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${libraryName}-ast.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            {libraryName} - AST Viewer
          </DialogTitle>
          <DialogDescription>
            Abstract Syntax Tree visualization ({astResult?.format || 'unknown'} format)
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!astResult}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy JSON
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!astResult}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download
          </Button>
        </div>

        <div className="flex-1 overflow-auto border rounded-lg p-4 bg-muted/30">
          {astResult ? (
            <JSONTree
              data={astResult.ast}
              theme={jsonTreeTheme}
              invertTheme={false}
              shouldExpandNodeInitially={(keyPath, data, level) => level < 2}
              hideRoot={false}
              sortObjectKeys={false}
            />
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Code2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No AST available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
