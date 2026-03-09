import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function toKotlinType(val: any): string {
  if (val === null) return "String?";
  if (typeof val === "string") return "String";
  if (typeof val === "number") return Number.isInteger(val) ? "Int" : "Double";
  if (typeof val === "boolean") return "Boolean";
  if (Array.isArray(val)) return val.length ? `List<${toKotlinType(val[0])}>` : "List<Any>";
  return "Any";
}

function jsonToKotlin(obj: any, name = "Root"): string {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return `typealias ${name} = ${toKotlinType(obj)}`;
  let out = `data class ${name}(\n`;
  const entries = Object.entries(obj);
  entries.forEach(([k, v], i) => {
    out += `    val ${k}: ${toKotlinType(v)}${i < entries.length - 1 ? "," : ""}\n`;
  });
  return out + ")";
}

export default function JsonToKotlin() {
  const [input, setInput] = useState('{\n  "name": "Alice",\n  "age": 30,\n  "active": true\n}');
  const [output, setOutput] = useState("");

  const convert = () => {
    try { setOutput(jsonToKotlin(JSON.parse(input))); } catch (e: any) { setOutput(`// Error: ${e.message}`); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="JSON to Kotlin" description="Convert JSON to Kotlin data class definitions" />
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
