import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function addLineNumbers(text: string, start: number, separator: string, padZero: boolean): string {
  const lines = text.split("\n");
  const maxNum = start + lines.length - 1;
  const width = padZero ? String(maxNum).length : 0;
  return lines.map((line, i) => {
    const num = String(start + i).padStart(width, "0");
    return `${num}${separator}${line}`;
  }).join("\n");
}

function removeLineNumbers(text: string): string {
  return text.split("\n").map(line => line.replace(/^\s*\d+[\s.:)\-|]+/, "")).join("\n");
}

export default function AddLineNumbers() {
  const [input, setInput] = useState("function hello() {\n  console.log('Hello');\n  return true;\n}\n\nhello();");
  const [start, setStart] = useState(1);
  const [separator, setSeparator] = useState(": ");
  const [padZero, setPadZero] = useState(true);
  const [mode, setMode] = useState<"add" | "remove">("add");

  const output = mode === "add" ? addLineNumbers(input, start, separator, padZero) : removeLineNumbers(input);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Add/Remove Line Numbers" description="Add or remove line numbers from text" />
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <Button variant={mode === "add" ? "default" : "outline"} size="sm" onClick={() => setMode("add")}>Add Numbers</Button>
        <Button variant={mode === "remove" ? "default" : "outline"} size="sm" onClick={() => setMode("remove")}>Remove Numbers</Button>
        {mode === "add" && (
          <>
            <div className="flex items-center gap-1">
              <label className="text-xs text-muted-foreground">Start:</label>
              <input type="number" value={start} onChange={e => setStart(Number(e.target.value))} className="w-14 h-7 px-1 text-xs font-mono rounded border border-border bg-background text-foreground" />
            </div>
            <div className="flex items-center gap-1">
              <label className="text-xs text-muted-foreground">Sep:</label>
              <input value={separator} onChange={e => setSeparator(e.target.value)} className="w-14 h-7 px-1 text-xs font-mono rounded border border-border bg-background text-foreground" />
            </div>
            <Button variant={padZero ? "default" : "outline"} size="sm" onClick={() => setPadZero(!padZero)}>Zero Pad</Button>
          </>
        )}
        <Badge variant="secondary" className="text-xs">{input.split("\n").length} lines</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">Input</h2>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm min-h-[250px]" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">Output</h2>
            <CopyButton text={output} />
          </div>
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap min-h-[250px] text-foreground">{output}</pre>
        </div>
      </div>
    </div>
  );
}
