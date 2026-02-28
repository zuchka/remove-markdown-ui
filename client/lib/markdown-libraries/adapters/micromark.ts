import { micromark } from 'micromark';
import type { MarkdownLibraryAdapter, OptionDefinition, ConversionResult } from '../types';

export class MicromarkAdapter implements MarkdownLibraryAdapter {
  id = 'micromark';
  name = 'Micromark';
  category = 'renderer' as const;
  description = 'Low-level, spec-compliant markdown parser';
  version = '4.x';
  supportsAST = false; // Can support via separate parsing but keeping it simple

  getOptions(): OptionDefinition[] {
    return [
      {
        key: 'allowDangerousHtml',
        label: 'Allow HTML',
        description: 'Allow dangerous HTML in markdown',
        type: 'boolean',
        default: false,
      },
      {
        key: 'allowDangerousProtocol',
        label: 'Allow Dangerous Protocols',
        description: 'Allow dangerous protocols in links',
        type: 'boolean',
        default: false,
      },
    ];
  }

  getDefaultOptions(): Record<string, any> {
    return {
      allowDangerousHtml: false,
      allowDangerousProtocol: false,
    };
  }

  validateOptions(options: Record<string, any>): boolean {
    return true;
  }

  async convert(markdown: string, options?: Record<string, any>): Promise<ConversionResult> {
    const start = performance.now();
    
    try {
      const mergedOptions = { ...this.getDefaultOptions(), ...options };
      const output = micromark(markdown, mergedOptions);
      const processingTime = performance.now() - start;
      
      return {
        output,
        processingTime,
      };
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: performance.now() - start,
      };
    }
  }
}
