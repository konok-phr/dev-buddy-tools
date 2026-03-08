import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Lock, Unlock } from "lucide-react";

function randomHsl(): string {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 40 + 50);
  const l = Math.floor(Math.random() * 40 + 30);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function hslToHex(hsl: string): string {
  const m = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!m) return "#000000";
  let h = +m[1], s = +m[2] / 100, l = +m[3] / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

interface Swatch { color: string; locked: boolean }

function generatePalette(prev?: Swatch[]): Swatch[] {
  return Array.from({ length: 5 }, (_, i) =>
    prev && prev[i]?.locked ? prev[i] : { color: randomHsl(), locked: false }
  );
}

export default function ColorPaletteGenerator() {
  const [palette, setPalette] = useState<Swatch[]>(generatePalette());

  const toggleLock = (i: number) => {
    setPalette(p => p.map((s, j) => j === i ? { ...s, locked: !s.locked } : s));
  };

  const exportCss = palette.map((s, i) => `--color-${i + 1}: ${s.color};`).join("\n");

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Color Palette Generator" description="Generate harmonious color palettes — lock colors you like" />
      <div className="flex gap-2 mb-6">
        <Button onClick={() => setPalette(generatePalette(palette))} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Generate
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-3 mb-6">
        {palette.map((s, i) => {
          const hex = hslToHex(s.color);
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-full aspect-square rounded-lg border border-border shadow-sm" style={{ backgroundColor: s.color }} />
              <span className="font-mono text-xs text-foreground">{hex.toUpperCase()}</span>
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => toggleLock(i)}>
                {s.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
              </Button>
            </div>
          );
        })}
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">CSS Variables</span>
          <CopyButton text={exportCss} />
        </div>
        <pre className="font-mono text-xs text-muted-foreground whitespace-pre">{exportCss}</pre>
      </div>
    </div>
  );
}
