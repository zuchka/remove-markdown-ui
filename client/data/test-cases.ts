export interface TestCase {
  id: string;
  title: string;
  description: string;
  category: string;
  markdown: string;
  tags: string[];
  difficulty?: 'basic' | 'intermediate' | 'advanced';
}

export const testCases: TestCase[] = [
  // Basic Syntax
  {
    id: 'headings-atx',
    title: 'ATX Headings',
    description: 'Standard heading syntax with # symbols',
    category: 'Basic Syntax',
    difficulty: 'basic',
    tags: ['headings', 'atx'],
    markdown: `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`,
  },
  {
    id: 'headings-setext',
    title: 'Setext Headings',
    description: 'Alternative heading syntax with underlines',
    category: 'Basic Syntax',
    difficulty: 'basic',
    tags: ['headings', 'setext'],
    markdown: `Heading 1
=========

Heading 2
---------`,
  },
  {
    id: 'emphasis',
    title: 'Emphasis and Strong',
    description: 'Italic, bold, and combined emphasis',
    category: 'Basic Syntax',
    difficulty: 'basic',
    tags: ['emphasis', 'bold', 'italic'],
    markdown: `*italic text* or _italic text_
**bold text** or __bold text__
***bold and italic*** or ___bold and italic___
**bold with _nested italic_**
*italic with **nested bold***`,
  },
  {
    id: 'lists-unordered',
    title: 'Unordered Lists',
    description: 'Lists with *, -, and + markers',
    category: 'Basic Syntax',
    difficulty: 'basic',
    tags: ['lists', 'unordered'],
    markdown: `* Item 1
* Item 2
  * Nested item 2.1
  * Nested item 2.2
* Item 3

- Item with dash
- Another item

+ Item with plus
+ Another item`,
  },
  {
    id: 'lists-ordered',
    title: 'Ordered Lists',
    description: 'Numbered lists with various numbering',
    category: 'Basic Syntax',
    difficulty: 'basic',
    tags: ['lists', 'ordered'],
    markdown: `1. First item
2. Second item
3. Third item
   1. Nested item 3.1
   2. Nested item 3.2
4. Fourth item

1. All items numbered 1
1. Still works correctly
1. Auto-increments`,
  },
  {
    id: 'links',
    title: 'Links',
    description: 'Inline and reference-style links',
    category: 'Basic Syntax',
    difficulty: 'basic',
    tags: ['links'],
    markdown: `[Inline link](https://www.example.com)
[Link with title](https://www.example.com "Example Domain")
[Reference link][ref]
[Link to heading](#headings)

[ref]: https://www.reference.com "Reference URL"

Autolink: <https://www.autolink.com>`,
  },
  {
    id: 'images',
    title: 'Images',
    description: 'Image syntax with alt text and titles',
    category: 'Basic Syntax',
    difficulty: 'basic',
    tags: ['images'],
    markdown: `![Alt text](https://via.placeholder.com/150)
![Alt text with title](https://via.placeholder.com/150 "Image Title")
![Reference-style image][img-ref]

[img-ref]: https://via.placeholder.com/200 "Reference Image"`,
  },
  {
    id: 'code-inline',
    title: 'Inline Code',
    description: 'Code within text using backticks',
    category: 'Basic Syntax',
    difficulty: 'basic',
    tags: ['code', 'inline'],
    markdown: `Use \`const x = 42\` for inline code.
Code with backticks: \`\`code with \` backtick\`\`
Use \`npm install\` to install packages.`,
  },
  {
    id: 'code-blocks',
    title: 'Code Blocks',
    description: 'Fenced and indented code blocks',
    category: 'Basic Syntax',
    difficulty: 'basic',
    tags: ['code', 'blocks'],
    markdown: `\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

\`\`\`python
def hello():
    print("Hello, world!")
\`\`\`

Indented code block:

    const x = 42;
    console.log(x);`,
  },
  {
    id: 'blockquotes',
    title: 'Blockquotes',
    description: 'Quoted text with nesting',
    category: 'Basic Syntax',
    difficulty: 'basic',
    tags: ['blockquotes'],
    markdown: `> This is a blockquote.
> It can span multiple lines.

> Blockquote with **formatting**
> and multiple paragraphs.
>
> Second paragraph in quote.

> Nested blockquotes:
> > Nested level 1
> > > Nested level 2`,
  },
  {
    id: 'horizontal-rules',
    title: 'Horizontal Rules',
    description: 'Different ways to create horizontal lines',
    category: 'Basic Syntax',
    difficulty: 'basic',
    tags: ['hr', 'thematic-break'],
    markdown: `Above the line

---

Between lines

***

Below the line

___`,
  },

  // GFM Extensions
  {
    id: 'strikethrough',
    title: 'Strikethrough (GFM)',
    description: 'Strike through text using ~~',
    category: 'GFM Extensions',
    difficulty: 'basic',
    tags: ['gfm', 'strikethrough'],
    markdown: `~~Strikethrough text~~
This is ~~deleted~~ text.
~~Multiple~~ ~~strikethroughs~~ in a line.`,
  },
  {
    id: 'tables',
    title: 'Tables (GFM)',
    description: 'GitHub Flavored Markdown tables',
    category: 'GFM Extensions',
    difficulty: 'intermediate',
    tags: ['gfm', 'tables'],
    markdown: `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

| Left | Center | Right |
|:-----|:------:|------:|
| L1   | C1     | R1    |
| L2   | C2     | R2    |`,
  },
  {
    id: 'task-lists',
    title: 'Task Lists (GFM)',
    description: 'Checkbox task lists',
    category: 'GFM Extensions',
    difficulty: 'basic',
    tags: ['gfm', 'tasks', 'lists'],
    markdown: `- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
  - [ ] Nested incomplete
  - [x] Nested complete`,
  },
  {
    id: 'autolinks',
    title: 'Autolinks (GFM)',
    description: 'Automatic linking of URLs and emails',
    category: 'GFM Extensions',
    difficulty: 'basic',
    tags: ['gfm', 'links', 'autolinks'],
    markdown: `Visit https://www.example.com for more info.
Email me at user@example.com
GitHub repo: https://github.com/user/repo`,
  },

  // Edge Cases
  {
    id: 'nested-structures',
    title: 'Complex Nesting',
    description: 'Lists with nested blockquotes and code',
    category: 'Edge Cases',
    difficulty: 'advanced',
    tags: ['nesting', 'complex'],
    markdown: `1. First item
   > Blockquote in list
   > 
   > Second paragraph
   
2. Second item with code:
   \`\`\`javascript
   const x = 42;
   \`\`\`

3. Third item
   * Nested list
   * With items
     * And deeper nesting`,
  },
  {
    id: 'escaping',
    title: 'Escaping Special Characters',
    description: 'Using backslash to escape markdown syntax',
    category: 'Edge Cases',
    difficulty: 'intermediate',
    tags: ['escaping', 'special-chars'],
    markdown: `\\* Not a list item
\\# Not a heading
\\[Not a link\\](url)
Literal asterisks: \\*\\*not bold\\*\\*
Backslash: \\\\`,
  },
  {
    id: 'html-inline',
    title: 'Inline HTML',
    description: 'Mixing HTML within markdown',
    category: 'Edge Cases',
    difficulty: 'intermediate',
    tags: ['html', 'mixed'],
    markdown: `This is <strong>HTML bold</strong> and **markdown bold**.
<em>HTML italic</em> and *markdown italic*.

<div class="custom">
  HTML block element
</div>

Inline <code>HTML code</code> and \`markdown code\`.`,
  },
  {
    id: 'unicode',
    title: 'Unicode and Emoji',
    description: 'Handling special Unicode characters',
    category: 'Edge Cases',
    difficulty: 'basic',
    tags: ['unicode', 'emoji'],
    markdown: `Emoji: 🎉 🚀 ✨ 💻 🔥
Unicode: © ™ ® → ← ↑ ↓
Japanese: こんにちは
Math: π ≈ 3.14159
Arrows: ⇒ ⇐ ⇔`,
  },
  {
    id: 'empty-elements',
    title: 'Empty Elements',
    description: 'Edge case with empty markdown elements',
    category: 'Edge Cases',
    difficulty: 'intermediate',
    tags: ['edge-case', 'empty'],
    markdown: `**

__

[]()

![](image.jpg)

>

\`\`\`
\`\`\``,
  },

  // Real-world Examples
  {
    id: 'blog-post',
    title: 'Blog Post',
    description: 'Realistic blog post with various elements',
    category: 'Real-world',
    difficulty: 'intermediate',
    tags: ['example', 'blog'],
    markdown: `# Getting Started with Markdown

Published on **2024-01-15** by *John Doe*

## Introduction

Markdown is a lightweight markup language that's easy to read and write. It's widely used for:

* Documentation
* README files
* Blog posts
* Technical writing

## Basic Syntax

Here's a quick example:

\`\`\`markdown
**Bold text**
*Italic text*
[Link](url)
\`\`\`

> **Tip**: Practice makes perfect!

## Conclusion

Start using Markdown today! Visit [Markdown Guide](https://www.markdownguide.org) to learn more.`,
  },
  {
    id: 'readme',
    title: 'GitHub README',
    description: 'Typical project README structure',
    category: 'Real-world',
    difficulty: 'intermediate',
    tags: ['github', 'readme', 'example'],
    markdown: `# Project Name

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/package.svg)](https://npmjs.com/package)

A brief description of your project.

## Features

* ✨ Feature 1
* 🚀 Feature 2
* 💻 Feature 3

## Installation

\`\`\`bash
npm install package-name
\`\`\`

## Usage

\`\`\`javascript
const pkg = require('package-name');
pkg.doSomething();
\`\`\`

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT © 2024`,
  },
];

export const categories = Array.from(new Set(testCases.map(tc => tc.category)));

export function getTestCasesByCategory(category: string): TestCase[] {
  return testCases.filter(tc => tc.category === category);
}

export function getTestCaseById(id: string): TestCase | undefined {
  return testCases.find(tc => tc.id === id);
}

export function searchTestCases(query: string): TestCase[] {
  const lowerQuery = query.toLowerCase();
  return testCases.filter(
    tc =>
      tc.title.toLowerCase().includes(lowerQuery) ||
      tc.description.toLowerCase().includes(lowerQuery) ||
      tc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
