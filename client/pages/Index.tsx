import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import removeMd from "remove-markdown";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Settings2,
  ChevronDown,
  Code2,
  RotateCcw,
  List,
  Link,
  Image,
  Hash,
  Eye,
  EyeOff,
  Edit,
  FileCode,
  Share2
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_MARKDOWN = `# Welcome to Remove Markdown! 🎉

This is a **powerful** library that _strips_ markdown syntax from your text while preserving readability.

## 🎯 Test Different Options

Toggle the **Configuration Options** below to see how each flag transforms this content!

### 📝 Lists (stripListLeaders & listUnicodeChar)

Unordered lists with different markers:
* First item with asterisk
- Second item with dash
+ Third item with plus

Ordered lists:
1. First ordered item
2. Second ordered item
3. Third ordered item

### 🔗 Links (replaceLinksWithURL & separateLinksAndTexts)

Try toggling link options:
- Visit the [official documentation](https://github.com/stiang/remove-markdown)
- Check out [NPM package](https://www.npmjs.com/package/remove-markdown)
- Read more on [Builder.io](https://www.builder.io)

### 🖼️ Images (useImgAltText)

Toggle to show/hide alt text:
![Beautiful landscape photo](landscape.jpg "Mountain view")
![Developer coding](coder.jpg)

### 💻 Code Examples

Inline code like \`const x = 42\` and \`npm install\` stays readable.

\`\`\`javascript
// Configuration example - try the options below!
import removeMd from 'remove-markdown';

const options = {
  stripListLeaders: true,
  gfm: true,
  useImgAltText: true
};

const result = removeMd(markdown, options);
console.log('Clean text:', result);
\`\`\`

### 🎨 GFM Features (gfm flag)

~~Strikethrough text~~ requires GFM support to be removed.

| Table | Support |
|-------|---------|
| GFM   | Yes     |

### 📌 HTML Tags (htmlTagsToSkip)

This has <strong>HTML bold</strong> and <em>HTML italic</em>.
Try adding "strong,em" to skip these tags!

### 🔤 Abbreviations (abbr flag)

*[HTML]: HyperText Markup Language
*[GFM]: GitHub Flavored Markdown
*[API]: Application Programming Interface

The HTML, GFM, and API abbreviations can be toggled with the abbr option.

---

> **Pro Tip**: Use the "Copy Code" button to get the exact configuration for your use case!

Made with ❤️ by the **remove-markdown** community.`;

// Default options matching the library defaults
const DEFAULT_OPTIONS = {
  stripListLeaders: true,
  listUnicodeChar: '',
  gfm: true,
  useImgAltText: true,
  abbr: false,
  replaceLinksWithURL: false,
  separateLinksAndTexts: '',
  htmlTagsToSkip: [] as string[],
};

type RemoveMarkdownOptions = typeof DEFAULT_OPTIONS;

