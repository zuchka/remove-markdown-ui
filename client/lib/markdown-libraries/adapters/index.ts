import { registry } from '../registry';
import { MarkedAdapter } from './marked';
import { MarkdownItAdapter } from './markdown-it';
import { RemoveMarkdownAdapter } from './remove-markdown';
import { ShowdownAdapter } from './showdown';
import { CommonMarkAdapter } from './commonmark';
import { MicromarkAdapter } from './micromark';
import { RemarkAdapter } from './remark';

// Register all adapters
export function registerAllAdapters() {
  // Renderers
  registry.register(new MarkedAdapter());
  registry.register(new MarkdownItAdapter());
  registry.register(new ShowdownAdapter());
  registry.register(new CommonMarkAdapter());
  registry.register(new MicromarkAdapter());

  // Plain text converters
  registry.register(new RemoveMarkdownAdapter());
  registry.register(new RemarkAdapter());
}

// Auto-register on import
registerAllAdapters();

// Export individual adapters for direct use if needed
export {
  MarkedAdapter,
  MarkdownItAdapter,
  RemoveMarkdownAdapter,
  ShowdownAdapter,
  CommonMarkAdapter,
  MicromarkAdapter,
  RemarkAdapter,
};
