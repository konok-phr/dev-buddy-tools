import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

function jsonToXml(obj: any, root = "root", indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null || obj === undefined) return `${pad}<${root}/>\n`;
  if (typeof obj !== "object") return `${pad}<${root}>${String(obj)}</${root}>\n`;
  if (Array.isArray(obj)) return obj.map(item => jsonToXml(item, "item", indent)).join("");
  let xml = `${pad}<${root}>\n`;
  for (const [k, v] of Object.entries(obj)) xml += jsonToXml(v, k, indent + 1);
  xml += `${pad}</${root}>\n`;
  return xml;
}

export default function JsonToXml() {
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30,\n  "hobbies": ["reading", "coding"]\n}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput('<?xml version="1.0" encoding="UTF-8"?>\n' + jsonToXml(parsed));
      setError("");
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="JSON to XML" description="Convert JSON data to XML format" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm h-64" placeholder="Paste JSON..." />
          <button onClick={convert} className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Convert</button>
        </div>
        <div>
          <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
          <Textarea value={output} readOnly className="font-mono text-sm h-64" placeholder="XML output..." />
        </div>
      </div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
