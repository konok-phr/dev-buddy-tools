import { useState, useRef, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Plus, Trash2, Download, ArrowUp, ArrowDown, ArrowUpDown, Filter, X } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

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

type SortDir = "asc" | "desc" | null;

export default function CsvViewer() {
  const [raw, setRaw] = useState("");
  const [rows, setRows] = useState<string[][]>([]);
  const [editing, setEditing] = useState(false);
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [filters, setFilters] = useState<Record<number, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadCsv = (text: string) => {
    setRaw(text);
    setRows(parseCsv(text));
    setEditing(true);
    setSortCol(null);
    setSortDir(null);
    setFilters({});
  };

  const loadXlsx = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonRows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
      const normalized = jsonRows.map(r => r.map(c => String(c ?? "")));
      if (normalized.length === 0) { toast.error("Empty spreadsheet"); return; }
      // Ensure all rows same length
      const maxCols = Math.max(...normalized.map(r => r.length));
      const padded = normalized.map(r => {
        while (r.length < maxCols) r.push("");
        return r;
      });
      setRows(padded);
      setRaw(toCsv(padded));
      setEditing(true);
      setSortCol(null);
      setSortDir(null);
      setFilters({});
      toast.success(`Loaded ${padded.length} rows from ${file.name}`);
    } catch {
      toast.error("Failed to parse Excel file");
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "xlsx" || ext === "xls") {
      loadXlsx(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => loadCsv(reader.result as string);
      reader.readAsText(file);
    }
    e.target.value = "";
  };

  const updateCell = (originalIdx: number, c: number, val: string) => {
    const next = rows.map((row, ri) => ri === originalIdx ? row.map((cell, ci) => ci === c ? val : cell) : [...row]);
    setRows(next);
  };

  const addRow = () => setRows([...rows, Array(rows[0]?.length || 3).fill("")]);
  const addCol = () => setRows(rows.length ? rows.map(r => [...r, ""]) : [["", "", ""]]);
  const deleteRow = (originalIdx: number) => setRows(rows.filter((_, ri) => ri !== originalIdx));

  const csvOutput = useMemo(() => toCsv(rows), [rows]);

  const download = () => {
    const blob = new Blob([csvOutput], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "edited.csv";
    a.click();
  };

  const downloadXlsx = () => {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "edited.xlsx");
  };

  const toggleSort = (col: number) => {
    if (sortCol === col) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortCol(null); setSortDir(null); }
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const setFilter = (col: number, val: string) => {
    setFilters(prev => {
      const next = { ...prev };
      if (val) next[col] = val; else delete next[col];
      return next;
    });
  };

  // Compute displayed rows: header (row 0) + filtered/sorted data rows
  const hasHeader = rows.length > 0;
  const header = hasHeader ? rows[0] : [];
  const dataRows = rows.slice(1);

  const processedRows = useMemo(() => {
    let indexed = dataRows.map((row, i) => ({ row, originalIdx: i + 1 }));

    // Filter
    for (const [colStr, val] of Object.entries(filters)) {
      const col = Number(colStr);
      const q = val.toLowerCase();
      indexed = indexed.filter(({ row }) => (row[col] || "").toLowerCase().includes(q));
    }

    // Sort
    if (sortCol !== null && sortDir) {
      const col = sortCol;
      indexed.sort((a, b) => {
        const av = a.row[col] || "";
        const bv = b.row[col] || "";
        const an = parseFloat(av);
        const bn = parseFloat(bv);
        if (!isNaN(an) && !isNaN(bn)) return sortDir === "asc" ? an - bn : bn - an;
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }

    return indexed;
  }, [dataRows, filters, sortCol, sortDir]);

  const activeFilters = Object.keys(filters).length;

  return (
    <div className="max-w-6xl mx-auto">
      <ToolHeader title="CSV / Excel Viewer" description="View, sort, filter and edit CSV & Excel (.xlsx) files in a table" />

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
            <input ref={fileRef} type="file" accept=".csv,.tsv,.txt,.xlsx,.xls" className="hidden" onChange={handleFile} />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4 mr-1" /> Upload File
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Supports .csv, .tsv, .xlsx, and .xls files</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={addRow}><Plus className="h-3 w-3 mr-1" /> Row</Button>
            <Button variant="outline" size="sm" onClick={addCol}><Plus className="h-3 w-3 mr-1" /> Column</Button>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-3 w-3 mr-1" /> Filter {activeFilters > 0 && `(${activeFilters})`}
            </Button>
            <Button variant="outline" size="sm" onClick={download}><Download className="h-3 w-3 mr-1" /> CSV</Button>
            <Button variant="outline" size="sm" onClick={downloadXlsx}><Download className="h-3 w-3 mr-1" /> XLSX</Button>
            <CopyButton text={csvOutput} />
            <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setRows([]); setRaw(""); setSortCol(null); setSortDir(null); setFilters({}); }}>Reset</Button>
          </div>

          <div className="overflow-auto border rounded-md max-h-[600px]">
            <table className="w-full text-sm">
              {hasHeader && (
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted">
                    {header.map((cell, ci) => (
                      <th key={ci} className="text-left p-0">
                        <button
                          onClick={() => toggleSort(ci)}
                          className="w-full flex items-center gap-1 px-2 py-2 text-xs font-semibold hover:bg-muted-foreground/10 transition-colors"
                        >
                          <span className="truncate">{cell || `Col ${ci + 1}`}</span>
                          {sortCol === ci && sortDir === "asc" && <ArrowUp className="h-3 w-3 text-primary shrink-0" />}
                          {sortCol === ci && sortDir === "desc" && <ArrowDown className="h-3 w-3 text-primary shrink-0" />}
                          {sortCol !== ci && <ArrowUpDown className="h-3 w-3 text-muted-foreground/40 shrink-0" />}
                        </button>
                      </th>
                    ))}
                    <th className="w-8" />
                  </tr>
                  {showFilters && (
                    <tr className="bg-muted/50">
                      {header.map((_, ci) => (
                        <th key={ci} className="p-1">
                          <div className="relative">
                            <Input
                              value={filters[ci] || ""}
                              onChange={e => setFilter(ci, e.target.value)}
                              placeholder="Filter..."
                              className="h-7 text-xs pr-6"
                            />
                            {filters[ci] && (
                              <button onClick={() => setFilter(ci, "")} className="absolute right-1 top-1/2 -translate-y-1/2">
                                <X className="h-3 w-3 text-muted-foreground" />
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                      <th />
                    </tr>
                  )}
                </thead>
              )}
              <tbody>
                {processedRows.map(({ row, originalIdx }) => (
                  <tr key={originalIdx} className="border-t border-border hover:bg-muted/30">
                    {row.map((cell, ci) => (
                      <td key={ci} className="p-0">
                        <Input
                          value={cell}
                          onChange={e => updateCell(originalIdx, ci, e.target.value)}
                          className="border-0 rounded-none h-8 text-xs focus-visible:ring-1 focus-visible:ring-inset"
                        />
                      </td>
                    ))}
                    <td className="px-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteRow(originalIdx)}>
                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {processedRows.length === 0 && (
                  <tr>
                    <td colSpan={header.length + 1} className="text-center text-muted-foreground py-8 text-sm">
                      {activeFilters > 0 ? "No rows match the filter" : "No data rows"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-muted-foreground">
            {processedRows.length}{processedRows.length !== dataRows.length ? ` of ${dataRows.length}` : ""} rows × {header.length} columns
          </div>
        </div>
      )}
    </div>
  );
}
