import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const units = ["px", "rem", "em", "vw", "vh", "%", "pt", "cm", "mm", "in"] as const;
type Unit = typeof units[number];

function convert(value: number, from: Unit, to: Unit, basePx = 16, vpWidth = 1920, vpHeight = 1080): number | null {
  // Convert to px first
  let px: number;
  switch (from) {
    case "px": px = value; break;
    case "rem": case "em": px = value * basePx; break;
    case "vw": px = (value / 100) * vpWidth; break;
    case "vh": px = (value / 100) * vpHeight; break;
    case "%": px = (value / 100) * basePx; break;
    case "pt": px = value * (96 / 72); break;
    case "cm": px = value * (96 / 2.54); break;
    case "mm": px = value * (96 / 25.4); break;
    case "in": px = value * 96; break;
    default: return null;
  }
  // Convert from px to target
  switch (to) {
    case "px": return px;
    case "rem": case "em": return px / basePx;
    case "vw": return (px / vpWidth) * 100;
    case "vh": return (px / vpHeight) * 100;
    case "%": return (px / basePx) * 100;
    case "pt": return px * (72 / 96);
    case "cm": return px * (2.54 / 96);
    case "mm": return px * (25.4 / 96);
    case "in": return px / 96;
    default: return null;
  }
}

export default function CssUnitConverter() {
  const [value, setValue] = useState("16");
  const [fromUnit, setFromUnit] = useState<Unit>("px");
  const [basePx, setBasePx] = useState("16");
  const [vpWidth, setVpWidth] = useState("1920");
  const [vpHeight, setVpHeight] = useState("1080");

  const numVal = parseFloat(value) || 0;
  const base = parseFloat(basePx) || 16;
  const vw = parseFloat(vpWidth) || 1920;
  const vh = parseFloat(vpHeight) || 1080;

  const conversions = useMemo(() => {
    return units.map(u => ({
      unit: u,
      value: convert(numVal, fromUnit, u, base, vw, vh),
    }));
  }, [numVal, fromUnit, base, vw, vh]);

  const fmt = (n: number | null) => n === null ? "—" : parseFloat(n.toFixed(4)).toString();

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="CSS Unit Converter" description="Convert between CSS units (px, rem, em, vw, vh, %, pt, cm, mm, in)" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Value</label>
            <Input value={value} onChange={e => setValue(e.target.value)} className="bg-card text-sm font-mono" type="number" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Unit</label>
            <Select value={fromUnit} onValueChange={v => setFromUnit(v as Unit)}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Base font size (px)</label>
            <Input value={basePx} onChange={e => setBasePx(e.target.value)} className="bg-card text-sm font-mono" type="number" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Viewport width</label>
            <Input value={vpWidth} onChange={e => setVpWidth(e.target.value)} className="bg-card text-sm font-mono" type="number" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Viewport height</label>
            <Input value={vpHeight} onChange={e => setVpHeight(e.target.value)} className="bg-card text-sm font-mono" type="number" />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Conversions</label>
          <div className="grid grid-cols-2 gap-2">
            {conversions.map(c => (
              <div key={c.unit} className={`flex items-center justify-between border rounded-lg px-3 py-2 bg-card ${c.unit === fromUnit ? "border-primary" : "border-border"}`}>
                <span className="text-xs text-muted-foreground font-medium uppercase">{c.unit}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground">{fmt(c.value)}</span>
                  <CopyButton text={`${fmt(c.value)}${c.unit}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
