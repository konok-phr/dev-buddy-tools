import { useState, useRef, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Plus, Trash2, Download } from "lucide-react";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
        else if (ch === '"') inQuotes = false;
        else current += ch;
      } else {
        if (ch === '"') inQuotes = true;
        else if (ch === ",") { cells.push(current); current = ""; }
        else current += ch;
      }
    }
    cells.push(current);
    rows.push(cells);
  }
  return rows;
}

function toCsv(rows: string[][]): string {
  return rows.map(r => r.map(c => c.includes(",") || c.includes('"') || c.includes("\n") ? `"${c.replace(/"/g, '""')}"` : c).join(",")).join("\n");
}

export default function CsvViewer() {
  const [raw, setRaw] = useState("");
  const [rows, setRows] = useState<string[][]>([]);
  const [editing, setEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadCsv = (text: string) => {
    setRaw(text);
    setRows(parseCsv(text));
    setEditing(true);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadCsv(reader.result as string);
    reader.readAsText(file);
    e.target.value = "";
  };

  const updateCell = (r: number, c: number, val: string) => {
    const next = rows.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? val : cell) : [...row]);
    setRows(next);
  };

  const addRow = () => setRows([...rows, Array(rows[0]?.length || 3).fill("")]);
  const addCol = () => setRows(rows.length ? rows.map(r => [...r, ""]) : [["", "", ""]]);
  const deleteRow = (i: number) => setRows(rows.filter((_, ri) => ri !== i));

  const csvOutput = useMemo(() => toCsv(rows), [rows]);

  const download = () => {
    const blob = new Blob([csvOutput], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "edited.csv";
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <ToolHeader title="CSV Viewer / Editor" description="View, edit and export CSV data in a spreadsheet-like table" />

      {!editing ? (
        <div className="space-y-4">
          <Textarea
            value={raw}
            onChange={e => setRaw(e.target.value)}
            placeholder={'name,email,role\nJohn,john@example.com,admin\nJane,jane@example.com,user'}
            className="font-mono text-sm bg-card min-h-[200px]"
          />
          <div className="flex gap-2">
            <Button onClick={() => loadCsv(raw)} disabled={!raw.trim()}>Load CSV</Button>
            <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" className="hidden" onChange={handleFile} />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4 mr-1" /> Upload File
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={addRow}><Plus className="h-3 w-3 mr-1" /> Row</Button>
            <Button variant="outline" size="sm" onClick={addCol}><Plus className="h-3 w-3 mr-1" /> Column</Button>
            <Button variant="outline" size="sm" onClick={download}><Download className="h-3 w-3 mr-1" /> Download</Button>
            <CopyButton text={csvOutput} />
            <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setRows([]); setRaw(""); }}>Reset</Button>
          </div>

          <div className="overflow-auto border rounded-md">
            <table className="w-full text-sm">
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className={ri === 0 ? "bg-muted font-semibold" : "border-t border-border"}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="p-0">
                        <Input
                          value={cell}
                          onChange={e => updateCell(ri, ci, e.target.value)}
                          className="border-0 rounded-none h-8 text-xs focus-visible:ring-1 focus-visible:ring-inset"
                        />
                      </td>
                    ))}
                    <td className="px-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteRow(ri)}>
                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-muted-foreground">
            {rows.length} rows × {rows[0]?.length || 0} columns
          </div>
        </div>
      )}
    </div>
  );
}
