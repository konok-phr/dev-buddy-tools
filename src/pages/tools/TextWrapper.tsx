import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function wrapText(text: string, width: number): string {
  return text.split("\n").map(para => {
    const words = para.split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      if (line && (line.length + word.length + 1) > width) { lines.push(line); line = word; }
      else line = line ? `${line} ${word}` : word;
    }
    if (line) lines.push(line);
    return lines.join("\n");
  }).join("\n");
}

export default function TextWrapper() {
  const [text, setText] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
  const [width, setWidth] = useState(80);

  const output = useMemo(() => wrapText(text, width), [text, width]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Text Wrapper" description="Wrap text at a specific character width" />
      <div className="flex gap-3 items-end mb-4">
        <div><Label className="text-sm">Line width</Label><Input type="number" min={20} max={200} value={width} onChange={e => setWidth(+e.target.value)} className="w-24" /></div>
      </div>
      <Textarea value={text} onChange={e => setText(e.target.value)} className="h-32 font-mono text-sm mb-3" placeholder="Paste text..." />
      <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
      <Textarea value={output} readOnly className="h-32 font-mono text-sm" />
    </div>
  );
}
