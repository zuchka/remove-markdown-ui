import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Sparkles,
  FileText,
  Zap,
  ArrowRight,
  Share2,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LibrarySelector } from "@/components/LibrarySelector";
import { OutputGrid } from "@/components/OutputPanel";
import { TestCases } from "@/components/TestCases";
import { MarkdownCheatSheet } from "@/components/MarkdownCheatSheet";
import { ASTVisualizer } from "@/components/ASTVisualizer";
import { Button } from "@/components/ui/button";

// Import and register all library adapters
import '@/lib/markdown-libraries/adapters';
import { getAllLibraries, getLibraryAdapter } from '@/lib/markdown-libraries/registry';
import type { ConversionResult, ASTResult } from '@/lib/markdown-libraries/types';

const DEFAULT_MARKDOWN = `# Welcome to the Markdown Playground! 🎉

This is the **Regex101 but for Markdown** - test and compare different markdown libraries side-by-side!

## 🚀 Key Features

- **Multi-Library Comparison**: Test up to 4 markdown libraries simultaneously
- **AST Visualization**: Explore the Abstract Syntax Tree for supported libraries
- **Test Cases Library**: 20+ pre-built examples to test edge cases
- **Cheat Sheet**: Quick reference for all markdown syntax
- **Share & Save**: Share your markdown configurations with unique URLs
- **Performance Metrics**: See processing time for each library

## 📝 Getting Started

1. Click "Select libraries to compare" above to choose parsers
2. Edit this markdown or click "Test Cases" to load examples
3. See real-time output from each library side-by-side
4. Click the AST button (✨) on libraries that support it
5. Use "Cheat Sheet" for syntax reference

### Supported Libraries (7 total)

**Renderers (Markdown → HTML):**
- **Marked** - Fast, popular, and extensible (✨ AST)
- **markdown-it** - Powerful with plugins and tokens (✨ AST)
- **Showdown** - GitHub Flavored Markdown support
- **CommonMark** - Strict CommonMark spec compliance (✨ AST)
- **Micromark** - Low-level, spec-compliant parser

**Plain Text Converters (Markdown → Text):**
- **remove-markdown** - Battle-tested plaintext stripper
- **Remark** - AST-based plaintext extraction (✨ AST)

## Try Different Syntax

### Emphasis
*italic* or _italic_
**bold** or __bold__
***bold italic***
~~strikethrough~~ (GFM)

### Lists
* Unordered item 1
* Unordered item 2
  * Nested item

1. Ordered item 1
2. Ordered item 2

- [ ] Task list item (GFM)
- [x] Completed task (GFM)

### Links and Images
[Visit Builder.io](https://www.builder.io "Best AI Dev Tool")
![Alt text](https://via.placeholder.com/150 "Image Title")
<https://auto-linked-url.com>

### Code
Inline: \`const x = 42\`

\`\`\`javascript
// Syntax highlighted code block
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Tables (GFM)
| Library     | Category  | AST | Speed |
|:------------|:---------:|:---:|------:|
| Marked      | Renderer  | ✓   | Fast  |
| markdown-it | Renderer  | ✓   | Fast  |
| CommonMark  | Renderer  | ✓   | Good  |

### Blockquotes
> This is a blockquote.
> It can span multiple lines.
>
> > Nested blockquotes work too!

---

> **Pro Tips:**
> - Try the **Test Cases** button to load edge case examples
> - Use **Cheat Sheet** to insert syntax quickly
> - Click the **✨ AST** badge to visualize parse trees
> - **Share** your setup with a unique URL
> - Compare how different libraries handle the same markdown!

Made with ❤️ using [Builder.io](https://www.builder.io)`;

