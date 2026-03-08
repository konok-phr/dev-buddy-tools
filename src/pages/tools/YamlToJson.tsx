import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Simple YAML parser for common cases (key: value, lists, nesting)
function parseYaml(yaml: string): any {
  const lines = yaml.split("\n");
  const result: any = {};
  const stack: { obj: any; indent: number }[] = [{ obj: result, indent: -1 }];

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const indent = line.search(/\S/);
    const content = line.trim();

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = stack[stack.length - 1].obj;

    if (content.startsWith("- ")) {
      const val = content.slice(2).trim();
      if (Array.isArray(parent)) {
        parent.push(parseValue(val));
      } else {
        const keys = Object.keys(parent);
        const lastKey = keys[keys.length - 1];
        if (lastKey && !Array.isArray(parent[lastKey])) parent[lastKey] = [];
        if (lastKey) parent[lastKey].push(parseValue(val));
      }
    } else if (content.includes(":")) {
      const colonIdx = content.indexOf(":");
      const key = content.slice(0, colonIdx).trim();
      const val = content.slice(colonIdx + 1).trim();
      if (val) {
        parent[key] = parseValue(val);
      } else {
        parent[key] = {};
        stack.push({ obj: parent[key], indent });
      }
    }
  }
  return result;
}

function parseValue(val: string): any {
  if (val === "true") return true;
  if (val === "false") return false;
  if (val === "null" || val === "~") return null;
  if (/^-?\d+$/.test(val)) return parseInt(val);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
    return val.slice(1, -1);
  return val;
}

function jsonToYaml(obj: any, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null) return "null";
  if (typeof obj !== "object") return String(obj);
  if (Array.isArray(obj)) return obj.map(v => `${pad}- ${typeof v === "object" ? "\n" + jsonToYaml(v, indent + 1) : v}`).join("\n");
  return Object.entries(obj).map(([k, v]) => {
    if (typeof v === "object" && v !== null) return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
    return `${pad}${k}: ${v === null ? "null" : v}`;
  }).join("\n");
}

export default function YamlToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"yaml2json" | "json2yaml">("yaml2json");

  const convert = () => {
    try {
      if (mode === "yaml2json") {
        setOutput(JSON.stringify(parseYaml(input), null, 2));
      } else {
        setOutput(jsonToYaml(JSON.parse(input)));
      }
      setError("");
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="YAML ↔ JSON Converter" description="Convert between YAML and JSON formats" />
      <div className="flex gap-2 mb-4">
        <Button variant={mode === "yaml2json" ? "default" : "secondary"} onClick={() => setMode("yaml2json")}>YAML → JSON</Button>
        <Button variant={mode === "json2yaml" ? "default" : "secondary"} onClick={() => setMode("json2yaml")}>JSON → YAML</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{mode === "yaml2json" ? "YAML" : "JSON"} Input</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm bg-card min-h-[300px]" placeholder={mode === "yaml2json" ? "name: John\nage: 30" : '{"name":"John"}'} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <Textarea value={output} readOnly className="font-mono text-sm bg-card min-h-[300px]" />
        </div>
      </div>
      {error && <p className="text-destructive text-sm mt-2 font-mono">{error}</p>}
      <Button onClick={convert} className="mt-4">Convert</Button>
    </div>
  );
}
