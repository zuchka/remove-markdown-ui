import removeMd from 'remove-markdown';
import type { MarkdownLibraryAdapter, OptionDefinition, ConversionResult } from '../types';

export class RemoveMarkdownAdapter implements MarkdownLibraryAdapter {
  id = 'remove-markdown';
  name = 'remove-markdown';
  category = 'plaintext' as const;
  description = 'Strips markdown syntax to plain text - battle tested library';
  version = '0.6.x';
  supportsAST = false;

  getOptions(): OptionDefinition[] {
    return [
      {
        key: 'stripListLeaders',
        label: 'Strip List Leaders',
        description: 'Remove list markers (*, -, +, numbers)',
        type: 'boolean',
        default: true,
      },
      {
        key: 'listUnicodeChar',
        label: 'List Unicode Char',
        description: 'Character to insert instead of list markers',
        type: 'string',
        default: '',
        placeholder: '→ or •',
      },
      {
        key: 'gfm',
        label: 'GFM Support',
        description: 'GitHub Flavored Markdown (strikethrough, tables)',
        type: 'boolean',
        default: true,
      },
      {
        key: 'useImgAltText',
        label: 'Use Image Alt Text',
        description: 'Replace images with their alt text',
        type: 'boolean',
        default: true,
      },
      {
        key: 'abbr',
        label: 'Remove Abbreviations',
        description: 'Strip abbreviation definitions (*[ABBR]: ...)',
        type: 'boolean',
        default: false,
      },
      {
        key: 'replaceLinksWithURL',
        label: 'Replace Links with URL',
        description: 'Show only the URL instead of link text',
        type: 'boolean',
        default: false,
      },
      {
        key: 'separateLinksAndTexts',
        label: 'Link Separator',
        description: 'Separator between link text and URL',
        type: 'string',
        default: '',
        placeholder: ': or -',
      },
      {
        key: 'htmlTagsToSkip',
        label: 'HTML Tags to Skip',
        description: 'Comma-separated tags (e.g., a, b, img)',
        type: 'array',
        default: [],
      },
    ];
  }

  getDefaultOptions(): Record<string, any> {
    return {
      stripListLeaders: true,
      listUnicodeChar: '',
      gfm: true,
      useImgAltText: true,
      abbr: false,
      replaceLinksWithURL: false,
      separateLinksAndTexts: '',
      htmlTagsToSkip: [],
    };
  }

  validateOptions(options: Record<string, any>): boolean {
    // Basic validation
    return true;
  }

  async convert(markdown: string, options?: Record<string, any>): Promise<ConversionResult> {
    const start = performance.now();
    
    try {
      const mergedOptions = { ...this.getDefaultOptions(), ...options };
      
      // Handle htmlTagsToSkip array
      const processedOptions = {
        ...mergedOptions,
        htmlTagsToSkip: mergedOptions.htmlTagsToSkip.length > 0 
          ? mergedOptions.htmlTagsToSkip 
          : undefined,
      };
      
      const output = removeMd(markdown, processedOptions as any);
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
