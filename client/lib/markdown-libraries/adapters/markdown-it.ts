import MarkdownIt from 'markdown-it';
import type { MarkdownLibraryAdapter, OptionDefinition, ConversionResult, ASTResult } from '../types';

export class MarkdownItAdapter implements MarkdownLibraryAdapter {
  id = 'markdown-it';
  name = 'markdown-it';
  category = 'renderer' as const;
  description = 'Powerful markdown parser with plugins and token system';
  version = '14.x';
  supportsAST = true;

  getOptions(): OptionDefinition[] {
    return [
      {
        key: 'html',
        label: 'Enable HTML',
        description: 'Allow HTML tags in source',
        type: 'boolean',
        default: false,
      },
      {
        key: 'linkify',
        label: 'Linkify',
        description: 'Auto-convert URL-like text to links',
        type: 'boolean',
        default: false,
      },
      {
        key: 'typographer',
        label: 'Typographer',
        description: 'Enable smart quotes and replacements',
        type: 'boolean',
        default: false,
      },
      {
        key: 'breaks',
        label: 'Line Breaks',
        description: 'Convert \\n to <br>',
        type: 'boolean',
        default: false,
      },
      {
        key: 'xhtmlOut',
        label: 'XHTML Output',
        description: 'Use "/" to close single tags',
        type: 'boolean',
        default: false,
      },
    ];
  }

  getDefaultOptions(): Record<string, any> {
    return {
      html: false,
      linkify: false,
      typographer: false,
      breaks: false,
      xhtmlOut: false,
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
      const md = new MarkdownIt(mergedOptions);
      
      const output = md.render(markdown);
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
      const md = new MarkdownIt();
      const tokens = md.parse(markdown, {});
      return {
        ast: tokens,
        format: 'tokens',
      };
    } catch (error) {
      console.error('Error getting tokens from markdown-it:', error);
      return null;
    }
  }
}
