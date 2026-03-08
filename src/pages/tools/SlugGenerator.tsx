import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function toSlug(text: string, separator: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, separator || "-");
}

export default function SlugGenerator() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const slug = toSlug(input, separator);

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Slug Generator" description="Convert text to URL-friendly slugs" />
      <div className="space-y-4">
        <div>
          <Label>Input Text</Label>
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="My Blog Post Title! — Special Chàracters Removed"
            rows={3}
            className="mt-1"
          />
        </div>
        <div className="flex items-center gap-3">
          <Label>Separator</Label>
          {["-", "_", "."].map(s => (
            <button
              key={s}
              onClick={() => setSeparator(s)}
              className={`px-3 py-1 rounded text-sm border ${separator === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {s === "-" ? "hyphen (-)" : s === "_" ? "underscore (_)" : "dot (.)"}
            </button>
          ))}
        </div>
        {slug && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <Label>Generated Slug</Label>
              <CopyButton text={slug} />
            </div>
            <code className="text-sm text-foreground break-all">{slug}</code>
          </div>
        )}
      </div>
    </div>
  );
}
