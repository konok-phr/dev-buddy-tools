import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

export default function MarkdownToc() {
  const [md, setMd] = useState("# Introduction\n## Getting Started\n### Installation\n### Configuration\n## Usage\n### Basic\n### Advanced\n## FAQ");

  const toc = useMemo(() => {
    return md.split("\n")
      .filter(l => /^#{1,6}\s/.test(l))
      .map(l => {
        const match = l.match(/^(#{1,6})\s+(.+)/);
        if (!match) return "";
        const level = match[1].length;
        const text = match[2].trim();
        const slug = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        return `${"  ".repeat(level - 1)}- [${text}](#${slug})`;
      })
      .filter(Boolean)
      .join("\n");
  }, [md]);

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="Markdown TOC Generator" description="Generate a Table of Contents from Markdown headings" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Markdown Input</p>
          <Textarea value={md} onChange={e => setMd(e.target.value)} className="font-mono text-sm h-72" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <p className="text-xs text-muted-foreground">Table of Contents</p>
            <CopyButton text={toc} />
          </div>
          <Textarea value={toc} readOnly className="font-mono text-sm h-72" />
        </div>
      </div>
    </div>
  );
}
