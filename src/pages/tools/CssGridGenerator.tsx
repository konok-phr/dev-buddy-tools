import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

export default function CssGridGenerator() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [colGap, setColGap] = useState(8);
  const [rowGap, setRowGap] = useState(8);
  const [colSizes, setColSizes] = useState("1fr");
  const [rowSizes, setRowSizes] = useState("1fr");

  const templateCols = Array(cols).fill(colSizes).join(" ");
  const templateRows = Array(rows).fill(rowSizes).join(" ");

  const css = `display: grid;\ngrid-template-columns: ${templateCols};\ngrid-template-rows: ${templateRows};\ncolumn-gap: ${colGap}px;\nrow-gap: ${rowGap}px;`;

  const sliders = [
    { label: "Columns", value: cols, set: setCols, min: 1, max: 8 },
    { label: "Rows", value: rows, set: setRows, min: 1, max: 8 },
    { label: "Column Gap", value: colGap, set: setColGap, min: 0, max: 40, unit: "px" },
    { label: "Row Gap", value: rowGap, set: setRowGap, min: 0, max: 40, unit: "px" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="CSS Grid Generator" description="Visually build CSS Grid layouts" />
      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-4">
          {sliders.map(s => (
            <div key={s.label}>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-muted-foreground">{s.label}</label>
                <span className="text-xs font-mono text-foreground">{s.value}{s.unit || ""}</span>
              </div>
              <Slider min={s.min} max={s.max} step={1} value={[s.value]} onValueChange={v => s.set(v[0])} />
            </div>
          ))}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Column Size</label>
            <Input value={colSizes} onChange={e => setColSizes(e.target.value)} className="font-mono bg-card" placeholder="1fr" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Row Size</label>
            <Input value={rowSizes} onChange={e => setRowSizes(e.target.value)} className="font-mono bg-card" placeholder="1fr" />
          </div>
        </div>
        <div
          className="min-h-[300px] rounded-lg border border-border bg-muted p-4"
          style={{ display: "grid", gridTemplateColumns: templateCols, gridTemplateRows: templateRows, columnGap: colGap, rowGap: rowGap }}
        >
          {Array.from({ length: cols * rows }, (_, i) => (
            <div key={i} className="flex items-center justify-center rounded-md bg-primary text-primary-foreground font-mono text-sm font-bold min-h-[48px]">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">CSS</span>
          <CopyButton text={css} />
        </div>
        <pre className="font-mono text-xs text-muted-foreground whitespace-pre">{css}</pre>
      </div>
    </div>
  );
}
