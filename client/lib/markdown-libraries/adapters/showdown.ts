import showdown from 'showdown';
import type { MarkdownLibraryAdapter, OptionDefinition, ConversionResult } from '../types';

export class ShowdownAdapter implements MarkdownLibraryAdapter {
  id = 'showdown';
  name = 'Showdown';
  category = 'renderer' as const;
  description = 'Markdown to HTML with GitHub Flavored Markdown support';
  version = '2.x';
  supportsAST = false;

  getOptions(): OptionDefinition[] {
    return [
      {
        key: 'ghCodeBlocks',
        label: 'GH Code Blocks',
        description: 'Enable GitHub code blocks',
        type: 'boolean',
        default: true,
      },
      {
        key: 'tables',
        label: 'Tables',
        description: 'Enable GFM tables',
        type: 'boolean',
        default: true,
      },
      {
        key: 'strikethrough',
        label: 'Strikethrough',
        description: 'Enable ~~strikethrough~~',
        type: 'boolean',
        default: true,
      },
      {
        key: 'tasklists',
        label: 'Task Lists',
        description: 'Enable task lists',
        type: 'boolean',
        default: true,
      },
      {
        key: 'simpleLineBreaks',
        label: 'Simple Line Breaks',
        description: 'Convert \\n to <br>',
        type: 'boolean',
        default: false,
      },
    ];
  }

  getDefaultOptions(): Record<string, any> {
    return {
      ghCodeBlocks: true,
      tables: true,
      strikethrough: true,
      tasklists: true,
      simpleLineBreaks: false,
    };
  }

  validateOptions(options: Record<string, any>): boolean {
    return true;
  }

  async convert(markdown: string, options?: Record<string, any>): Promise<ConversionResult> {
    const start = performance.now();
    
    try {
      const mergedOptions = { ...this.getDefaultOptions(), ...options };
      const converter = new showdown.Converter(mergedOptions);
      
      const output = converter.makeHtml(markdown);
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
