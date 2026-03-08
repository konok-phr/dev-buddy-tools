import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="URL Encoder/Decoder" description="Encode or decode URL components" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm bg-card min-h-[120px]" placeholder="Enter text or encoded URL..." />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOutput(encodeURIComponent(input))}>Encode</Button>
          <Button variant="secondary" onClick={() => { try { setOutput(decodeURIComponent(input)); } catch { setOutput("Invalid encoded string"); } }}>Decode</Button>
          <Button variant="secondary" onClick={() => setOutput(encodeURI(input))}>Encode URI</Button>
          <Button variant="secondary" onClick={() => { try { setOutput(decodeURI(input)); } catch { setOutput("Invalid URI"); } }}>Decode URI</Button>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <Textarea value={output} readOnly className="font-mono text-sm bg-card min-h-[120px]" />
        </div>
      </div>
    </div>
  );
}
