import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { fromMarkdown } from 'mdast-util-from-markdown';
import type { MarkdownLibraryAdapter, OptionDefinition, ConversionResult, ASTResult } from '../types';

export class RemarkAdapter implements MarkdownLibraryAdapter {
  id = 'remark-plaintext';
  name = 'Remark (Plain Text)';
  category = 'plaintext' as const;
  description = 'Extract plain text using remark AST traversal';
  version = '11.x';
  supportsAST = true;

  getOptions(): OptionDefinition[] {
    return [
      {
        key: 'preserveNewlines',
        label: 'Preserve Newlines',
        description: 'Keep newlines in output',
        type: 'boolean',
        default: true,
      },
    ];
  }

  getDefaultOptions(): Record<string, any> {
    return {
      preserveNewlines: true,
    };
  }

  validateOptions(options: Record<string, any>): boolean {
    return true;
  }

  async convert(markdown: string, options?: Record<string, any>): Promise<ConversionResult> {
    const start = performance.now();
    
    try {
      const mergedOptions = { ...this.getDefaultOptions(), ...options };
      
      // Parse to AST
      const tree = fromMarkdown(markdown);
      
      // Extract text from AST
      const output = this.extractText(tree, mergedOptions.preserveNewlines);
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
      const tree = fromMarkdown(markdown);
      return {
        ast: tree,
        format: 'mdast',
      };
    } catch (error) {
      console.error('Error getting AST from remark:', error);
      return null;
    }
  }

  private extractText(node: any, preserveNewlines: boolean): string {
    if (!node) return '';

    // If it's a text node, return its value
    if (node.type === 'text') {
      return node.value || '';
    }

    // If it's an inline code node
    if (node.type === 'inlineCode') {
      return node.value || '';
    }

    // If node has children, recursively extract text
    if (node.children && Array.isArray(node.children)) {
      const texts = node.children.map((child: any) => this.extractText(child, preserveNewlines));
      
      // Add newlines for block-level elements
      if (preserveNewlines && this.isBlockElement(node.type)) {
        return texts.join('') + '\n';
      }
      
      return texts.join('');
    }

    return '';
  }

  private isBlockElement(type: string): boolean {
    return [
      'paragraph',
      'heading',
      'blockquote',
      'list',
      'listItem',
      'code',
      'thematicBreak',
      'table',
    ].includes(type);
  }
}
