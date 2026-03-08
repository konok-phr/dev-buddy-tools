import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const conversions = [
  { id: "upper", label: "UPPER CASE", fn: (s: string) => s.toUpperCase() },
  { id: "lower", label: "lower case", fn: (s: string) => s.toLowerCase() },
  { id: "title", label: "Title Case", fn: (s: string) => s.replace(/\w\S*/g, t => t[0].toUpperCase() + t.slice(1).toLowerCase()) },
  { id: "sentence", label: "Sentence case", fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()) },
  { id: "camel", label: "camelCase", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { id: "pascal", label: "PascalCase", fn: (s: string) => s.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, c) => c.toUpperCase()) },
  { id: "snake", label: "snake_case", fn: (s: string) => s.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[\s\-]+/g, "_").toLowerCase() },
  { id: "kebab", label: "kebab-case", fn: (s: string) => s.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase() },
  { id: "constant", label: "CONSTANT_CASE", fn: (s: string) => s.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[\s\-]+/g, "_").toUpperCase() },
  { id: "dot", label: "dot.case", fn: (s: string) => s.replace(/([a-z])([A-Z])/g, "$1.$2").replace(/[\s_\-]+/g, ".").toLowerCase() },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState("");

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Text Case Converter" description="Convert text between different cases" />
      <div className="space-y-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm bg-card min-h-[120px]" placeholder="Enter your text here..." />
        {input && (
          <div className="space-y-2">
            {conversions.map(c => {
              const result = c.fn(input);
              return (
                <div key={c.id} className="flex items-center justify-between rounded-md border border-border bg-card p-3">
                  <span className="text-xs text-muted-foreground w-36">{c.label}</span>
                  <code className="text-sm font-mono text-foreground flex-1 truncate">{result}</code>
                  <CopyButton text={result} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
