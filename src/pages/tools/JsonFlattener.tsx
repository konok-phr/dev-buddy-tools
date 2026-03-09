import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function flatten(obj: any, prefix = "", res: Record<string, any> = {}): Record<string, any> {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, res);
    else res[key] = v;
  }
  return res;
}

function unflatten(obj: Record<string, any>): any {
  const res: any = {};
  for (const [k, v] of Object.entries(obj)) {
    const keys = k.split(".");
    let cur = res;
    keys.forEach((key, i) => {
      if (i === keys.length - 1) cur[key] = v;
      else { if (!cur[key]) cur[key] = {}; cur = cur[key]; }
    });
  }
  return res;
}

export default function JsonFlattener() {
  const [input, setInput] = useState('{\n  "user": {\n    "name": "John",\n    "address": {\n      "city": "NYC"\n    }\n  }\n}');
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"flatten" | "unflatten">("flatten");

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(mode === "flatten" ? flatten(parsed) : unflatten(parsed), null, 2));
    } catch (e: any) { setOutput(`Error: ${e.message}`); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="JSON Flattener" description="Flatten nested JSON or unflatten dot-notation keys" />
      <div className="flex gap-2 mb-4">
        <Button variant={mode === "flatten" ? "default" : "outline"} onClick={() => setMode("flatten")}>Flatten</Button>
        <Button variant={mode === "unflatten" ? "default" : "outline"} onClick={() => setMode("unflatten")}>Unflatten</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm h-64" />
          <Button onClick={convert} className="mt-2">Convert</Button>
        </div>
        <div>
          <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
          <Textarea value={output} readOnly className="font-mono text-sm h-64" />
        </div>
      </div>
    </div>
  );
}
