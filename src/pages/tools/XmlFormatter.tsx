import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

function formatXml(xml: string, indent = "  "): string {
  let formatted = "";
  let pad = 0;
  const lines = xml.replace(/(>)(<)(\/*)/g, "$1\n$2$3").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.match(/^<\/\w/)) pad--;
    formatted += indent.repeat(Math.max(0, pad)) + trimmed + "\n";
    if (trimmed.match(/^<\w([^>]*[^/])?>.*$/) && !trimmed.match(/^<\w[^>]*\/>/)) {
      if (!trimmed.startsWith("<?") && !trimmed.startsWith("<!")) pad++;
    }
  }
  return formatted.trim();
}

function minifyXml(xml: string): string {
  return xml.replace(/>\s+</g, "><").replace(/\n/g, "").replace(/\s{2,}/g, " ").trim();
}

export default function XmlFormatter() {
  const [input, setInput] = useState(`<?xml version="1.0" encoding="UTF-8"?><catalog><book id="1"><title>Learn XML</title><author>John Doe</author><price>29.99</price></book><book id="2"><title>Advanced XML</title><author>Jane Smith</author><price>39.99</price></book></catalog>`);
  const [mode, setMode] = useState<"format" | "minify">("format");

  const output = useMemo(() => {
    try {
      return mode === "format" ? formatXml(input) : minifyXml(input);
    } catch {
      return "Invalid XML";
    }
  }, [input, mode]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="XML Formatter" description="Format and minify XML documents" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">XML Input</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-xs bg-card min-h-[150px]" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode("format")} className={`px-3 py-1.5 text-xs rounded-md border ${mode === "format" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"}`}>Format</button>
          <button onClick={() => setMode("minify")} className={`px-3 py-1.5 text-xs rounded-md border ${mode === "minify" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"}`}>Minify</button>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Output</label>
            <CopyButton text={output} />
          </div>
          <pre className="text-xs font-mono bg-card border border-border rounded p-3 overflow-x-auto whitespace-pre min-h-[150px]">{output}</pre>
        </div>
      </div>
    </div>
  );
}
