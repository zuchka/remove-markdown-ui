import { useState, useEffect } from 'react';
import { Settings2, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { getLibraryAdapter } from '@/lib/markdown-libraries/registry';
import type { OptionDefinition } from '@/lib/markdown-libraries/types';

interface LibrarySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  libraryId: string;
  libraryName: string;
  currentOptions: Record<string, any>;
  onSave: (options: Record<string, any>) => void;
}

export function LibrarySettingsDialog({
  open,
  onOpenChange,
  libraryId,
  libraryName,
  currentOptions,
  onSave,
}: LibrarySettingsDialogProps) {
  const [options, setOptions] = useState<Record<string, any>>(currentOptions);
  const [optionDefinitions, setOptionDefinitions] = useState<OptionDefinition[]>([]);

  useEffect(() => {
    if (open) {
      const adapter = getLibraryAdapter(libraryId);
      if (adapter) {
        const definitions = adapter.getOptions();
        setOptionDefinitions(definitions);
        
        // Initialize options with defaults if not already set
        const initialOptions = { ...currentOptions };
        definitions.forEach(def => {
          if (!(def.key in initialOptions)) {
            initialOptions[def.key] = def.default;
          }
        });
        setOptions(initialOptions);
      }
    }
  }, [open, libraryId, currentOptions]);

  const handleReset = () => {
    const adapter = getLibraryAdapter(libraryId);
    if (adapter) {
      const defaults = adapter.getDefaultOptions();
      setOptions(defaults);
    }
  };

  const handleSave = () => {
    onSave(options);
    onOpenChange(false);
  };

  const handleOptionChange = (key: string, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const isModified = () => {
    const adapter = getLibraryAdapter(libraryId);
    if (!adapter) return false;
    
    const defaults = adapter.getDefaultOptions();
    return Object.keys(defaults).some(key => options[key] !== defaults[key]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-4 border-black shadow-[12px_12px_0px_0px_black] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings2 className="w-5 h-5" />
            {libraryName} Settings
          </DialogTitle>
          <DialogDescription>
            Configure options for the {libraryName} library.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {optionDefinitions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No configurable options available for this library.
            </div>
          ) : (
            optionDefinitions.map((option) => (
              <div key={option.key} className="flex flex-row items-start space-x-3 space-y-0">
                {option.type === 'boolean' && (
                  <>
                    <Checkbox
                      id={option.key}
                      checked={options[option.key] ?? option.default}
                      onCheckedChange={(checked) => handleOptionChange(option.key, checked)}
                      className="mt-1 border-3 border-black data-[state=checked]:bg-primary"
                    />
                    <div className="flex-1 space-y-1 leading-none">
                      <Label
                        htmlFor={option.key}
                        className="text-sm font-bold cursor-pointer"
                      >
                        {option.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="flex-1">
            {isModified() && (
              <Badge variant="outline" className="text-xs border-2 border-primary bg-primary/10 text-primary font-bold">
                Modified from defaults
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 border-3 border-black shadow-[4px_4px_0px_0px_black]"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-8 border-3 border-black shadow-[4px_4px_0px_0px_black]"
            >
              Apply Settings
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
