import * as commonmark from 'commonmark';
import type { MarkdownLibraryAdapter, OptionDefinition, ConversionResult, ASTResult } from '../types';

export class CommonMarkAdapter implements MarkdownLibraryAdapter {
  id = 'commonmark';
  name = 'CommonMark';
  category = 'renderer' as const;
  description = 'Strict CommonMark spec compliant parser';
  version = '0.30.x';
  supportsAST = true;

  getOptions(): OptionDefinition[] {
    return [
      {
        key: 'sourcepos',
        label: 'Source Position',
        description: 'Include source position info',
        type: 'boolean',
        default: false,
      },
      {
        key: 'safe',
        label: 'Safe Mode',
        description: 'Suppress raw HTML',
        type: 'boolean',
        default: false,
      },
      {
        key: 'smart',
        label: 'Smart Punctuation',
        description: 'Enable smart quotes',
        type: 'boolean',
        default: false,
      },
    ];
  }

  getDefaultOptions(): Record<string, any> {
    return {
      sourcepos: false,
      safe: false,
      smart: false,
    };
  }

  validateOptions(options: Record<string, any>): boolean {
    return true;
  }

  async convert(markdown: string, options?: Record<string, any>): Promise<ConversionResult> {
    const start = performance.now();
    
    try {
      const mergedOptions = { ...this.getDefaultOptions(), ...options };
      
      const reader = new commonmark.Parser(mergedOptions);
      const writer = new commonmark.HtmlRenderer(mergedOptions);
      
      const parsed = reader.parse(markdown);
      const output = writer.render(parsed);
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

  async getAST(markdown: string): Promise<ASTResult | null> {
    try {
      const reader = new commonmark.Parser();
      const ast = reader.parse(markdown);
      
      return {
        ast,
        format: 'commonmark',
      };
    } catch (error) {
      console.error('Error getting AST from commonmark:', error);
      return null;
    }
  }
}
