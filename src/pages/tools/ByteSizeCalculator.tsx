import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const units = [
  { label: "Bytes", factor: 1 },
  { label: "KB", factor: 1024 },
  { label: "MB", factor: 1024 ** 2 },
  { label: "GB", factor: 1024 ** 3 },
  { label: "TB", factor: 1024 ** 4 },
  { label: "KiB", factor: 1024 },
  { label: "MiB", factor: 1024 ** 2 },
  { label: "GiB", factor: 1024 ** 3 },
];

const siUnits = [
  { label: "kB (SI)", factor: 1000 },
  { label: "MB (SI)", factor: 1000 ** 2 },
  { label: "GB (SI)", factor: 1000 ** 3 },
  { label: "TB (SI)", factor: 1000 ** 4 },
];

function fmt(n: number) {
  if (n === 0) return "0";
  if (n >= 1) return parseFloat(n.toFixed(4)).toLocaleString();
  return n.toExponential(3);
}

export default function ByteSizeCalculator() {
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState("MB");

  const bytes = useMemo(() => {
    const num = parseFloat(value) || 0;
    const found = [...units, ...siUnits].find(u => u.label === unit);
    return num * (found?.factor || 1);
  }, [value, unit]);

  const allUnits = [...units, ...siUnits];

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Byte Size Calculator" description="Convert between byte units (binary & SI)" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Value</label>
            <Input value={value} onChange={e => setValue(e.target.value)} type="number" className="bg-card font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Unit</label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {allUnits.map(u => <SelectItem key={u.label} value={u.label}>{u.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Conversions</label>
          <div className="grid grid-cols-2 gap-2">
            {allUnits.map(u => (
              <div key={u.label} className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-card ${u.label === unit ? "border-primary" : "border-border"}`}>
                <span className="text-xs text-muted-foreground font-medium">{u.label}</span>
                <span className="font-mono text-sm text-foreground">{fmt(bytes / u.factor)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-border rounded-lg p-3 bg-card">
          <p className="text-xs text-muted-foreground mb-1">Raw bytes</p>
          <p className="font-mono text-sm text-foreground">{bytes.toLocaleString()} bytes</p>
          <p className="font-mono text-xs text-muted-foreground mt-1">{bytes.toString(16).toUpperCase()} hex</p>
        </div>
      </div>
    </div>
  );
}
