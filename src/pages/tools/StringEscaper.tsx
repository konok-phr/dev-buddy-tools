import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const escapes: { label: string; escape: (s: string) => string; unescape: (s: string) => string }[] = [
  {
    label: "JSON",
    escape: s => JSON.stringify(s),
    unescape: s => { try { return JSON.parse(s); } catch { return s; } },
  },
  {
    label: "JavaScript",
    escape: s => s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t"),
    unescape: s => s.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
  },
  {
    label: "HTML",
    escape: s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"),
    unescape: s => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
  },
  {
    label: "URL",
    escape: s => encodeURIComponent(s),
    unescape: s => { try { return decodeURIComponent(s); } catch { return s; } },
  },
  {
    label: "CSV",
    escape: s => `"${s.replace(/"/g, '""')}"`,
    unescape: s => s.replace(/^"|"$/g, "").replace(/""/g, '"'),
  },
];

export default function StringEscaper() {
  const [input, setInput] = useState('Hello "World"\nNew line & <special> chars');

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="String Escape/Unescape" description="Escape & unescape strings for JSON, JS, HTML, URL, CSV" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="bg-card text-sm font-mono min-h-[100px]" />
        </div>
        <div className="space-y-3">
          {escapes.map(esc => {
            const escaped = esc.escape(input);
            return (
              <div key={esc.label} className="border border-border rounded-lg p-3 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-muted-foreground font-medium">{esc.label}</label>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setInput(esc.unescape(input))}>Unescape</Button>
                    <CopyButton text={escaped} />
                  </div>
                </div>
                <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all text-foreground">{escaped}</pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
