import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function toSwiftType(val: any): string {
  if (val === null) return "String?";
  if (typeof val === "string") return "String";
  if (typeof val === "number") return Number.isInteger(val) ? "Int" : "Double";
  if (typeof val === "boolean") return "Bool";
  if (Array.isArray(val)) return val.length ? `[${toSwiftType(val[0])}]` : "[Any]";
  return "Any";
}

function jsonToSwift(obj: any, name = "Root"): string {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return `typealias ${name} = ${toSwiftType(obj)}`;
  let out = `struct ${name}: Codable {\n`;
  for (const [k, v] of Object.entries(obj)) out += `    let ${k}: ${toSwiftType(v)}\n`;
  return out + "}";
}

export default function JsonToSwift() {
  const [input, setInput] = useState('{\n  "name": "Alice",\n  "age": 30,\n  "active": true\n}');
  const [output, setOutput] = useState("");

  const convert = () => {
    try { setOutput(jsonToSwift(JSON.parse(input))); } catch (e: any) { setOutput(`// Error: ${e.message}`); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="JSON to Swift" description="Convert JSON to Swift Codable struct definitions" />
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
