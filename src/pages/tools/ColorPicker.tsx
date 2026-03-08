import { useState, useEffect } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPicker() {
  const [hex, setHex] = useState("#3b82f6");
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);

  const formats = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "RGBA", value: `rgba(${r}, ${g}, ${b}, 1)` },
  ];

  return (
    <div className="max-w-lg mx-auto">
      <ToolHeader title="Color Picker" description="Pick and convert colors between HEX, RGB, and HSL" />
      <div className="flex gap-4 mb-6">
        <div className="w-32 h-32 rounded-lg border border-border shadow-lg" style={{ backgroundColor: hex }} />
        <div className="flex-1 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Color</label>
            <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">HEX</label>
            <Input value={hex} onChange={e => setHex(e.target.value)} className="font-mono bg-card" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {formats.map(f => (
          <div key={f.label} className="flex items-center justify-between bg-card border border-border rounded-md px-3 py-2">
            <span className="text-xs text-muted-foreground w-12">{f.label}</span>
            <span className="font-mono text-sm text-foreground">{f.value}</span>
            <CopyButton text={f.value} />
          </div>
        ))}
      </div>
    </div>
  );
}
