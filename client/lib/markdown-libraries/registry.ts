import { MarkdownLibraryAdapter, LibraryInfo } from './types';

/**
 * Global registry for all markdown library adapters
 */
class LibraryRegistry {
  private adapters: Map<string, MarkdownLibraryAdapter> = new Map();

  /**
   * Register a new library adapter
   */
  register(adapter: MarkdownLibraryAdapter): void {
    if (this.adapters.has(adapter.id)) {
      console.warn(`Library adapter ${adapter.id} is already registered. Overwriting.`);
    }
    this.adapters.set(adapter.id, adapter);
  }

  /**
   * Get an adapter by ID
   */
  getAdapter(id: string): MarkdownLibraryAdapter | undefined {
    return this.adapters.get(id);
  }

  /**
   * Get all registered adapters
   */
  getAllAdapters(): MarkdownLibraryAdapter[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Get all library info for display
   */
  getAllLibraryInfo(): LibraryInfo[] {
    return this.getAllAdapters().map(adapter => ({
      id: adapter.id,
      name: adapter.name,
      category: adapter.category,
      description: adapter.description,
      version: adapter.version,
      supportsAST: adapter.supportsAST,
    }));
  }

  /**
   * Get adapters by category
   */
  getAdaptersByCategory(category: 'renderer' | 'plaintext'): MarkdownLibraryAdapter[] {
    return this.getAllAdapters().filter(adapter => adapter.category === category);
  }

  /**
   * Check if a library is registered
   */
  hasAdapter(id: string): boolean {
    return this.adapters.has(id);
  }

  /**
   * Unregister an adapter
   */
  unregister(id: string): boolean {
    return this.adapters.delete(id);
  }

  /**
   * Clear all adapters
   */
  clear(): void {
    this.adapters.clear();
  }
}

// Export singleton instance
export const registry = new LibraryRegistry();

// Helper function to get adapter
export function getLibraryAdapter(id: string): MarkdownLibraryAdapter | undefined {
  return registry.getAdapter(id);
}

// Helper function to get all library info
export function getAllLibraries(): LibraryInfo[] {
  return registry.getAllLibraryInfo();
}

// Helper function to get libraries by category
export function getLibrariesByCategory(category: 'renderer' | 'plaintext'): LibraryInfo[] {
  return registry.getAdaptersByCategory(category).map(adapter => ({
    id: adapter.id,
    name: adapter.name,
    category: adapter.category,
    description: adapter.description,
    version: adapter.version,
    supportsAST: adapter.supportsAST,
  }));
}
