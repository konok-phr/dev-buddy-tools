import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState("apple\nbanana\napple\ncherry\nbanana\ndate\napple\ncherry");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);

  const lines = input.split("\n");
  const seen = new Set<string>();
  const unique: string[] = [];
  const duplicates: string[] = [];

  for (const line of lines) {
    const key = trimLines ? line.trim() : line;
    const cmp = caseSensitive ? key : key.toLowerCase();
    if (!seen.has(cmp)) {
      seen.add(cmp);
      unique.push(key);
    } else {
      duplicates.push(key);
    }
  }

  const output = unique.join("\n");

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Remove Duplicate Lines" description="Remove duplicate lines from text, keep unique entries only" />
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button variant={caseSensitive ? "default" : "outline"} size="sm" onClick={() => setCaseSensitive(!caseSensitive)}>
          Case {caseSensitive ? "Sensitive" : "Insensitive"}
        </Button>
        <Button variant={trimLines ? "default" : "outline"} size="sm" onClick={() => setTrimLines(!trimLines)}>
          {trimLines ? "Trim" : "No Trim"}
        </Button>
        <div className="flex-1" />
        <Badge variant="secondary" className="text-xs">{lines.length} → {unique.length} lines</Badge>
        <Badge variant="outline" className="text-xs">{duplicates.length} removed</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">Input</h2>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm min-h-[300px]" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">Unique Lines</h2>
            <CopyButton text={output} />
          </div>
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap min-h-[300px] text-foreground">{output}</pre>
        </div>
      </div>
    </div>
  );
}