export default function Index() {
  const { id } = useParams();
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(true);
  const [showDiff, setShowDiff] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [options, setOptions] = useState<RemoveMarkdownOptions>(DEFAULT_OPTIONS);
  const [htmlTagsInput, setHtmlTagsInput] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isLoadingShare, setIsLoadingShare] = useState(false);
  const { toast } = useToast();

  // Load shared content if ID is present
  useEffect(() => {
    if (id) {
      setIsLoadingShare(true);
      fetch(`/api/share/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Share not found');
          }
          return res.json();
        })
        .then((data) => {
          setMarkdown(data.markdown);
          setOptions(data.options);
          // Update HTML tags input if present
          if (data.options.htmlTagsToSkip?.length > 0) {
            setHtmlTagsInput(data.options.htmlTagsToSkip.join(','));
          }
          toast({
            title: "Shared content loaded",
            description: "You're viewing a shared markdown setup.",
          });
        })
        .catch((error) => {
          console.error('Error loading share:', error);
          toast({
            title: "Share not found",
            description: "The shared link could not be found or has expired.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoadingShare(false);
        });
    }
  }, [id]);

  // Parse URL parameters on mount (only if not loading a share)
  useEffect(() => {
    if (id) return; // Skip if loading a share

    const params = new URLSearchParams(window.location.search);
    const urlOptions: Partial<RemoveMarkdownOptions> = {};

    if (params.has('sl')) urlOptions.stripListLeaders = params.get('sl') === '1';
    if (params.has('luc')) urlOptions.listUnicodeChar = params.get('luc') || '';
    if (params.has('gfm')) urlOptions.gfm = params.get('gfm') === '1';
    if (params.has('img')) urlOptions.useImgAltText = params.get('img') === '1';
    if (params.has('abbr')) urlOptions.abbr = params.get('abbr') === '1';
    if (params.has('url')) urlOptions.replaceLinksWithURL = params.get('url') === '1';
    if (params.has('sep')) urlOptions.separateLinksAndTexts = params.get('sep') || '';
    if (params.has('skip')) {
      const tags = params.get('skip');
      if (tags) {
        urlOptions.htmlTagsToSkip = tags.split(',').filter(t => t.trim());
        setHtmlTagsInput(tags);
      }
    }

    if (Object.keys(urlOptions).length > 0) {
      setOptions({ ...DEFAULT_OPTIONS, ...urlOptions });
    }
  }, [id]);

  // Update URL parameters when options change (skip if viewing shared link)
  useEffect(() => {
    if (id) return; // Don't update URL when viewing a shared link

    const params = new URLSearchParams();

    if (options.stripListLeaders !== DEFAULT_OPTIONS.stripListLeaders)
      params.set('sl', options.stripListLeaders ? '1' : '0');
    if (options.listUnicodeChar)
      params.set('luc', options.listUnicodeChar);
    if (options.gfm !== DEFAULT_OPTIONS.gfm)
      params.set('gfm', options.gfm ? '1' : '0');
    if (options.useImgAltText !== DEFAULT_OPTIONS.useImgAltText)
      params.set('img', options.useImgAltText ? '1' : '0');
    if (options.abbr !== DEFAULT_OPTIONS.abbr)
      params.set('abbr', options.abbr ? '1' : '0');
    if (options.replaceLinksWithURL !== DEFAULT_OPTIONS.replaceLinksWithURL)
      params.set('url', options.replaceLinksWithURL ? '1' : '0');
    if (options.separateLinksAndTexts)
      params.set('sep', options.separateLinksAndTexts);
    if (options.htmlTagsToSkip.length > 0)
      params.set('skip', options.htmlTagsToSkip.join(','));

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [options, id]);

  const plainText = removeMd(markdown, {
    ...options,
    htmlTagsToSkip: options.htmlTagsToSkip.length > 0 ? options.htmlTagsToSkip : undefined,
  } as any);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = async () => {
    const code = generateCodeSnippet();
    await navigator.clipboard.writeText(code);
    setCodeCopied(true);
    toast({
      title: "Code copied!",
      description: "The code snippet has been copied to your clipboard.",
    });
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const generateCodeSnippet = () => {
    const optionsCode: string[] = [];
    
    if (options.stripListLeaders !== DEFAULT_OPTIONS.stripListLeaders) {
      optionsCode.push(`  stripListLeaders: ${options.stripListLeaders}`);
    }
    if (options.listUnicodeChar) {
      optionsCode.push(`  listUnicodeChar: '${options.listUnicodeChar}'`);
    }
    if (options.gfm !== DEFAULT_OPTIONS.gfm) {
      optionsCode.push(`  gfm: ${options.gfm}`);
    }
    if (options.useImgAltText !== DEFAULT_OPTIONS.useImgAltText) {
      optionsCode.push(`  useImgAltText: ${options.useImgAltText}`);
    }
    if (options.abbr !== DEFAULT_OPTIONS.abbr) {
      optionsCode.push(`  abbr: ${options.abbr}`);
    }
    if (options.replaceLinksWithURL !== DEFAULT_OPTIONS.replaceLinksWithURL) {
      optionsCode.push(`  replaceLinksWithURL: ${options.replaceLinksWithURL}`);
    }
    if (options.separateLinksAndTexts) {
      optionsCode.push(`  separateLinksAndTexts: '${options.separateLinksAndTexts}'`);
    }
    if (options.htmlTagsToSkip.length > 0) {
      optionsCode.push(`  htmlTagsToSkip: [${options.htmlTagsToSkip.map(t => `'${t}'`).join(', ')}]`);
    }

    if (optionsCode.length === 0) {
      return `import removeMd from 'remove-markdown';\n\nconst plainText = removeMd(markdown);`;
    }

    return `import removeMd from 'remove-markdown';\n\nconst plainText = removeMd(markdown, {\n${optionsCode.join(',\n')}\n});`;
  };

  const handleResetOptions = () => {
    setOptions(DEFAULT_OPTIONS);
    setHtmlTagsInput('');
    toast({
      title: "Options reset",
      description: "All options have been reset to their default values.",
    });
  };

  const handleHtmlTagsChange = (value: string) => {
    setHtmlTagsInput(value);
    const tags = value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    setOptions({ ...options, htmlTagsToSkip: tags });
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markdown,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create share');
      }

      const data = await response.json();
      const fullUrl = `${window.location.origin}${data.shortUrl}`;
      setShareUrl(fullUrl);

      // Copy to clipboard
      await navigator.clipboard.writeText(fullUrl);

      toast({
        title: "Link copied!",
        description: "The shareable link has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Error creating share:', error);
      toast({
        title: "Share failed",
        description: "Failed to create shareable link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const renderDiffView = () => {
    const lines = markdown.split('\n');
    const outputLines = plainText.split('\n');
    
    return (
      <div className="space-y-1">
        {lines.map((line, i) => {
          const output = outputLines[i] || '';
          const changed = line !== output;
          
          return (
            <div key={i} className="font-mono text-sm">
              {changed ? (
                <div className="space-y-0.5">
                  <div className="text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    <span className="text-red-400 mr-2">-</span>
                    {line}
                  </div>
                  <div className="text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    <span className="text-green-400 mr-2">+</span>
                    {output}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground px-2 py-0.5">
                  <span className="mr-2"> </span>
                  {line}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20">
      {/* Header */}
      <header className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Remove Markdown
                </h1>
                <p className="text-sm text-muted-foreground">
                  Official website for the remove-markdown library
                </p>
              </div>
            </div>
            <a
              href="#get-started"
              className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">
                This is a live demo of{" "}
                <code className="px-2 py-0.5 bg-muted rounded text-sm font-mono text-primary">
                  remove-markdown
                </code>
                , one of the oldest and most trusted markdown parsers in
                JavaScript.
              </p>
            </div>
          </div>
        </div>

        {/* Options Panel */}
        <Collapsible open={optionsOpen} onOpenChange={setOptionsOpen} className="mb-6">
          <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-4 bg-gradient-to-r from-primary/5 to-purple-500/5 border-b border-border hover:from-primary/10 hover:to-purple-500/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-foreground">
                      Configuration Options
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Customize how markdown is processed
                    </p>
                  </div>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    optionsOpen ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-4 space-y-3">
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-xs font-medium"
                  >
                    {codeCopied ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Code2 className="w-3 h-3" />
                        Copy Code
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleResetOptions}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors text-xs font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                  <button
                    onClick={() => setShowDiff(!showDiff)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors text-xs font-medium"
                  >
                    {showDiff ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Hide Diff
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        Diff
                      </>
                    )}
                  </button>
                </div>

                {/* All Options in Compact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {/* Strip List Leaders */}
                  <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-md border border-border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="stripListLeaders" className="cursor-help text-xs font-medium">
                          Strip List Leaders
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove list markers (*, -, +, numbers)</p>
                      </TooltipContent>
                    </Tooltip>
                    <Switch
                      id="stripListLeaders"
                      checked={options.stripListLeaders}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, stripListLeaders: checked })
                      }
                    />
                  </div>

                  {/* GFM */}
                  <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-md border border-border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="gfm" className="cursor-help text-xs font-medium">
                          GFM Support
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>GitHub Flavored Markdown (strikethrough, tables)</p>
                      </TooltipContent>
                    </Tooltip>
                    <Switch
                      id="gfm"
                      checked={options.gfm}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, gfm: checked })
                      }
                    />
                  </div>

                  {/* Use Image Alt Text */}
                  <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-md border border-border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="useImgAltText" className="cursor-help text-xs font-medium">
                          Use Image Alt Text
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Replace images with their alt text</p>
                      </TooltipContent>
                    </Tooltip>
                    <Switch
                      id="useImgAltText"
                      checked={options.useImgAltText}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, useImgAltText: checked })
                      }
                    />
                  </div>

                  {/* Remove Abbreviations */}
                  <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-md border border-border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="abbr" className="cursor-help text-xs font-medium">
                          Remove Abbreviations
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Strip abbreviation definitions (*[ABBR]: ...)</p>
                      </TooltipContent>
                    </Tooltip>
                    <Switch
                      id="abbr"
                      checked={options.abbr}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, abbr: checked })
                      }
                    />
                  </div>

                  {/* Replace Links with URL */}
                  <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-md border border-border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="replaceLinksWithURL" className="cursor-help text-xs font-medium">
                          Replace Links with URL
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Show only the URL instead of link text</p>
                      </TooltipContent>
                    </Tooltip>
                    <Switch
                      id="replaceLinksWithURL"
                      checked={options.replaceLinksWithURL}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, replaceLinksWithURL: checked })
                      }
                    />
                  </div>

                  {/* List Unicode Char */}
                  <div className="px-3 py-2 bg-muted/30 rounded-md border border-border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="listUnicodeChar" className="cursor-help text-xs font-medium block mb-1">
                          List Unicode Char
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Character to insert instead of list markers</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="listUnicodeChar"
                      value={options.listUnicodeChar}
                      onChange={(e) =>
                        setOptions({ ...options, listUnicodeChar: e.target.value })
                      }
                      placeholder="→ or •"
                      className="h-7 text-xs"
                    />
                  </div>

                  {/* Link Separator */}
                  <div className="px-3 py-2 bg-muted/30 rounded-md border border-border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="separateLinksAndTexts" className="cursor-help text-xs font-medium block mb-1">
                          Link Separator
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Separator between link text and URL</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="separateLinksAndTexts"
                      value={options.separateLinksAndTexts}
                      onChange={(e) =>
                        setOptions({ ...options, separateLinksAndTexts: e.target.value })
                      }
                      placeholder=": or -"
                      className="h-7 text-xs"
                      disabled={options.replaceLinksWithURL}
                    />
                  </div>

                  {/* HTML Tags to Skip */}
                  <div className="px-3 py-2 bg-muted/30 rounded-md border border-border md:col-span-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="htmlTagsToSkip" className="cursor-help text-xs font-medium block mb-1">
                          HTML Tags to Skip
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Comma-separated tags (e.g., a, b, img)</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="htmlTagsToSkip"
                      value={htmlTagsInput}
                      onChange={(e) => handleHtmlTagsChange(e.target.value)}
                      placeholder="e.g., a, b, img"
                      className="h-7 text-xs"
                    />
                    {options.htmlTagsToSkip.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {options.htmlTagsToSkip.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs py-0 px-1.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Editor Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-3 text-sm font-medium text-foreground">
                    input.md
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      !showPreview
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      showPreview
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    Preview
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                {showPreview ? 'Markdown Preview' : 'Markdown Input'}
              </label>
              {!showPreview ? (
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="w-full h-[500px] p-4 bg-muted/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm resize-none"
                  placeholder="Enter your markdown here..."
                />
              ) : (
                <div className="w-full h-[500px] p-4 bg-muted/30 border border-input rounded-xl overflow-auto prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdown}
                  </ReactMarkdown>
                </div>
              )}
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
                    {showDiff ? 'diff.txt' : 'output.txt'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSharing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </>
                    )}
                  </button>
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
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                {showDiff ? 'Diff View' : 'Plain Text Output'}
              </label>
              <div className="w-full h-[500px] p-4 bg-muted/30 border border-input rounded-xl overflow-auto">
                {showDiff ? (
                  renderDiffView()
                ) : (
                  <div className="font-mono text-sm whitespace-pre-wrap">
                    {plainText || (
                      <span className="text-muted-foreground italic">
                        Output will appear here...
                      </span>
                    )}
                  </div>
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
                Made with Builder
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
                  href="https://www.builder.io?utm_source=tool&utm_content=ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-semibold text-base group"
                >
                  Start Building for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://www.builder.io/c/docs?utm_source=tool&utm_content=ma"
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
        <div
          id="get-started"
          className="mt-12 bg-white rounded-2xl p-8 border border-border shadow-sm"
        >
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
              Official website for the{" "}
              <a
                href="https://www.npmjs.com/package/remove-markdown"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                remove-markdown
              </a>{" "}
              library — one of the oldest and most trusted markdown parsers in
              JavaScript
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/stiang/remove-markdown"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 text-foreground border border-border rounded-lg hover:bg-muted transition-colors font-medium text-sm"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/remove-markdown"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
                </svg>
                NPM
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Builder Badge */}
      <a
        href="https://www.builder.io?utm_source=tool&utm_content=ma"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-3 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-105">
          <Zap className="w-4 h-4" />
          <span className="font-semibold text-sm">Made with Builder</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </a>
    </div>
  );
}
