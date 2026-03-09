import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function reverseText(text: string): string { return text.split("").reverse().join(""); }
function reverseWords(text: string): string { return text.split(" ").reverse().join(" "); }
function reverseLines(text: string): string { return text.split("\n").reverse().join("\n"); }
function reverseEachWord(text: string): string { return text.split(" ").map(w => w.split("").reverse().join("")).join(" "); }

const modes = [
  { id: "chars", label: "Reverse Characters", fn: reverseText },
  { id: "words", label: "Reverse Words", fn: reverseWords },
  { id: "lines", label: "Reverse Lines", fn: reverseLines },
  { id: "each", label: "Reverse Each Word", fn: reverseEachWord },
];

export default function TextReverser() {
  const [input, setInput] = useState("Hello World\nThis is a test\nReverse me!");
  const [mode, setMode] = useState("chars");
  const current = modes.find(m => m.id === mode)!;
  const output = current.fn(input);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Text Reverser" description="Reverse text by characters, words, lines or each word individually" />
      <div className="flex gap-2 mb-4 flex-wrap">
        {modes.map(m => (
          <Button key={m.id} variant={mode === m.id ? "default" : "outline"} size="sm" onClick={() => setMode(m.id)}>{m.label}</Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">Input</h2>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm min-h-[250px]" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">Reversed</h2>
            <CopyButton text={output} />
          </div>
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap min-h-[250px] text-foreground">{output}</pre>
        </div>
      </div>
    </div>
  );
}
