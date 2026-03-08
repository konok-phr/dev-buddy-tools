import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";

type Style = "ascii" | "markdown" | "unicode" | "compact";

function generateTable(headers: string[], rows: string[][], style: Style): string {
  const cols = headers.length;
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map(r => (r[i] || "").length), 3));

  const pad = (s: string, w: number) => s + " ".repeat(Math.max(0, w - s.length));

  if (style === "markdown") {
    const hLine = "| " + headers.map((h, i) => pad(h, widths[i])).join(" | ") + " |";
    const sep = "| " + widths.map(w => "-".repeat(w)).join(" | ") + " |";
    const rLines = rows.map(r => "| " + r.map((c, i) => pad(c || "", widths[i])).join(" | ") + " |");
    return [hLine, sep, ...rLines].join("\n");
  }

  const chars = style === "unicode"
    ? { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│", ml: "├", mr: "┤", mt: "┬", mb: "┴", cross: "┼" }
    : { tl: "+", tr: "+", bl: "+", br: "+", h: "-", v: "|", ml: "+", mr: "+", mt: "+", mb: "+", cross: "+" };

  if (style === "compact") {
    const hLine = headers.map((h, i) => pad(h, widths[i])).join("  ");
    const sep = widths.map(w => "-".repeat(w)).join("  ");
    const rLines = rows.map(r => r.map((c, i) => pad(c || "", widths[i])).join("  "));
    return [hLine, sep, ...rLines].join("\n");
  }

  const border = (l: string, m: string, r: string) => l + widths.map(w => chars.h.repeat(w + 2)).join(m) + r;
  const row = (cells: string[]) => chars.v + " " + cells.map((c, i) => pad(c || "", widths[i])).join(" " + chars.v + " ") + " " + chars.v;

  return [
    border(chars.tl, chars.mt, chars.tr),
    row(headers),
    border(chars.ml, chars.cross, chars.mr),
    ...rows.map(r => row(r)),
    border(chars.bl, chars.mb, chars.br),
  ].join("\n");
}

export default function AsciiTableGenerator() {
  const [cols, setCols] = useState(3);
  const [rowCount, setRowCount] = useState(3);
  const [headers, setHeaders] = useState(["Name", "Age", "City"]);
  const [rows, setRows] = useState([
    ["Alice", "30", "NYC"],
    ["Bob", "25", "LA"],
    ["Charlie", "35", "Chicago"],
  ]);
  const [style, setStyle] = useState<Style>("ascii");

  const updateHeader = (i: number, v: string) => {
    const h = [...headers]; h[i] = v; setHeaders(h);
  };
  const updateCell = (r: number, c: number, v: string) => {
    const newRows = rows.map(row => [...row]);
    newRows[r][c] = v;
    setRows(newRows);
  };

  const addCol = () => {
    setCols(cols + 1);
    setHeaders([...headers, `Col ${cols + 1}`]);
    setRows(rows.map(r => [...r, ""]));
  };
  const removeCol = () => {
    if (cols <= 1) return;
    setCols(cols - 1);
    setHeaders(headers.slice(0, -1));
    setRows(rows.map(r => r.slice(0, -1)));
  };
  const addRow = () => { setRowCount(rowCount + 1); setRows([...rows, Array(cols).fill("")]); };
  const removeRow = () => { if (rowCount <= 1) return; setRowCount(rowCount - 1); setRows(rows.slice(0, -1)); };

  const output = useMemo(() => generateTable(headers, rows, style), [headers, rows, style]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="ASCII Table Generator" description="Build text tables for README, comments & docs" />

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Select value={style} onValueChange={v => setStyle(v as Style)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ascii">ASCII (+--+)</SelectItem>
            <SelectItem value="unicode">Unicode (┌──┐)</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
            <SelectItem value="compact">Compact</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={removeCol}><Minus className="h-3 w-3" /></Button>
          <span className="text-xs text-muted-foreground px-1">{cols} cols</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={addCol}><Plus className="h-3 w-3" /></Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={removeRow}><Minus className="h-3 w-3" /></Button>
          <span className="text-xs text-muted-foreground px-1">{rowCount} rows</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={addRow}><Plus className="h-3 w-3" /></Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              {headers.map((h, i) => (
                <th key={i} className="p-1">
                  <Input value={h} onChange={e => updateHeader(i, e.target.value)} className="text-xs font-mono h-8 text-center bg-transparent border-0" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-t border-border">
                {row.map((cell, ci) => (
                  <td key={ci} className="p-1">
                    <Input value={cell} onChange={e => updateCell(ri, ci, e.target.value)} className="text-xs font-mono h-8 text-center bg-transparent border-0" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Output</h3>
          <CopyButton text={output} />
        </div>
        <pre className="text-sm font-mono text-foreground bg-muted p-3 rounded overflow-x-auto whitespace-pre">{output}</pre>
      </div>
    </div>
  );
}
