import { marked } from 'marked';
import type { MarkdownLibraryAdapter, OptionDefinition, ConversionResult, ASTResult } from '../types';

export class MarkedAdapter implements MarkdownLibraryAdapter {
  id = 'marked';
  name = 'Marked';
  category = 'renderer' as const;
  description = 'Fast, popular, and extensible markdown parser';
  version = '11.x';
  supportsAST = true;

  getOptions(): OptionDefinition[] {
    return [
      {
        key: 'breaks',
        label: 'Line Breaks',
        description: 'Convert \\n to <br>',
        type: 'boolean',
        default: false,
      },
      {
        key: 'gfm',
        label: 'GitHub Flavored Markdown',
        description: 'Enable GFM features',
        type: 'boolean',
        default: true,
      },
      {
        key: 'headerIds',
        label: 'Header IDs',
        description: 'Add IDs to headers',
        type: 'boolean',
        default: true,
      },
      {
        key: 'mangle',
        label: 'Mangle Email',
        description: 'Mangle email addresses',
        type: 'boolean',
        default: true,
      },
      {
        key: 'pedantic',
        label: 'Pedantic',
        description: 'Strict markdown.pl compliance',
        type: 'boolean',
        default: false,
      },
    ];
  }

  getDefaultOptions(): Record<string, any> {
    return {
      breaks: false,
      gfm: true,
      headerIds: true,
      mangle: true,
      pedantic: false,
    };
  }

  validateOptions(options: Record<string, any>): boolean {
    // Basic validation - all options are optional booleans
    return true;
  }

  async convert(markdown: string, options?: Record<string, any>): Promise<ConversionResult> {
    const start = performance.now();
    
    try {
      const mergedOptions = { ...this.getDefaultOptions(), ...options };
      marked.setOptions(mergedOptions);
      
      const output = await marked.parse(markdown);
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
      const tokens = marked.lexer(markdown);
      return {
        ast: tokens,
        format: 'tokens',
      };
    } catch (error) {
      console.error('Error getting AST from marked:', error);
      return null;
    }
  }
}
