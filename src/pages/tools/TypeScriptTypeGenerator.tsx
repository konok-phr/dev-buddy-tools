import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function inferType(value: any): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return Number.isInteger(value) ? "number" : "number";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) {
    if (value.length === 0) return "any[]";
    const types = [...new Set(value.map(inferType))];
    if (types.length === 1) {
      if (typeof value[0] === "object" && value[0] !== null && !Array.isArray(value[0])) {
        return `${generateInterface(value[0], "Item")}[]`;
      }
      return `${types[0]}[]`;
    }
    return `(${types.join(" | ")})[]`;
  }
  if (typeof value === "object") return "object";
  return "any";
}

function generateInterface(obj: any, name: string, indent = ""): string {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return inferType(obj);

  const lines: string[] = [];
  const nested: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const typeName = key.charAt(0).toUpperCase() + key.slice(1);
      nested.push(generateFullInterface(value, typeName, indent));
      lines.push(`${indent}  ${safeKey}: ${typeName};`);
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
      const typeName = key.charAt(0).toUpperCase() + key.slice(1).replace(/s$/, "");
      nested.push(generateFullInterface(value[0], typeName, indent));
      lines.push(`${indent}  ${safeKey}: ${typeName}[];`);
    } else {
      lines.push(`${indent}  ${safeKey}: ${inferType(value)};`);
    }
  }

  return nested.join("\n") + (nested.length ? "\n" : "") + `${indent}interface ${name} {\n${lines.join("\n")}\n${indent}}`;
}

function generateFullInterface(obj: any, name: string, indent = ""): string {
  return generateInterface(obj, name, indent);
}

function generateType(obj: any, name: string): string {
  if (typeof obj !== "object" || obj === null) return `type ${name} = ${inferType(obj)};`;
  const entries = Object.entries(obj).map(([key, value]) => {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
    return `  ${safeKey}: ${inferType(value)};`;
  });
  return `type ${name} = {\n${entries.join("\n")}\n};`;
}

function generateZod(obj: any): string {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    if (typeof obj === "string") return "z.string()";
    if (typeof obj === "number") return "z.number()";
    if (typeof obj === "boolean") return "z.boolean()";
    if (obj === null) return "z.null()";
    if (Array.isArray(obj)) return `z.array(${obj.length ? generateZod(obj[0]) : "z.any()"})`;
    return "z.any()";
  }
  const entries = Object.entries(obj).map(([k, v]) => `  ${k}: ${generateZod(v)},`);
  return `z.object({\n${entries.join("\n")}\n})`;
}

export default function TypeScriptTypeGenerator() {
  const [json, setJson] = useState(`{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "NYC",
    "zip": "10001"
  },
  "tags": ["admin", "user"],
  "orders": [
    { "id": 101, "total": 59.99, "date": "2024-01-15" }
  ]
}`);
  const [typeName, setTypeName] = useState("Root");
  const [format, setFormat] = useState("interface");

  const output = useMemo(() => {
    try {
      const parsed = JSON.parse(json);
      if (format === "interface") return generateFullInterface(parsed, typeName);
      if (format === "type") return generateType(parsed, typeName);
      if (format === "zod") return `import { z } from "zod";\n\nconst ${typeName}Schema = ${generateZod(parsed)};`;
      return "";
    } catch (e: any) {
      return `// Error: ${e.message}`;
    }
  }, [json, typeName, format]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="TypeScript Type Generator" description="Generate TypeScript types from JSON data" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Type Name</label>
            <input value={typeName} onChange={e => setTypeName(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Output Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="interface">Interface</SelectItem>
                <SelectItem value="type">Type Alias</SelectItem>
                <SelectItem value="zod">Zod Schema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">JSON Input</label>
          <Textarea value={json} onChange={e => setJson(e.target.value)} className="font-mono text-xs bg-card min-h-[180px]" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Generated Output</label>
            <CopyButton text={output} />
          </div>
          <pre className="text-xs font-mono bg-card border border-border rounded p-3 overflow-x-auto whitespace-pre min-h-[120px]">{output}</pre>
        </div>
      </div>
    </div>
  );
}
