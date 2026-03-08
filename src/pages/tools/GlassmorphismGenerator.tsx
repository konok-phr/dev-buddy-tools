import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";

export default function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.25);
  const [saturation, setSaturation] = useState(180);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [borderRadius, setBorderRadius] = useState(16);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const hex = bgColor;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `background: rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border-radius: ${borderRadius}px;
border: 1px solid rgba(${r}, ${g}, ${b}, ${borderOpacity.toFixed(2)});`;
  }, [blur, opacity, saturation, borderOpacity, borderRadius, bgColor]);

  const copy = () => { navigator.clipboard.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const sliders = [
    { label: "Blur", value: blur, set: (v: number) => setBlur(v), min: 0, max: 40, step: 1, unit: "px" },
    { label: "Opacity", value: opacity, set: (v: number) => setOpacity(v), min: 0, max: 1, step: 0.01 },
    { label: "Saturation", value: saturation, set: (v: number) => setSaturation(v), min: 100, max: 300, step: 5, unit: "%" },
    { label: "Border Opacity", value: borderOpacity, set: (v: number) => setBorderOpacity(v), min: 0, max: 1, step: 0.01 },
    { label: "Border Radius", value: borderRadius, set: (v: number) => setBorderRadius(v), min: 0, max: 48, step: 1, unit: "px" },
  ];

  const hex = bgColor;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return (
    <ToolPage toolId="glassmorphism" title="Glassmorphism Generator" description="Create frosted glass UI effects with CSS backdrop-filter">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Base Color</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
            <Badge variant="outline">{bgColor}</Badge>
          </div>
          {sliders.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-mono">{s.value}{s.unit || ""}</span>
              </div>
              <Slider min={s.min} max={s.max} step={s.step} value={[s.value]} onValueChange={([v]) => s.set(v)} />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div
            className="relative h-72 rounded-xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)" }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div
                className="w-full max-w-xs p-6 text-center"
                style={{
                  background: `rgba(${r}, ${g}, ${b}, ${opacity})`,
                  backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                  WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                  borderRadius: `${borderRadius}px`,
                  border: `1px solid rgba(${r}, ${g}, ${b}, ${borderOpacity})`,
                }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">Glass Card</h3>
                <p className="text-sm text-white/80">Frosted glass effect preview</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Badge variant="secondary">CSS</Badge>
            <Button size="sm" variant="ghost" onClick={copy}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <pre className="bg-muted rounded-lg p-4 text-xs font-mono whitespace-pre-wrap">{css}</pre>
        </div>
      </div>
    </ToolPage>
  );
}
