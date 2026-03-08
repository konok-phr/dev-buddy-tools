import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";

type Align = "left" | "center" | "right";

export default function MarkdownTableGenerator() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [headers, setHeaders] = useState<string[]>(["Header 1", "Header 2", "Header 3"]);
  const [data, setData] = useState<string[][]>([
    ["Cell", "Cell", "Cell"],
    ["Cell", "Cell", "Cell"],
    ["Cell", "Cell", "Cell"],
  ]);
  const [aligns, setAligns] = useState<Align[]>(["left", "left", "left"]);

  const updateCols = (n: number) => {
    if (n < 1 || n > 20) return;
    setCols(n);
    setHeaders(h => { const next = [...h]; while (next.length < n) next.push(`Header ${next.length + 1}`); return next.slice(0, n); });
    setData(d => d.map(row => { const next = [...row]; while (next.length < n) next.push("Cell"); return next.slice(0, n); }));
    setAligns(a => { const next = [...a]; while (next.length < n) next.push("left"); return next.slice(0, n); });
  };

  const updateRows = (n: number) => {
    if (n < 1 || n > 50) return;
    setRows(n);
    setData(d => {
      const next = [...d];
      while (next.length < n) next.push(Array(cols).fill("Cell"));
      return next.slice(0, n);
    });
  };

  const setHeader = (i: number, v: string) => setHeaders(h => { const n = [...h]; n[i] = v; return n; });
  const setCell = (r: number, c: number, v: string) => setData(d => { const n = d.map(row => [...row]); n[r][c] = v; return n; });
  const setAlign = (i: number, v: Align) => setAligns(a => { const n = [...a]; n[i] = v; return n; });

  const sep = (a: Align) => a === "center" ? ":---:" : a === "right" ? "---:" : "---";
  const markdown = [
    "| " + headers.join(" | ") + " |",
    "| " + aligns.map(sep).join(" | ") + " |",
    ...data.map(row => "| " + row.join(" | ") + " |"),
  ].join("\n");

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="Markdown Table Generator" description="Build markdown tables visually" />
      <div className="flex gap-4 mb-4 items-center">
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Columns:</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateCols(cols - 1)}><Minus className="h-3 w-3" /></Button>
          <span className="text-sm font-mono w-6 text-center text-foreground">{cols}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateCols(cols + 1)}><Plus className="h-3 w-3" /></Button>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Rows:</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateRows(rows - 1)}><Minus className="h-3 w-3" /></Button>
          <span className="text-sm font-mono w-6 text-center text-foreground">{rows}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateRows(rows + 1)}><Plus className="h-3 w-3" /></Button>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-4 overflow-x-auto mb-4">
        <table className="w-full">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="p-1">
                  <Input value={h} onChange={e => setHeader(i, e.target.value)} className="text-xs font-semibold bg-muted h-8" />
                </th>
              ))}
            </tr>
            <tr>
              {aligns.map((a, i) => (
                <th key={i} className="p-1">
                  <Select value={a} onValueChange={(v: Align) => setAlign(i, v)}>
                    <SelectTrigger className="h-7 text-xs bg-muted"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="p-1">
                    <Input value={cell} onChange={e => setCell(r, c, e.target.value)} className="text-xs bg-background h-8" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-muted-foreground">Markdown Output</label>
          <CopyButton text={markdown} />
        </div>
        <pre className="rounded-md border border-border bg-card p-3 text-sm font-mono text-foreground overflow-x-auto whitespace-pre">{markdown}</pre>
      </div>
    </div>
  );
}
