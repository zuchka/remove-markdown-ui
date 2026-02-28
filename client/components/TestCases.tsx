import { useState } from 'react';
import { TestTubes, Search, Tag, FileText, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { testCases, categories, getTestCasesByCategory, searchTestCases, type TestCase } from '@/data/test-cases';
import { cn } from '@/lib/utils';

interface TestCasesProps {
  onLoadTestCase: (markdown: string) => void;
}

export function TestCases({ onLoadTestCase }: TestCasesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isOpen, setIsOpen] = useState(false);

  const displayedTestCases = searchQuery
    ? searchTestCases(searchQuery)
    : getTestCasesByCategory(selectedCategory);

  const handleLoadTestCase = (testCase: TestCase) => {
    onLoadTestCase(testCase.markdown);
    setIsOpen(false);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'basic':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <TestTubes className="w-3.5 h-3.5 mr-1.5" />
          Test Cases
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <TestTubes className="w-5 h-5" />
            Markdown Test Cases
          </SheetTitle>
          <SheetDescription>
            Pre-built examples to test markdown libraries and edge cases
          </SheetDescription>
        </SheetHeader>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search test cases..."
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
                {displayedTestCases.length > 0 ? (
                  displayedTestCases.map((testCase) => (
                    <TestCaseCard
                      key={testCase.id}
                      testCase={testCase}
                      onLoad={handleLoadTestCase}
                      getDifficultyColor={getDifficultyColor}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No test cases found</p>
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
                      {getTestCasesByCategory(category).map((testCase) => (
                        <TestCaseCard
                          key={testCase.id}
                          testCase={testCase}
                          onLoad={handleLoadTestCase}
                          getDifficultyColor={getDifficultyColor}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>

        {/* Stats */}
        <div className="border-t pt-3 mt-3 text-xs text-muted-foreground">
          {displayedTestCases.length} test case{displayedTestCases.length !== 1 ? 's' : ''} available
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface TestCaseCardProps {
  testCase: TestCase;
  onLoad: (testCase: TestCase) => void;
  getDifficultyColor: (difficulty?: string) => string;
}

function TestCaseCard({ testCase, onLoad, getDifficultyColor }: TestCaseCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-sm">{testCase.title}</h3>
            {testCase.difficulty && (
              <Badge
                variant="outline"
                className={cn('text-xs py-0 px-1.5', getDifficultyColor(testCase.difficulty))}
              >
                {testCase.difficulty}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">{testCase.description}</p>
          <div className="flex flex-wrap gap-1">
            {testCase.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs py-0 px-1.5">
                <Tag className="w-2.5 h-2.5 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onLoad(testCase)}
          className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Load
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
      
      {/* Preview */}
      <div className="mt-3 pt-3 border-t">
        <pre className="text-xs bg-muted/30 p-2 rounded overflow-x-auto max-h-24 overflow-y-auto">
          <code>{testCase.markdown.substring(0, 200)}{testCase.markdown.length > 200 ? '...' : ''}</code>
        </pre>
      </div>
    </div>
  );
}
