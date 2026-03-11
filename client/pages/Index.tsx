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
import { LibrarySummary } from "@/components/LibrarySummary";
import { LibrarySettingsDialog } from "@/components/LibrarySettingsDialog";
import { TestCases } from "@/components/TestCases";
import { MarkdownCheatSheet } from "@/components/MarkdownCheatSheet";
import { ASTVisualizer } from "@/components/ASTVisualizer";
import { ComparisonModeSelector, type ComparisonMode } from "@/components/ComparisonModeSelector";
import { Button } from "@/components/ui/button";

// Dashboard components
import {
  DashboardLayout,
  InputEditorCard,
  OutputCard,
  DiffViewer,
} from "@/components/dashboard";

// Import and register all library adapters
import '@/lib/markdown-libraries/adapters';
import { getAllLibraries, getLibraryAdapter } from '@/lib/markdown-libraries/registry';
import type { ConversionResult, ASTResult } from '@/lib/markdown-libraries/types';

const DEFAULT_MARKDOWN = `# Welcome to the Markdown Playground! 🎉

This is the **Regex101 but for Markdown** - test and compare different markdown libraries side-by-side!

## 🚀 Key Features

- **Multi-Library Comparison**: Test up to 4 markdown libraries simultaneously
- **Clean Interface**: Modern glassmorphism design for distraction-free comparison
- **AST Visualization**: Explore the Abstract Syntax Tree for supported libraries
- **Test Cases Library**: 20+ pre-built examples to test edge cases
- **Cheat Sheet**: Quick reference for all markdown syntax
- **Share & Save**: Share your markdown configurations with unique URLs
- **Performance Metrics**: See processing time for each library

## 📝 Getting Started

1. Select libraries to compare using the library selector
2. Edit this markdown or click "Test Cases" to load examples
3. View outputs in the grid below
4. Click the AST button (✨) on libraries that support it
5. Use "Compare These" to see side-by-side diffs

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
> - Try the **Layout Presets** to optimize your workspace
> - **Drag** cards to rearrange them
> - **Resize** cards by dragging edges
> - **Minimize** cards to the dock when not needed
> - Use **Test Cases** to load edge case examples
> - Click the **✨ AST** badge to visualize parse trees
> - **Share** your setup with a unique URL
> - Compare how different libraries handle the same markdown!

Made with ❤️ using [Builder.io](https://www.builder.io)`;

