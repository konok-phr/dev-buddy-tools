import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SortMode = "alpha-asc" | "alpha-desc" | "length-asc" | "length-desc" | "numeric" | "random" | "reverse";

const MODES: { id: SortMode; label: string }[] = [
  { id: "alpha-asc", label: "A → Z" },
  { id: "alpha-desc", label: "Z → A" },
  { id: "length-asc", label: "Short → Long" },
  { id: "length-desc", label: "Long → Short" },
  { id: "numeric", label: "Numeric" },
  { id: "random", label: "Shuffle" },
  { id: "reverse", label: "Reverse" },
];

function sortLines(text: string, mode: SortMode, caseSensitive: boolean): string {
  const lines = text.split("\n");
  const cmp = (a: string, b: string) => caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase());

  switch (mode) {
    case "alpha-asc": return [...lines].sort(cmp).join("\n");
    case "alpha-desc": return [...lines].sort((a, b) => cmp(b, a)).join("\n");
    case "length-asc": return [...lines].sort((a, b) => a.length - b.length).join("\n");
    case "length-desc": return [...lines].sort((a, b) => b.length - a.length).join("\n");
    case "numeric": return [...lines].sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)).join("\n");
    case "random": return [...lines].sort(() => Math.random() - 0.5).join("\n");
    case "reverse": return [...lines].reverse().join("\n");
    default: return text;
  }
}

export default function SortLines() {
  const [input, setInput] = useState("banana\napple\ncherry\ndate\nelderberry\nfig\ngrape");
  const [mode, setMode] = useState<SortMode>("alpha-asc");
  const [caseSensitive, setCaseSensitive] = useState(false);

  const output = sortLines(input, mode, caseSensitive);
  const lineCount = input.split("\n").length;

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Sort Lines" description="Sort text lines alphabetically, by length, numerically, shuffle or reverse" />
      <div className="flex gap-2 mb-4 flex-wrap">
        {MODES.map(m => (
          <Button key={m.id} variant={mode === m.id ? "default" : "outline"} size="sm" onClick={() => setMode(m.id)}>{m.label}</Button>
        ))}
        <Button variant={caseSensitive ? "default" : "outline"} size="sm" onClick={() => setCaseSensitive(!caseSensitive)}>
          Aa
        </Button>
        <Badge variant="secondary" className="text-xs self-center">{lineCount} lines</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">Input</h2>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm min-h-[300px]" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">Sorted</h2>
            <CopyButton text={output} />
          </div>
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap min-h-[300px] text-foreground">{output}</pre>
        </div>
      </div>
    </div>
  );
}
