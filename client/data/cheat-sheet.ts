export interface CheatSheetItem {
  id: string;
  title: string;
  syntax: string;
  example: string;
  output: string;
  category: string;
  gfmOnly?: boolean;
}

export const cheatSheetItems: CheatSheetItem[] = [
  // Headers
  {
    id: 'h1',
    title: 'Heading 1',
    syntax: '# Heading 1',
    example: '# Hello World',
    output: '<h1>Hello World</h1>',
    category: 'Headers',
  },
  {
    id: 'h2',
    title: 'Heading 2',
    syntax: '## Heading 2',
    example: '## Section Title',
    output: '<h2>Section Title</h2>',
    category: 'Headers',
  },
  {
    id: 'h3-h6',
    title: 'Headings 3-6',
    syntax: '### H3 | #### H4 | ##### H5 | ###### H6',
    example: '### Subsection',
    output: '<h3>Subsection</h3>',
    category: 'Headers',
  },
  {
    id: 'setext-h1',
    title: 'Setext H1',
    syntax: 'Heading\\n=======',
    example: 'Main Title\n==========',
    output: '<h1>Main Title</h1>',
    category: 'Headers',
  },
  {
    id: 'setext-h2',
    title: 'Setext H2',
    syntax: 'Heading\\n-------',
    example: 'Subtitle\n--------',
    output: '<h2>Subtitle</h2>',
    category: 'Headers',
  },

  // Emphasis
  {
    id: 'italic',
    title: 'Italic',
    syntax: '*text* or _text_',
    example: '*italic* and _italic_',
    output: '<em>italic</em> and <em>italic</em>',
    category: 'Emphasis',
  },
  {
    id: 'bold',
    title: 'Bold',
    syntax: '**text** or __text__',
    example: '**bold** and __bold__',
    output: '<strong>bold</strong> and <strong>bold</strong>',
    category: 'Emphasis',
  },
  {
    id: 'bold-italic',
    title: 'Bold + Italic',
    syntax: '***text*** or ___text___',
    example: '***bold italic***',
    output: '<strong><em>bold italic</em></strong>',
    category: 'Emphasis',
  },
  {
    id: 'strikethrough',
    title: 'Strikethrough',
    syntax: '~~text~~',
    example: '~~deleted text~~',
    output: '<del>deleted text</del>',
    category: 'Emphasis',
    gfmOnly: true,
  },

  // Lists
  {
    id: 'unordered-list',
    title: 'Unordered List',
    syntax: '* Item or - Item or + Item',
    example: '* First\n* Second\n* Third',
    output: '<ul><li>First</li><li>Second</li><li>Third</li></ul>',
    category: 'Lists',
  },
  {
    id: 'ordered-list',
    title: 'Ordered List',
    syntax: '1. Item',
    example: '1. First\n2. Second\n3. Third',
    output: '<ol><li>First</li><li>Second</li><li>Third</li></ol>',
    category: 'Lists',
  },
  {
    id: 'nested-list',
    title: 'Nested List',
    syntax: '  * Sub-item (2 spaces)',
    example: '* Parent\n  * Child\n    * Grandchild',
    output: 'Nested list structure',
    category: 'Lists',
  },
  {
    id: 'task-list',
    title: 'Task List',
    syntax: '- [ ] Task or - [x] Task',
    example: '- [x] Done\n- [ ] Todo',
    output: 'Checkbox list',
    category: 'Lists',
    gfmOnly: true,
  },

  // Links
  {
    id: 'inline-link',
    title: 'Inline Link',
    syntax: '[text](url)',
    example: '[Google](https://google.com)',
    output: '<a href="https://google.com">Google</a>',
    category: 'Links',
  },
  {
    id: 'link-title',
    title: 'Link with Title',
    syntax: '[text](url "title")',
    example: '[Google](https://google.com "Search")',
    output: '<a href="https://google.com" title="Search">Google</a>',
    category: 'Links',
  },
  {
    id: 'reference-link',
    title: 'Reference Link',
    syntax: '[text][ref] ... [ref]: url',
    example: '[Google][1]\n\n[1]: https://google.com',
    output: '<a href="https://google.com">Google</a>',
    category: 'Links',
  },
  {
    id: 'autolink',
    title: 'Autolink',
    syntax: '<url> or bare URL (GFM)',
    example: '<https://example.com>',
    output: '<a href="https://example.com">https://example.com</a>',
    category: 'Links',
  },

  // Images
  {
    id: 'image',
    title: 'Image',
    syntax: '![alt](url)',
    example: '![Logo](logo.png)',
    output: '<img src="logo.png" alt="Logo">',
    category: 'Images',
  },
  {
    id: 'image-title',
    title: 'Image with Title',
    syntax: '![alt](url "title")',
    example: '![Logo](logo.png "Company Logo")',
    output: '<img src="logo.png" alt="Logo" title="Company Logo">',
    category: 'Images',
  },
  {
    id: 'reference-image',
    title: 'Reference Image',
    syntax: '![alt][ref] ... [ref]: url',
    example: '![Logo][img]\n\n[img]: logo.png',
    output: '<img src="logo.png" alt="Logo">',
    category: 'Images',
  },

  // Code
  {
    id: 'inline-code',
    title: 'Inline Code',
    syntax: '`code`',
    example: 'Use `const x = 1`',
    output: 'Use <code>const x = 1</code>',
    category: 'Code',
  },
  {
    id: 'code-block-fenced',
    title: 'Code Block (Fenced)',
    syntax: '```language\\ncode\\n```',
    example: '```js\nconst x = 1;\n```',
    output: '<pre><code class="language-js">const x = 1;</code></pre>',
    category: 'Code',
  },
  {
    id: 'code-block-indented',
    title: 'Code Block (Indented)',
    syntax: '    code (4 spaces)',
    example: '    const x = 1;',
    output: '<pre><code>const x = 1;</code></pre>',
    category: 'Code',
  },

  // Blockquotes
  {
    id: 'blockquote',
    title: 'Blockquote',
    syntax: '> Quote',
    example: '> This is a quote',
    output: '<blockquote>This is a quote</blockquote>',
    category: 'Blockquotes',
  },
  {
    id: 'nested-blockquote',
    title: 'Nested Blockquote',
    syntax: '> > Nested',
    example: '> Quote\n> > Nested quote',
    output: 'Nested blockquote structure',
    category: 'Blockquotes',
  },

  // Tables
  {
    id: 'table',
    title: 'Table',
    syntax: '| H1 | H2 |\\n|---|---|\\n| C1 | C2 |',
    example: '| Name | Age |\n|------|-----|\n| John | 25  |',
    output: 'Table structure',
    category: 'Tables',
    gfmOnly: true,
  },
  {
    id: 'table-align',
    title: 'Table Alignment',
    syntax: '|:---|:---:|---:|',
    example: '| Left | Center | Right |\n|:-----|:------:|------:|',
    output: 'Table with alignment',
    category: 'Tables',
    gfmOnly: true,
  },

  // Other
  {
    id: 'hr',
    title: 'Horizontal Rule',
    syntax: '--- or *** or ___',
    example: '---',
    output: '<hr>',
    category: 'Other',
  },
  {
    id: 'line-break',
    title: 'Line Break',
    syntax: 'Two spaces at end  ',
    example: 'Line 1  \nLine 2',
    output: 'Line 1<br>Line 2',
    category: 'Other',
  },
  {
    id: 'escape',
    title: 'Escape Character',
    syntax: '\\*escaped*',
    example: '\\*not italic\\*',
    output: '*not italic*',
    category: 'Other',
  },
  {
    id: 'html',
    title: 'Raw HTML',
    syntax: '<tag>content</tag>',
    example: '<strong>bold</strong>',
    output: '<strong>bold</strong>',
    category: 'Other',
  },
];

export const categories = Array.from(new Set(cheatSheetItems.map(item => item.category)));

export function getCheatSheetByCategory(category: string): CheatSheetItem[] {
  return cheatSheetItems.filter(item => item.category === category);
}

export function searchCheatSheet(query: string): CheatSheetItem[] {
  const lowerQuery = query.toLowerCase();
  return cheatSheetItems.filter(
    item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.syntax.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
  );
}
