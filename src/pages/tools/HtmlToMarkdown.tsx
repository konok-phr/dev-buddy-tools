import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

function htmlToMd(html: string): string {
  let md = html;
  md = md.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (_, l, t) => "#".repeat(Number(l)) + " " + t.trim() + "\n\n");
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");
  md = md.replace(/<br\s*\/?>/gi, "  \n");
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (_, c) => c.trim().split("\n").map((l: string) => "> " + l.trim()).join("\n") + "\n\n");
  md = md.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, "```\n$1\n```\n\n");
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gis, "```\n$1\n```\n\n");
  md = md.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (_, items) => items.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n").trim() + "\n\n");
  md = md.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (_, items) => { let i = 0; return items.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${++i}. ` + "$1\n").trim() + "\n\n"; });
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gis, "$1\n\n");
  md = md.replace(/<\/?div[^>]*>/gi, "\n");
  md = md.replace(/<\/?span[^>]*>/gi, "");
  md = md.replace(/<[^>]+>/g, "");
  md = md.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  return md;
}

export default function HtmlToMarkdown() {
  const [html, setHtml] = useState(`<h1>Hello World</h1>\n<p>This is a <strong>bold</strong> and <em>italic</em> paragraph.</p>\n<ul>\n  <li>Item one</li>\n  <li>Item two</li>\n</ul>\n<a href="https://example.com">Visit Example</a>\n<blockquote>A wise quote</blockquote>\n<pre><code>const x = 42;</code></pre>`);
  const md = htmlToMd(html);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="HTML to Markdown" description="Convert HTML markup to clean Markdown syntax" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">HTML</h2>
          <Textarea value={html} onChange={e => setHtml(e.target.value)} className="font-mono text-sm min-h-[300px]" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">Markdown</h2>
            <CopyButton text={md} />
          </div>
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap min-h-[300px] text-foreground">{md}</pre>
        </div>
      </div>
    </div>
  );
}
