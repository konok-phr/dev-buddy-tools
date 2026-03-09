import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function toRustType(val: any): string {
  if (val === null) return "Option<String>";
  if (typeof val === "string") return "String";
  if (typeof val === "number") return Number.isInteger(val) ? "i64" : "f64";
  if (typeof val === "boolean") return "bool";
  if (Array.isArray(val)) return val.length ? `Vec<${toRustType(val[0])}>` : "Vec<serde_json::Value>";
  return "serde_json::Value";
}

function jsonToRust(obj: any, name = "Root"): string {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return `type ${name} = ${toRustType(obj)};`;
  let out = `#[derive(Debug, Serialize, Deserialize)]\npub struct ${name} {\n`;
  for (const [k, v] of Object.entries(obj)) {
    const fieldName = k.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`);
    out += `    pub ${fieldName}: ${toRustType(v)},\n`;
  }
  return out + "}";
}

export default function JsonToRust() {
  const [input, setInput] = useState('{\n  "name": "Alice",\n  "age": 30,\n  "active": true\n}');
  const [output, setOutput] = useState("");

  const convert = () => {
    try { setOutput(jsonToRust(JSON.parse(input))); } catch (e: any) { setOutput(`// Error: ${e.message}`); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="JSON to Rust Struct" description="Convert JSON to Rust struct definitions with serde" />
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
