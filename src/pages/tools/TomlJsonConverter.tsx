import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

function tomlToJson(toml: string): any {
  const result: any = {};
  let current = result;
  const lines = toml.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const tableMatch = trimmed.match(/^\[([^\]]+)\]$/);
    if (tableMatch) {
      const keys = tableMatch[1].split(".");
      current = result;
      for (const key of keys) {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
      continue;
    }
    const kvMatch = trimmed.match(/^([^=]+?)\s*=\s*(.+)$/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      let val = kvMatch[2].trim();
      if (val === "true") current[key] = true;
      else if (val === "false") current[key] = false;
      else if (/^-?\d+$/.test(val)) current[key] = parseInt(val);
      else if (/^-?\d+\.\d+$/.test(val)) current[key] = parseFloat(val);
      else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        current[key] = val.slice(1, -1);
      else if (val.startsWith("[") && val.endsWith("]")) {
        try { current[key] = JSON.parse(val.replace(/'/g, '"')); } catch { current[key] = val; }
      }
      else current[key] = val;
    }
  }
  return result;
}

function jsonToToml(obj: any, prefix = ""): string {
  let lines: string[] = [];
  const tables: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const tableName = prefix ? `${prefix}.${key}` : key;
      tables.push(`[${tableName}]`);
      tables.push(jsonToToml(value as any, tableName));
    } else {
      const v = typeof value === "string" ? `"${value}"` : Array.isArray(value) ? JSON.stringify(value) : String(value);
      lines.push(`${key} = ${v}`);
    }
  }
  return [...lines, ...tables].join("\n");
}

export default function TomlJsonConverter() {
  const [input, setInput] = useState(`[server]
host = "localhost"
port = 8080
debug = true

[database]
url = "postgres://localhost/mydb"
max_connections = 10`);
  const [mode, setMode] = useState<"toml-json" | "json-toml">("toml-json");

  const output = useMemo(() => {
    try {
      if (mode === "toml-json") return JSON.stringify(tomlToJson(input), null, 2);
      return jsonToToml(JSON.parse(input));
    } catch (e: any) { return `Error: ${e.message}`; }
  }, [input, mode]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="TOML ↔ JSON" description="Convert between TOML and JSON formats" />
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setMode("toml-json")} className={`px-3 py-1.5 text-xs rounded-md border ${mode === "toml-json" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"}`}>TOML → JSON</button>
          <button onClick={() => setMode("json-toml")} className={`px-3 py-1.5 text-xs rounded-md border ${mode === "json-toml" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"}`}>JSON → TOML</button>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input ({mode === "toml-json" ? "TOML" : "JSON"})</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-xs bg-card min-h-[150px]" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Output ({mode === "toml-json" ? "JSON" : "TOML"})</label>
            <CopyButton text={output} />
          </div>
          <pre className="text-xs font-mono bg-card border border-border rounded p-3 overflow-x-auto whitespace-pre min-h-[150px]">{output}</pre>
        </div>
      </div>
    </div>
  );
}
