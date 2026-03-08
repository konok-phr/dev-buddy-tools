import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

function diffLines(a: string[], b: string[]) {
  const result: { type: "same" | "added" | "removed"; text: string }[] = [];
  const max = Math.max(a.length, b.length);
  // Simple line-by-line diff (LCS-based would be better but this is functional)
  let ai = 0, bi = 0;
  while (ai < a.length || bi < b.length) {
    if (ai < a.length && bi < b.length && a[ai] === b[bi]) {
      result.push({ type: "same", text: a[ai] });
      ai++; bi++;
    } else if (bi < b.length && (ai >= a.length || !a.slice(ai).includes(b[bi]))) {
      result.push({ type: "added", text: b[bi] });
      bi++;
    } else {
      result.push({ type: "removed", text: a[ai] });
      ai++;
    }
  }
  return result;
}

export default function DiffChecker() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const diff = useMemo(() => {
    if (!left && !right) return [];
    return diffLines(left.split("\n"), right.split("\n"));
  }, [left, right]);

  const added = diff.filter(d => d.type === "added").length;
  const removed = diff.filter(d => d.type === "removed").length;

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader title="Diff Checker" description="Compare two texts and see the differences" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Original</label>
          <Textarea value={left} onChange={e => setLeft(e.target.value)} className="font-mono text-sm bg-card min-h-[200px]" placeholder="Paste original text..." />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Modified</label>
          <Textarea value={right} onChange={e => setRight(e.target.value)} className="font-mono text-sm bg-card min-h-[200px]" placeholder="Paste modified text..." />
        </div>
      </div>
      {diff.length > 0 && (
        <>
          <div className="flex gap-4 text-xs mb-2">
            <span className="text-accent">+{added} added</span>
            <span className="text-destructive">-{removed} removed</span>
          </div>
          <div className="bg-card border border-border rounded-md overflow-auto max-h-[400px]">
            {diff.map((d, i) => (
              <div
                key={i}
                className={`px-3 py-0.5 font-mono text-xs border-b border-border/30 ${
                  d.type === "added" ? "bg-accent/10 text-accent" :
                  d.type === "removed" ? "bg-destructive/10 text-destructive" :
                  "text-foreground"
                }`}
              >
                <span className="inline-block w-5 text-muted-foreground">
                  {d.type === "added" ? "+" : d.type === "removed" ? "-" : " "}
                </span>
                {d.text || " "}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
