import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const DEFAULTS = { blur: 0, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 0, invert: 0, saturate: 100, sepia: 0, opacity: 100 };

export default function CssFilterGenerator() {
  const [f, setF] = useState(DEFAULTS);

  const css = useMemo(() => {
    const parts: string[] = [];
    if (f.blur) parts.push(`blur(${f.blur}px)`);
    if (f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`);
    if (f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`);
    if (f.grayscale) parts.push(`grayscale(${f.grayscale}%)`);
    if (f.hueRotate) parts.push(`hue-rotate(${f.hueRotate}deg)`);
    if (f.invert) parts.push(`invert(${f.invert}%)`);
    if (f.saturate !== 100) parts.push(`saturate(${f.saturate}%)`);
    if (f.sepia) parts.push(`sepia(${f.sepia}%)`);
    if (f.opacity !== 100) parts.push(`opacity(${f.opacity}%)`);
    return parts.length ? `filter: ${parts.join(" ")};` : "filter: none;";
  }, [f]);

  const sliders: [string, keyof typeof DEFAULTS, number, number][] = [
    ["Blur (px)", "blur", 0, 20], ["Brightness (%)", "brightness", 0, 200],
    ["Contrast (%)", "contrast", 0, 200], ["Grayscale (%)", "grayscale", 0, 100],
    ["Hue Rotate (°)", "hueRotate", 0, 360], ["Invert (%)", "invert", 0, 100],
    ["Saturate (%)", "saturate", 0, 200], ["Sepia (%)", "sepia", 0, 100],
    ["Opacity (%)", "opacity", 0, 100],
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="CSS Filter Generator" description="Generate CSS filter effects with live preview" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {sliders.map(([label, key, min, max]) => (
            <div key={key}>
              <Label className="text-xs">{label}: {f[key]}</Label>
              <Slider value={[f[key]]} onValueChange={([v]) => setF(p => ({ ...p, [key]: v }))} min={min} max={max} step={1} />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setF(DEFAULTS)}>Reset</Button>
        </div>
        <div>
          <div className="border rounded-md p-4 mb-3 flex items-center justify-center min-h-[200px]" style={{ filter: css.replace("filter: ", "").replace(";", "") }}>
            <div className="w-32 h-32 rounded-md bg-gradient-to-br from-primary to-accent" />
          </div>
          <div className="flex justify-end mb-1"><CopyButton text={css} /></div>
          <pre className="border rounded-md p-3 text-xs font-mono text-foreground">{css}</pre>
        </div>
      </div>
    </div>
  );
}