export default function Index() {
  const { id } = useParams();
  const { toast } = useToast();
  
  // State
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>(['marked', 'remove-markdown']);
  const [outputs, setOutputs] = useState<Record<string, ConversionResult>>({});
  const [libraryOptions, setLibraryOptions] = useState<Record<string, Record<string, any>>>({});
  const [isSharing, setIsSharing] = useState(false);
  const [astViewerOpen, setAstViewerOpen] = useState(false);
  const [currentAST, setCurrentAST] = useState<ASTResult | null>(null);
  const [currentASTLibrary, setCurrentASTLibrary] = useState<string>('');

  // Get available libraries - memoized
  const availableLibraries = useMemo(() => getAllLibraries(), []);

  // Load shared content if ID is present
  useEffect(() => {
    if (id) {
      fetch(`/api/share/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Share not found');
          return res.json();
        })
        .then((data) => {
          setMarkdown(data.markdown);
          if (data.selectedLibraries) {
            setSelectedLibraries(data.selectedLibraries);
          }
          if (data.libraryOptions) {
            setLibraryOptions(data.libraryOptions);
          }
          toast({
            title: "Shared content loaded",
            description: "You're viewing a shared markdown setup.",
          });
        })
        .catch((error) => {
          console.error('Error loading share:', error);
          toast({
            title: "Share not found",
            description: "The shared link could not be found.",
            variant: "destructive",
          });
        });
    }
  }, [id]);

  // Process markdown with all selected libraries (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const processMarkdown = async () => {
        const newOutputs: Record<string, ConversionResult> = {};

        for (const libraryId of selectedLibraries) {
          const adapter = getLibraryAdapter(libraryId);
          if (adapter) {
            const options = libraryOptions[libraryId] || adapter.getDefaultOptions();
            const result = await adapter.convert(markdown, options);
            newOutputs[libraryId] = result;
          }
        }

        setOutputs(newOutputs);
      };

      if (selectedLibraries.length > 0) {
        processMarkdown();
      } else {
        setOutputs({});
      }
    }, 150); // Debounce by 150ms

    return () => clearTimeout(timer);
  }, [markdown, selectedLibraries, libraryOptions]);

  // Handle share
  const handleShare = async () => {
    setIsSharing(true);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown,
          selectedLibraries,
          libraryOptions,
        }),
      });

      if (!response.ok) throw new Error('Failed to create share');

      const data = await response.json();
      const fullUrl = `${window.location.origin}${data.shortUrl}`;

      await navigator.clipboard.writeText(fullUrl);

      toast({
        title: "Link copied!",
        description: "The shareable link has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Error creating share:', error);
      toast({
        title: "Share failed",
        description: "Failed to create shareable link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleReset = () => {
    setMarkdown(DEFAULT_MARKDOWN);
    setSelectedLibraries(['marked', 'remove-markdown']);
    setLibraryOptions({});
    toast({
      title: "Reset complete",
      description: "Markdown and settings have been reset.",
    });
  };

  const handleShowAST = useCallback(async (libraryId: string) => {
    const adapter = getLibraryAdapter(libraryId);
    if (adapter && adapter.supportsAST && adapter.getAST) {
      const library = availableLibraries.find(lib => lib.id === libraryId);
      const astResult = await adapter.getAST(markdown);
      setCurrentAST(astResult);
      setCurrentASTLibrary(library?.name || libraryId);
      setAstViewerOpen(true);
    }
  }, [markdown, availableLibraries]);

  const handleLoadTestCase = useCallback((testMarkdown: string) => {
    setMarkdown(testMarkdown);
    toast({
      title: "Test case loaded",
      description: "The test case has been loaded into the editor.",
    });
  }, [toast]);

  const handleInsertSyntax = useCallback((syntax: string) => {
    setMarkdown(prev => prev + '\n\n' + syntax);
    toast({
      title: "Syntax inserted",
      description: "The syntax has been added to your markdown.",
    });
  }, [toast]);

  // Prepare output data for OutputGrid
  const outputData = selectedLibraries.map(libraryId => {
    const library = availableLibraries.find(lib => lib.id === libraryId);
    const output = outputs[libraryId];
    
    return {
      libraryId,
      library: library!,
      output: output?.output || '',
      error: output?.error,
      processingTime: output?.processingTime,
    };
  }).filter(item => item.library);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20">
      {/* Header */}
      <header className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Markdown Playground
                </h1>
                <p className="text-xs text-muted-foreground">
                  The Regex101 but for Markdown
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <TestCases onLoadTestCase={handleLoadTestCase} />
              <MarkdownCheatSheet onInsertSyntax={handleInsertSyntax} />
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-8"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                disabled={isSharing}
                className="h-8"
              >
                {isSharing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1.5" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    Share
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Info Banner */}
        <div className="mb-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Compare multiple markdown libraries side-by-side. Select libraries below to see how each one processes your markdown.
              </p>
            </div>
          </div>
        </div>

        {/* Library Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Libraries to Compare
          </label>
          <LibrarySelector
            libraries={availableLibraries}
            selectedLibraries={selectedLibraries}
            onChange={setSelectedLibraries}
            maxSelection={4}
          />
        </div>

        {/* Editor and Output Grid */}
        <div className="grid lg:grid-cols-2 gap-6 min-h-[600px]">
          {/* Input Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <span className="ml-2 text-sm font-medium text-foreground">
                  input.md
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <label className="block text-sm font-medium text-foreground mb-2">
                Markdown Input
              </label>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 w-full p-4 bg-muted/30 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm resize-none"
                placeholder="Enter your markdown here..."
              />
            </div>
          </div>

          {/* Output Grid */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-foreground mb-2">
              Output ({selectedLibraries.length} {selectedLibraries.length === 1 ? 'library' : 'libraries'})
            </label>
            {outputData.length > 0 ? (
              <OutputGrid outputs={outputData} onShowAST={handleShowAST} />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-border p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground text-sm">
                  Select at least one library to see output
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AST Visualizer */}
        <ASTVisualizer
          open={astViewerOpen}
          onOpenChange={setAstViewerOpen}
          astResult={currentAST}
          libraryName={currentASTLibrary}
        />

        {/* Builder CTA */}
        <div className="mt-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-blue-600 opacity-5 blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 rounded-2xl border-2 border-primary/20 p-8 md:p-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 mb-4 shadow-lg shadow-primary/30">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Made with Builder
              </h2>
              <p className="text-base text-muted-foreground mb-6">
                This playground was created using Builder - the AI-powered platform that turns your ideas into production-ready code.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href="https://www.builder.io?utm_source=tool&utm_content=md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all font-semibold text-sm group"
                >
                  Start Building for Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-muted-foreground">
              The Regex101 but for Markdown - Compare and test markdown libraries
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://www.builder.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Made with Builder.io
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
