import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

function queryJson(obj: any, path: string): { value: any; found: boolean } {
  if (!path || path === "$") return { value: obj, found: true };
  const parts = path.replace(/^\$\.?/, "").split(/\.|\[(\d+)\]/).filter(Boolean);
  let current = obj;
  for (const part of parts) {
    if (current == null) return { value: undefined, found: false };
    const idx = /^\d+$/.test(part) ? parseInt(part) : null;
    current = idx !== null ? current[idx] : current[part];
  }
  return { value: current, found: current !== undefined };
}

function getPaths(obj: any, prefix = "$"): string[] {
  const paths: string[] = [prefix];
  if (obj && typeof obj === "object") {
    if (Array.isArray(obj)) {
      obj.forEach((_, i) => paths.push(...getPaths(obj[i], `${prefix}[${i}]`)));
    } else {
      Object.keys(obj).forEach(k => paths.push(...getPaths(obj[k], `${prefix}.${k}`)));
    }
  }
  return paths;
}

export default function JsonPathFinder() {
  const [json, setJson] = useState(`{
  "users": [
    { "name": "Alice", "age": 30, "email": "alice@example.com" },
    { "name": "Bob", "age": 25, "email": "bob@example.com" }
  ],
  "count": 2
}`);
  const [path, setPath] = useState("$.users[0].name");

  const parsed = useMemo(() => {
    try { return { data: JSON.parse(json), error: "" }; }
    catch (e: any) { return { data: null, error: e.message }; }
  }, [json]);

  const result = useMemo(() => {
    if (!parsed.data) return null;
    return queryJson(parsed.data, path);
  }, [parsed.data, path]);

  const allPaths = useMemo(() => {
    if (!parsed.data) return [];
    return getPaths(parsed.data).slice(0, 200);
  }, [parsed.data]);

  const filteredPaths = useMemo(() => {
    if (!path) return allPaths;
    return allPaths.filter(p => p.toLowerCase().includes(path.toLowerCase()));
  }, [allPaths, path]);

  const resultStr = result?.found ? JSON.stringify(result.value, null, 2) : "";

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="JSON Path Finder" description="Navigate and query JSON data with path expressions" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">JSON Input</label>
          <Textarea value={json} onChange={e => setJson(e.target.value)} className="font-mono text-xs bg-card min-h-[150px]" />
          {parsed.error && <p className="text-destructive text-xs mt-1 font-mono">{parsed.error}</p>}
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Path (e.g. $.users[0].name)</label>
          <Input value={path} onChange={e => setPath(e.target.value)} className="font-mono text-sm bg-card" placeholder="$." />
        </div>
        {result?.found && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">Result</label>
              <CopyButton text={resultStr} />
            </div>
            <pre className="text-xs font-mono bg-card border border-border rounded p-3 overflow-x-auto">{resultStr}</pre>
          </div>
        )}
        {result && !result.found && path && !parsed.error && (
          <p className="text-xs text-muted-foreground italic">No value found at this path.</p>
        )}
        {filteredPaths.length > 0 && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Available Paths ({filteredPaths.length})</label>
            <div className="max-h-48 overflow-y-auto border border-border rounded bg-card p-2 space-y-0.5">
              {filteredPaths.map(p => (
                <button
                  key={p}
                  onClick={() => setPath(p)}
                  className="block w-full text-left text-xs font-mono px-2 py-1 rounded hover:bg-accent text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