export default function Index() {
  const { id } = useParams();
  const { toast } = useToast();
  
  // State
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('html');
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>(['marked', 'markdown-it']);
  const [outputs, setOutputs] = useState<Record<string, ConversionResult>>({});
  const [libraryOptions, setLibraryOptions] = useState<Record<string, Record<string, any>>>({});
  const [isSharing, setIsSharing] = useState(false);
  const [astViewerOpen, setAstViewerOpen] = useState(false);
  const [currentAST, setCurrentAST] = useState<ASTResult | null>(null);
  const [currentASTLibrary, setCurrentASTLibrary] = useState<string>('');
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settingsLibraryId, setSettingsLibraryId] = useState<string>('');
  
  // No layout state needed - using static grid

  // Comparison state
  const [diffViewerOpen, setDiffViewerOpen] = useState(false);
  const [compareLibraries, setCompareLibraries] = useState<{ lib1: string; lib2: string } | null>(null);

  // Get available libraries - memoized and filtered by comparison mode
  const availableLibraries = useMemo(() => getAllLibraries(), []);

  const filteredLibraries = useMemo(() => {
    if (comparisonMode === 'mixed') {
      return availableLibraries;
    }
    const categoryFilter = comparisonMode === 'html' ? 'renderer' : 'plaintext';
    return availableLibraries.filter(lib => lib.category === categoryFilter);
  }, [availableLibraries, comparisonMode]);

  // Handle comparison mode changes
  const handleComparisonModeChange = useCallback((newMode: ComparisonMode) => {
    setComparisonMode(newMode);

    // Auto-adjust selected libraries when switching modes
    if (newMode !== 'mixed') {
      const categoryFilter = newMode === 'html' ? 'renderer' : 'plaintext';
      const compatibleLibraries = availableLibraries.filter(lib => lib.category === categoryFilter);
      const validSelections = selectedLibraries.filter(id =>
        compatibleLibraries.some(lib => lib.id === id)
      );

      // If no valid selections, pick defaults based on mode
      if (validSelections.length === 0) {
        const defaults = newMode === 'html'
          ? ['marked', 'markdown-it']
          : ['remove-markdown'];
        setSelectedLibraries(defaults.filter(id =>
          compatibleLibraries.some(lib => lib.id === id)
        ));
      } else {
        setSelectedLibraries(validSelections);
      }
    }
  }, [availableLibraries, selectedLibraries]);

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
          if (data.comparisonMode) {
            setComparisonMode(data.comparisonMode);
          }
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
  }, [id, toast]);

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
          comparisonMode,
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
    setComparisonMode('html');
    setSelectedLibraries(['marked', 'markdown-it']);
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

  const handleShowSettings = useCallback((libraryId: string) => {
    setSettingsLibraryId(libraryId);
    setSettingsDialogOpen(true);
  }, []);

  const handleSaveSettings = useCallback((libraryId: string, options: Record<string, any>) => {
    setLibraryOptions(prev => ({
      ...prev,
      [libraryId]: options,
    }));
    toast({
      title: "Settings saved",
      description: "Library options have been updated.",
    });
  }, [toast]);

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

  // Layout change handler removed - using static grid

  const handleCompare = useCallback((lib1Id: string, lib2Id: string) => {
    setCompareLibraries({ lib1: lib1Id, lib2: lib2Id });
    setDiffViewerOpen(true);
  }, []);

  // Helper to check if library has custom settings
  const hasCustomSettings = (libraryId: string): boolean => {
    const options = libraryOptions[libraryId];
    if (!options) return false;

    const adapter = getLibraryAdapter(libraryId);
    if (!adapter) return false;

    const defaults = adapter.getDefaultOptions();
    return Object.keys(defaults).some(key => options[key] !== defaults[key]);
  };

  // Prepare dashboard cards
  const dashboardCards = useMemo(() => {
    const cards = [
      // Input card
      {
        id: 'input',
        type: 'input' as const,
        title: 'Markdown Input',
        content: (
          <InputEditorCard
            value={markdown}
            onChange={setMarkdown}
          />
        ),
      },
    ];

    // Output cards for each selected library
    selectedLibraries.forEach((libraryId, index) => {
      const library = availableLibraries.find(lib => lib.id === libraryId);
      const output = outputs[libraryId];
      
      if (library) {
        cards.push({
          id: `output-${index}`,
          type: 'output' as const,
          title: library.name,
          content: (
            <OutputCard
              library={library}
              output={output?.output || ''}
              error={output?.error}
              processingTime={output?.processingTime}
              hasCustomSettings={hasCustomSettings(libraryId)}
              onShowAST={library.supportsAST ? () => handleShowAST(libraryId) : undefined}
              onShowSettings={() => handleShowSettings(libraryId)}
            />
          ),
        });
      }
    });

    return cards;
  }, [markdown, selectedLibraries, availableLibraries, outputs, libraryOptions, handleShowAST, handleShowSettings]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-surface-elevated backdrop-blur-lg border-b border-glass-border-strong shadow-glass sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary shadow-glow flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Markdown Playground
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  Interactive Dashboard • Drag & Resize
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
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Info Banner */}
        <div className="mb-6 glass-card p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground font-semibold">
              ✨ <strong>Glassmorphism UI!</strong> Clean, modern interface for comparing markdown libraries.
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="space-y-4 mb-6">
          {/* Comparison Mode */}
          <ComparisonModeSelector
            mode={comparisonMode}
            onChange={handleComparisonModeChange}
          />

          {/* Library Selector */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Select Libraries to Compare (up to 4)
            </label>
            <LibrarySelector
              libraries={filteredLibraries}
              selectedLibraries={selectedLibraries}
              onChange={setSelectedLibraries}
              maxSelection={4}
            />
          </div>

          {/* Library Summary */}
          {selectedLibraries.length > 0 && (
            <LibrarySummary
              libraries={selectedLibraries.map(id =>
                availableLibraries.find(lib => lib.id === id)!
              ).filter(Boolean)}
            />
          )}

          {/* Quick Compare */}
          {selectedLibraries.length >= 2 && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-muted-foreground">
                Quick Compare:
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedLibraries.slice(0, 2).map((lib1, i) =>
                  selectedLibraries.slice(i + 1).map((lib2) => {
                    const lib1Name = availableLibraries.find(l => l.id === lib1)?.name || lib1;
                    const lib2Name = availableLibraries.find(l => l.id === lib2)?.name || lib2;
                    return (
                      <Button
                        key={`${lib1}-${lib2}`}
                        variant="outline"
                        size="sm"
                        onClick={() => handleCompare(lib1, lib2)}
                        className="text-xs border-3 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_black] transition-all bg-yellow-50 hover:bg-yellow-100 font-bold"
                      >
                        Compare {lib1Name} vs {lib2Name}
                      </Button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dashboard */}
        {selectedLibraries.length > 0 ? (
          <DashboardLayout
            cards={dashboardCards}
          />
        ) : (
          <div className="bg-white rounded-md border-4 border-black shadow-[8px_8px_0px_0px_black] p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-muted border-3 border-black flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                No Libraries Selected
              </h3>
              <p className="text-muted-foreground text-sm font-medium mb-4">
                Choose one or more libraries above to start comparing markdown output.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLibraries(['marked', 'markdown-it'])}
                  className="border-3 border-black shadow-[4px_4px_0px_0px_black]"
                >
                  Try HTML Renderers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLibraries(['remove-markdown', 'remark'])}
                  className="border-3 border-black shadow-[4px_4px_0px_0px_black]"
                >
                  Try Text Converters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* AST Visualizer */}
        <ASTVisualizer
          open={astViewerOpen}
          onOpenChange={setAstViewerOpen}
          astResult={currentAST}
          libraryName={currentASTLibrary}
        />

        {/* Library Settings Dialog */}
        {settingsLibraryId && (
          <LibrarySettingsDialog
            open={settingsDialogOpen}
            onOpenChange={setSettingsDialogOpen}
            libraryId={settingsLibraryId}
            libraryName={availableLibraries.find(lib => lib.id === settingsLibraryId)?.name || settingsLibraryId}
            currentOptions={libraryOptions[settingsLibraryId] || {}}
            onSave={(options) => handleSaveSettings(settingsLibraryId, options)}
          />
        )}

        {/* Diff Viewer */}
        {compareLibraries && (
          <DiffViewer
            open={diffViewerOpen}
            onOpenChange={setDiffViewerOpen}
            library1Name={availableLibraries.find(lib => lib.id === compareLibraries.lib1)?.name || compareLibraries.lib1}
            library2Name={availableLibraries.find(lib => lib.id === compareLibraries.lib2)?.name || compareLibraries.lib2}
            output1={outputs[compareLibraries.lib1]?.output || ''}
            output2={outputs[compareLibraries.lib2]?.output || ''}
            isHTML={availableLibraries.find(lib => lib.id === compareLibraries.lib1)?.category === 'renderer'}
          />
        )}


        {/* Builder CTA */}
        <div className="mt-12">
          <div className="glass-card bg-gradient-primary p-8 md:p-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-white/20 backdrop-blur-sm mb-4 shadow-glow">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Made with Builder
              </h2>
              <p className="text-base text-white/95 mb-6 font-medium">
                This playground was created using Builder - the AI-powered platform that turns your ideas into production-ready code.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href="https://www.builder.io?utm_source=tool&utm_content=md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-lg shadow-glass hover:shadow-glass-lg hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 transition-all duration-300 font-bold text-sm group border border-white/20"
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
      <footer className="mt-12 border-t border-glass-border glass-surface-elevated backdrop-blur-lg">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-muted-foreground font-medium">
              The Regex101 but for Markdown - Interactive Dashboard Edition
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://www.builder.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-semibold"
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
