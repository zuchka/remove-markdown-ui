import { useState } from 'react';
import { Check, ChevronsUpDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LibraryInfo } from '@/lib/markdown-libraries/types';

interface LibrarySelectorProps {
  libraries: LibraryInfo[];
  selectedLibraries: string[];
  onChange: (selectedIds: string[]) => void;
  maxSelection?: number;
}

export function LibrarySelector({
  libraries,
  selectedLibraries,
  onChange,
  maxSelection = 4,
}: LibrarySelectorProps) {
  const [open, setOpen] = useState(false);

  const renderers = libraries.filter(lib => lib.category === 'renderer');
  const plaintext = libraries.filter(lib => lib.category === 'plaintext');

  const handleToggleLibrary = (libraryId: string) => {
    const isSelected = selectedLibraries.includes(libraryId);
    
    if (isSelected) {
      // Remove from selection
      onChange(selectedLibraries.filter(id => id !== libraryId));
    } else {
      // Add to selection if not at max
      if (selectedLibraries.length < maxSelection) {
        onChange([...selectedLibraries, libraryId]);
      }
    }
  };

  const getSelectedLibraryNames = () => {
    return selectedLibraries
      .map(id => libraries.find(lib => lib.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[48px] py-3 px-4 bg-white hover:bg-muted border-4 border-black shadow-[6px_6px_0px_0px_black] hover:shadow-[4px_4px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <div className="flex flex-wrap gap-2 flex-1 items-center">
            {selectedLibraries.length === 0 ? (
              <span className="text-muted-foreground font-medium">Select libraries to compare...</span>
            ) : (
              selectedLibraries.map(id => {
                const lib = libraries.find(l => l.id === id);
                return lib ? (
                  <Badge
                    key={id}
                    variant="default"
                    className="text-xs bg-primary text-white border-3 border-black hover:bg-primary shadow-[3px_3px_0px_0px_black] font-bold"
                  >
                    {lib.name}
                    {lib.supportsAST && (
                      <Sparkles className="w-3 h-3 ml-1 inline-block" />
                    )}
                  </Badge>
                ) : null;
              })
            )}
          </div>
          <ChevronsUpDown className="ml-3 h-5 w-5 shrink-0 text-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search libraries..." />
          <CommandEmpty>No library found.</CommandEmpty>
          
          {renderers.length > 0 && (
            <CommandGroup heading="Renderers (Markdown → HTML)">
              {renderers.map((library) => {
                const isSelected = selectedLibraries.includes(library.id);
                return (
                  <CommandItem
                    key={library.id}
                    value={library.name}
                    onSelect={() => handleToggleLibrary(library.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{library.name}</span>
                        {library.supportsAST && (
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AST
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {library.description}
                      </p>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {plaintext.length > 0 && (
            <CommandGroup heading="Plain Text Converters (Markdown → Text)">
              {plaintext.map((library) => {
                const isSelected = selectedLibraries.includes(library.id);
                return (
                  <CommandItem
                    key={library.id}
                    value={library.name}
                    onSelect={() => handleToggleLibrary(library.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{library.name}</span>
                        {library.supportsAST && (
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AST
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {library.description}
                      </p>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </Command>
        
        {selectedLibraries.length >= maxSelection && (
          <div className="border-t p-2 text-xs text-muted-foreground text-center">
            Maximum {maxSelection} libraries selected
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
