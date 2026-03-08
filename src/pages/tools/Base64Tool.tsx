import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => {
    try { setOutput(btoa(unescape(encodeURIComponent(input)))); setError(""); } catch (e: any) { setError(e.message); }
  };
  const decode = () => {
    try { setOutput(decodeURIComponent(escape(atob(input)))); setError(""); } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Base64 Encoder/Decoder" description="Encode or decode Base64 strings" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm bg-card min-h-[150px]" placeholder="Enter text or Base64 string..." />
        </div>
        <div className="flex gap-2">
          <Button onClick={encode}>Encode</Button>
          <Button variant="secondary" onClick={decode}>Decode</Button>
        </div>
        {error && <p className="text-destructive text-sm font-mono">{error}</p>}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <Textarea value={output} readOnly className="font-mono text-sm bg-card min-h-[150px]" />
        </div>
      </div>
    </div>
  );
}
