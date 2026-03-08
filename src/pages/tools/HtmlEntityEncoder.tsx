import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function encodeHtmlEntities(str: string): string {
  return str.replace(/[\u00A0-\u9999<>&'"]/g, c => `&#${c.charCodeAt(0)};`);
}

function decodeHtmlEntities(str: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
}

export default function HtmlEntityEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="HTML Entity Encoder" description="Encode or decode HTML entities" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm bg-card min-h-[150px]" placeholder='<div class="hello">Hello & World</div>' />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOutput(encodeHtmlEntities(input))}>Encode</Button>
          <Button variant="secondary" onClick={() => setOutput(decodeHtmlEntities(input))}>Decode</Button>
        </div>
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
