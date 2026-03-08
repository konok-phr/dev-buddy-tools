import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function mdToHtml(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^---$/gm, "<hr />")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>\n${match}</ul>\n`)
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
  
  // Wrap bare lines as paragraphs
  html = html.split("\n\n").map(block => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    if (/^<(h[1-6]|ul|ol|li|blockquote|hr|pre|table)/.test(trimmed)) return trimmed;
    return `<p>${trimmed}</p>`;
  }).join("\n\n");

  return html;
}

export default function MarkdownToHtml() {
  const [input, setInput] = useState("# Hello World\n\nThis is **bold** and *italic* text.\n\n- Item one\n- Item two\n\n[Visit Google](https://google.com)\n\n> A blockquote\n\n---\n\nInline `code` here.");
  const output = useMemo(() => mdToHtml(input), [input]);

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="Markdown to HTML Converter" description="Convert Markdown text to clean HTML" />
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Markdown Input</Label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} rows={16} className="mt-1 font-mono text-sm" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>HTML Output</Label>
            <CopyButton text={output} />
          </div>
          <pre className="mt-1 p-3 bg-muted rounded-lg text-xs font-mono whitespace-pre-wrap max-h-[400px] overflow-auto">{output}</pre>
        </div>
      </div>
      <div className="mt-4">
        <Label>Preview</Label>
        <div className="mt-1 p-4 border border-border rounded-lg prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: output }} />
      </div>
    </div>
  );
}
