import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

type DiffLine = { type: "same" | "added" | "removed"; text: string };

function diffJson(a: any, b: any, path = ""): DiffLine[] {
  const lines: DiffLine[] = [];
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    lines.push({ type: "removed", text: `${path}: ${JSON.stringify(a)}` });
    lines.push({ type: "added", text: `${path}: ${JSON.stringify(b)}` });
    return lines;
  }
  if (typeof a !== "object" || a === null) {
    if (a === b) lines.push({ type: "same", text: `${path}: ${JSON.stringify(a)}` });
    else {
      lines.push({ type: "removed", text: `${path}: ${JSON.stringify(a)}` });
      lines.push({ type: "added", text: `${path}: ${JSON.stringify(b)}` });
    }
    return lines;
  }
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;
    if (!(key in a)) { lines.push({ type: "added", text: `${newPath}: ${JSON.stringify(b[key])}` }); continue; }
    if (!(key in b)) { lines.push({ type: "removed", text: `${newPath}: ${JSON.stringify(a[key])}` }); continue; }
    lines.push(...diffJson(a[key], b[key], newPath));
  }
  return lines;
}

export default function JsonDiffViewer() {
  const [left, setLeft] = useState(`{
  "name": "Alice",
  "age": 30,
  "email": "alice@example.com",
  "hobbies": ["reading", "coding"]
}`);
  const [right, setRight] = useState(`{
  "name": "Alice",
  "age": 31,
  "email": "alice@newdomain.com",
  "hobbies": ["reading", "gaming"],
  "city": "NYC"
}`);

  const diff = useMemo(() => {
    try {
      const a = JSON.parse(left);
      const b = JSON.parse(right);
      return { lines: diffJson(a, b), error: "" };
    } catch (e: any) {
      return { lines: [], error: e.message };
    }
  }, [left, right]);

  const stats = useMemo(() => {
    const added = diff.lines.filter(l => l.type === "added").length;
    const removed = diff.lines.filter(l => l.type === "removed").length;
    const same = diff.lines.filter(l => l.type === "same").length;
    return { added, removed, same };
  }, [diff.lines]);

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="JSON Diff Viewer" description="Compare two JSON objects and view differences" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Original JSON</label>
            <Textarea value={left} onChange={e => setLeft(e.target.value)} className="font-mono text-xs bg-card min-h-[150px]" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Modified JSON</label>
            <Textarea value={right} onChange={e => setRight(e.target.value)} className="font-mono text-xs bg-card min-h-[150px]" />
          </div>
        </div>
        {diff.error && <p className="text-destructive text-xs font-mono">{diff.error}</p>}
        {!diff.error && (
          <>
            <div className="flex gap-4 text-xs">
              <span className="text-muted-foreground">Unchanged: <span className="text-foreground font-medium">{stats.same}</span></span>
              <span className="text-green-500">+ Added: <span className="font-medium">{stats.added}</span></span>
              <span className="text-red-500">− Removed: <span className="font-medium">{stats.removed}</span></span>
            </div>
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              {diff.lines.map((line, i) => (
                <div
                  key={i}
                  className={`px-3 py-1 font-mono text-xs border-b border-border last:border-0 ${
                    line.type === "added" ? "bg-green-500/10 text-green-400" :
                    line.type === "removed" ? "bg-red-500/10 text-red-400" :
                    "text-muted-foreground"
                  }`}
                >
                  <span className="mr-2 opacity-60">{line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}</span>
                  {line.text}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
