// Types and interfaces for markdown library adapters

export type LibraryCategory = 'renderer' | 'plaintext';

export interface OptionDefinition {
  key: string;
  label: string;
  description: string;
  type: 'boolean' | 'string' | 'number' | 'array';
  default: any;
  placeholder?: string;
}

export interface ConversionResult {
  output: string;
  processingTime?: number;
  error?: string;
}

export interface ASTResult {
  ast: any;
  format: 'tokens' | 'mdast' | 'commonmark' | 'custom';
}

/**
 * Adapter interface for markdown libraries
 * Each library must implement this interface to be usable in the playground
 */
export interface MarkdownLibraryAdapter {
  /** Unique identifier for the library */
  id: string;
  
  /** Display name of the library */
  name: string;
  
  /** Category: renderer (markdown → HTML) or plaintext (markdown → plain text) */
  category: LibraryCategory;
  
  /** Short description of the library */
  description: string;
  
  /** Library version */
  version: string;
  
  /**
   * Convert markdown to output (HTML or plain text)
   * @param markdown - The markdown input string
   * @param options - Library-specific options
   * @returns The converted output
   */
  convert(markdown: string, options?: Record<string, any>): Promise<ConversionResult>;
  
  /**
   * Get AST/tokens if supported by the library
   * @param markdown - The markdown input string
   * @returns The AST or tokens
   */
  getAST?(markdown: string): Promise<ASTResult | null>;
  
  /**
   * Get available options for this library
   * @returns Array of option definitions
   */
  getOptions(): OptionDefinition[];
  
  /**
   * Validate options before processing
   * @param options - Options to validate
   * @returns true if valid, false otherwise
   */
  validateOptions(options: Record<string, any>): boolean;
  
  /**
   * Get default options for this library
   * @returns Default options object
   */
  getDefaultOptions(): Record<string, any>;
  
  /**
   * Whether this library supports AST extraction
   */
  supportsAST: boolean;
}

/**
 * Library information for display in the selector
 */
export interface LibraryInfo {
  id: string;
  name: string;
  category: LibraryCategory;
  description: string;
  version: string;
  supportsAST: boolean;
}
