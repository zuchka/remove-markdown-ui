import { useState } from 'react';
import { BookOpen, Search, Copy, Check, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cheatSheetItems, categories, getCheatSheetByCategory, searchCheatSheet, type CheatSheetItem } from '@/data/cheat-sheet';

interface MarkdownCheatSheetProps {
  onInsertSyntax?: (syntax: string) => void;
}

export function MarkdownCheatSheet({ onInsertSyntax }: MarkdownCheatSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isOpen, setIsOpen] = useState(false);

  const displayedItems = searchQuery
    ? searchCheatSheet(searchQuery)
    : getCheatSheetByCategory(selectedCategory);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <BookOpen className="w-3.5 h-3.5 mr-1.5" />
          Cheat Sheet
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Markdown Cheat Sheet
          </SheetTitle>
          <SheetDescription>
            Quick reference for markdown syntax with examples
          </SheetDescription>
        </SheetHeader>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search syntax..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden mt-4">
          {searchQuery ? (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-3">
                {displayedItems.length > 0 ? (
                  displayedItems.map((item) => (
                    <CheatSheetCard
                      key={item.id}
                      item={item}
                      onInsertSyntax={onInsertSyntax}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No syntax found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex flex-col h-full">
              <TabsList className="w-full justify-start overflow-x-auto flex-shrink-0">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs whitespace-nowrap">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((category) => (
                <TabsContent key={category} value={category} className="flex-1 overflow-hidden mt-4">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-3 pb-4">
                      {getCheatSheetByCategory(category).map((item) => (
                        <CheatSheetCard
                          key={item.id}
                          item={item}
                          onInsertSyntax={onInsertSyntax}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>

        {/* Footer */}
        <div className="border-t pt-3 mt-3 text-xs text-muted-foreground flex items-center justify-between">
          <span>{displayedItems.length} syntax reference{displayedItems.length !== 1 ? 's' : ''}</span>
          <Badge variant="outline" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            GFM = GitHub Flavored Markdown
          </Badge>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface CheatSheetCardProps {
  item: CheatSheetItem;
  onInsertSyntax?: (syntax: string) => void;
}

function CheatSheetCard({ item, onInsertSyntax }: CheatSheetCardProps) {
  const [copiedSyntax, setCopiedSyntax] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);

  const handleCopySyntax = async () => {
    await navigator.clipboard.writeText(item.syntax);
    setCopiedSyntax(true);
    setTimeout(() => setCopiedSyntax(false), 2000);
  };

  const handleCopyExample = async () => {
    await navigator.clipboard.writeText(item.example);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  const handleInsert = () => {
    if (onInsertSyntax) {
      onInsertSyntax(item.example);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium text-sm flex items-center gap-2">
            {item.title}
            {item.gfmOnly && (
              <Badge variant="secondary" className="text-xs py-0 px-1.5">
                GFM
              </Badge>
            )}
          </h3>
        </div>
      </div>

      {/* Syntax */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-muted-foreground">Syntax</label>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopySyntax}
            className="h-6 px-2"
          >
            {copiedSyntax ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        </div>
        <code className="block text-xs bg-muted/50 p-2 rounded font-mono">
          {item.syntax}
        </code>
      </div>

      {/* Example */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-muted-foreground">Example</label>
          <div className="flex gap-1">
            {onInsertSyntax && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleInsert}
                className="h-6 px-2 text-xs"
              >
                Insert
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyExample}
              className="h-6 px-2"
            >
              {copiedExample ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
        <pre className="text-xs bg-muted/50 p-2 rounded font-mono whitespace-pre-wrap">
          <code>{item.example}</code>
        </pre>
      </div>

      {/* Output */}
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">Output</label>
        <div className="text-xs bg-green-50 dark:bg-green-950 p-2 rounded text-green-800 dark:text-green-200">
          {item.output}
        </div>
      </div>
    </div>
  );
}
