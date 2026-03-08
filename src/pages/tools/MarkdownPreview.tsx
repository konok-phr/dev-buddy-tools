import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ToolHeader } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

const defaultMd = `# Hello World

This is a **Markdown** preview tool.

## Features
- Live preview
- Supports *italic*, **bold**, and \`code\`
- Lists, links, and more

\`\`\`js
console.log("Hello!");
\`\`\`

> Blockquote example

[Visit DevTools Hub](/)
`;

export default function MarkdownPreview() {
  const [md, setMd] = useState(defaultMd);

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader title="Markdown Preview" description="Live markdown editor with side-by-side preview" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[400px]">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Markdown</label>
          <Textarea value={md} onChange={e => setMd(e.target.value)} className="font-mono text-sm bg-card h-[500px] resize-none" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Preview</label>
          <div className="markdown-preview bg-card border border-border rounded-md p-4 h-[500px] overflow-auto">
            <ReactMarkdown>{md}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
