import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return "";
  const headers = [...new Set(arr.flatMap(obj => Object.keys(obj)))];
  const escape = (val: any) => {
    const s = val === null || val === undefined ? "" : String(val);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = arr.map(obj => headers.map(h => escape(obj[h])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function csvToJson(csv: string): string {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return "[]";
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const data = lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => obj[h] = vals[i] || "");
    return obj;
  });
  return JSON.stringify(data, null, 2);
}

export default function JsonToCsv() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"json2csv" | "csv2json">("json2csv");

  const convert = () => {
    try {
      setOutput(mode === "json2csv" ? jsonToCsv(input) : csvToJson(input));
      setError("");
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="JSON ↔ CSV Converter" description="Convert between JSON and CSV formats" />
      <div className="flex gap-2 mb-4">
        <Button variant={mode === "json2csv" ? "default" : "secondary"} onClick={() => setMode("json2csv")}>JSON → CSV</Button>
        <Button variant={mode === "csv2json" ? "default" : "secondary"} onClick={() => setMode("csv2json")}>CSV → JSON</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{mode === "json2csv" ? "JSON Input" : "CSV Input"}</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm bg-card min-h-[250px]"
            placeholder={mode === "json2csv" ? '[{"name":"John","age":30}]' : "name,age\nJohn,30"} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <Textarea value={output} readOnly className="font-mono text-sm bg-card min-h-[250px]" />
        </div>
      </div>
      {error && <p className="text-destructive text-sm font-mono mt-2">{error}</p>}
      <Button onClick={convert} className="mt-4">Convert</Button>
    </div>
  );
}
