import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const presets = [
  { label: "16:9", w: 16, h: 9 },
  { label: "4:3", w: 4, h: 3 },
  { label: "1:1", w: 1, h: 1 },
  { label: "21:9", w: 21, h: 9 },
  { label: "9:16", w: 9, h: 16 },
  { label: "3:2", w: 3, h: 2 },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export default function AspectRatioCalculator() {
  const [w, setW] = useState(1920);
  const [h, setH] = useState(1080);

  const g = gcd(Math.abs(w), Math.abs(h)) || 1;
  const ratioW = w / g;
  const ratioH = h / g;
  const decimal = h > 0 ? (w / h).toFixed(4) : "—";
  const css = `aspect-ratio: ${ratioW} / ${ratioH};`;

  const applyPreset = (pw: number, ph: number) => {
    const scale = Math.round(w / pw) || 1;
    setW(pw * scale);
    setH(ph * scale);
  };

  const calcFromWidth = (newW: number) => {
    if (ratioH > 0) setH(Math.round((newW * ratioH) / ratioW));
    setW(newW);
  };

  const calcFromHeight = (newH: number) => {
    if (ratioW > 0) setW(Math.round((newH * ratioW) / ratioH));
    setH(newH);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Aspect Ratio Calculator" description="Calculate and visualize aspect ratios" />
      <div className="flex flex-wrap gap-2 mb-6">
        {presets.map(p => (
          <Button key={p.label} variant="outline" size="sm" onClick={() => applyPreset(p.w, p.h)}>{p.label}</Button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Width</label>
            <Input type="number" value={w} onChange={e => setW(+e.target.value)} className="font-mono bg-card" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Height</label>
            <Input type="number" value={h} onChange={e => setH(+e.target.value)} className="font-mono bg-card" />
          </div>
          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ratio</span>
              <span className="font-mono text-foreground">{ratioW}:{ratioH}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Decimal</span>
              <span className="font-mono text-foreground">{decimal}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-muted rounded-lg border border-border min-h-[250px] p-4">
          <div
            className="bg-primary rounded-md max-w-full max-h-[220px]"
            style={{ aspectRatio: `${w}/${h}`, width: w >= h ? "100%" : "auto", height: w < h ? "200px" : "auto" }}
          />
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">CSS</span>
          <CopyButton text={css} />
        </div>
        <pre className="font-mono text-xs text-muted-foreground">{css}</pre>
      </div>
    </div>
  );
}
