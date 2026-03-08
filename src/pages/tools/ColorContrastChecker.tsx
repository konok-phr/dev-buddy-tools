import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return null;
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
}

function relativeLuminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1: number, l2: number) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function grade(ratio: number, size: "normal" | "large") {
  if (size === "large") return ratio >= 4.5 ? "AAA" : ratio >= 3 ? "AA" : "Fail";
  return ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "Fail";
}

export default function ColorContrastChecker() {
  const [fg, setFg] = useState("#1a1a2e");
  const [bg, setBg] = useState("#eaeaea");

  const result = useMemo(() => {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (!fgRgb || !bgRgb) return null;
    const l1 = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const l2 = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    const ratio = contrastRatio(l1, l2);
    return { ratio, normalAA: grade(ratio, "normal"), largeAA: grade(ratio, "large") };
  }, [fg, bg]);

  const badgeColor = (g: string) => g === "AAA" ? "text-green-400 bg-green-500/10" : g === "AA" ? "text-yellow-400 bg-yellow-500/10" : "text-red-400 bg-red-500/10";

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Color Contrast Checker" description="Check WCAG contrast ratio between two colors" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Foreground</label>
            <div className="flex gap-2">
              <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="h-10 w-10 rounded border border-border cursor-pointer" />
              <Input value={fg} onChange={e => setFg(e.target.value)} className="font-mono bg-card" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Background</label>
            <div className="flex gap-2">
              <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="h-10 w-10 rounded border border-border cursor-pointer" />
              <Input value={bg} onChange={e => setBg(e.target.value)} className="font-mono bg-card" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border p-6 text-center" style={{ backgroundColor: bg, color: fg }}>
          <p className="text-3xl font-bold mb-1">Aa</p>
          <p className="text-sm">The quick brown fox jumps over the lazy dog.</p>
          <p className="text-xs mt-1 opacity-70">Small text sample for contrast testing</p>
        </div>
        {result && (
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-border rounded-lg p-4 bg-card text-center">
              <div className="text-2xl font-bold text-foreground">{result.ratio.toFixed(2)}:1</div>
              <div className="text-xs text-muted-foreground">Contrast Ratio</div>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card text-center">
              <div className={`text-lg font-bold px-3 py-1 rounded inline-block ${badgeColor(result.normalAA)}`}>{result.normalAA}</div>
              <div className="text-xs text-muted-foreground mt-1">Normal Text</div>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card text-center">
              <div className={`text-lg font-bold px-3 py-1 rounded inline-block ${badgeColor(result.largeAA)}`}>{result.largeAA}</div>
              <div className="text-xs text-muted-foreground mt-1">Large Text</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
