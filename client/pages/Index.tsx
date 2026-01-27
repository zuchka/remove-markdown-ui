import { useState } from "react";
import removeMd from "remove-markdown";
import { Sparkles, FileText, Copy, Check, Zap, ArrowRight } from "lucide-react";

const DEFAULT_MARKDOWN = `# Welcome to Remove Markdown

This is a **powerful** library that _strips_ markdown syntax from your text.

## Features

- Removes **bold** and *italic* formatting
- Strips [links](https://example.com) 
- Cleans up \`code blocks\`
- Handles ~~strikethrough~~ text
- Removes headers and lists

### Try It Out

Edit the markdown on the left to see the plain text output on the right!

> Blockquotes are also handled gracefully

\`\`\`javascript
// Even code blocks!
const demo = "This will be stripped";
\`\`\`

1. Ordered lists
2. Are converted
3. To plain text

---

**remove-markdown** makes it easy to extract clean text from markdown content.`;

export default function Index() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [copied, setCopied] = useState(false);

  const plainText = removeMd(markdown);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20">
      {/* Header */}
      <header className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Remove Markdown
              </h1>
              <p className="text-sm text-muted-foreground">
                Clean text extraction from markdown content
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Interactive Demo
              </h2>
              <p className="text-muted-foreground">
                This is a live demonstration of the{" "}
                <code className="px-2 py-0.5 bg-muted rounded text-sm font-mono text-primary">
                  remove-markdown
                </code>{" "}
                npm package. Edit the markdown on the left to instantly see the
                stripped output on the right. Perfect for extracting clean text
                from markdown content for search indexing, previews, or text
                analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Editor Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-3 text-sm font-medium text-foreground">
                  input.md
                </span>
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Markdown Input
              </label>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-[500px] p-4 bg-muted/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm resize-none"
                placeholder="Enter your markdown here..."
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-3 text-sm font-medium text-foreground">
                    output.txt
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Plain Text Output
              </label>
              <div className="w-full h-[500px] p-4 bg-muted/30 border border-input rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">
                {plainText || (
                  <span className="text-muted-foreground italic">
                    Output will appear here...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Lightning Fast
            </h3>
            <p className="text-muted-foreground text-sm">
              Instantly strips markdown syntax with minimal overhead, perfect
              for real-time applications.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Battle-Tested & Trusted
            </h3>
            <p className="text-muted-foreground text-sm">
              Over 10 years old with 2M+ downloads on NPM per month.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Simple API
            </h3>
            <p className="text-muted-foreground text-sm">
              Clean, straightforward interface with zero configuration required.
              Just import and use.
            </p>
          </div>
        </div>

        {/* Builder CTA Section */}
        <div className="mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-blue-600 opacity-5 blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 rounded-3xl border-2 border-primary/20 p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 mb-6 shadow-lg shadow-primary/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Built with Builder
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                This demo app was created in minutes using{" "}
                <span className="font-semibold text-primary">Builder</span> —
                the AI-powered platform that turns your ideas into
                production-ready code. No templates, no limitations, just pure
                creativity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://www.builder.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-semibold text-base group"
                >
                  Start Building for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://www.builder.io/c/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary/20 text-foreground rounded-xl hover:border-primary/40 transition-colors font-medium text-base"
                >
                  View Documentation
                </a>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>AI-Powered Development</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Production-Ready Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Deploy Anywhere</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Get Started
          </h2>
          <p className="text-muted-foreground mb-4">
            Install the library via npm, yarn, or pnpm:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <code className="text-sm font-mono text-foreground">
                npm install remove-markdown
              </code>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <code className="text-sm font-mono text-foreground">
                yarn add remove-markdown
              </code>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <code className="text-sm font-mono text-foreground">
                pnpm add remove-markdown
              </code>
            </div>
          </div>
          <div className="mt-6 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-4 border border-primary/20">
            <p className="text-sm font-mono text-foreground">
              <span className="text-muted-foreground">// Usage example</span>
              <br />
              <span className="text-primary">import</span> removeMd{" "}
              <span className="text-primary">from</span>{" "}
              <span className="text-green-600">'remove-markdown'</span>;
              <br />
              <span className="text-primary">const</span> plainText = removeMd(
              <span className="text-green-600">'**markdown** text'</span>);
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Demo app for the{" "}
              <a
                href="https://www.npmjs.com/package/remove-markdown"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                remove-markdown
              </a>{" "}
              npm package
            </p>
            <a
              href="https://www.npmjs.com/package/remove-markdown"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
              </svg>
              View on NPM
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Builder Badge */}
      <a
        href="https://www.builder.io"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-3 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-105">
          <Zap className="w-4 h-4" />
          <span className="font-semibold text-sm">Built with Builder</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </a>
    </div>
  );
}
