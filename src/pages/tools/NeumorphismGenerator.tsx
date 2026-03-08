import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";

function adjustColor(hex: string, amount: number) {
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

type Shape = "flat" | "concave" | "convex" | "pressed";

export default function NeumorphismGenerator() {
  const [bgColor, setBgColor] = useState("#e0e5ec");
  const [distance, setDistance] = useState(12);
  const [intensity, setIntensity] = useState(40);
  const [blur, setBlur] = useState(24);
  const [radius, setRadius] = useState(16);
  const [shape, setShape] = useState<Shape>("flat");
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const light = adjustColor(bgColor, intensity);
    const dark = adjustColor(bgColor, -intensity);
    const d = shape === "pressed" ? -distance : distance;

    let bg = bgColor;
    if (shape === "concave") bg = `linear-gradient(145deg, ${dark}, ${light})`;
    else if (shape === "convex") bg = `linear-gradient(145deg, ${light}, ${dark})`;

    const shadow = shape === "pressed"
      ? `inset ${d}px ${d}px ${blur}px ${dark}, inset ${-d}px ${-d}px ${blur}px ${light}`
      : `${d}px ${d}px ${blur}px ${dark}, ${-d}px ${-d}px ${blur}px ${light}`;

    return `border-radius: ${radius}px;\nbackground: ${bg};\nbox-shadow: ${shadow};`;
  }, [bgColor, distance, intensity, blur, radius, shape]);

  const copy = () => { navigator.clipboard.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const light = adjustColor(bgColor, intensity);
  const dark = adjustColor(bgColor, -intensity);
  const d = shape === "pressed" ? -distance : distance;
  const bgVal = shape === "concave" ? `linear-gradient(145deg, ${dark}, ${light})`
    : shape === "convex" ? `linear-gradient(145deg, ${light}, ${dark})` : bgColor;
  const shadowVal = shape === "pressed"
    ? `inset ${d}px ${d}px ${blur}px ${dark}, inset ${-d}px ${-d}px ${blur}px ${light}`
    : `${d}px ${d}px ${blur}px ${dark}, ${-d}px ${-d}px ${blur}px ${light}`;

  const shapes: Shape[] = ["flat", "concave", "convex", "pressed"];

  return (
    <div className="space-y-0">
      <ToolHeader title="Neumorphism Generator" description="Create soft, raised UI elements with CSS shadows" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Background</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
            <Badge variant="outline">{bgColor}</Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            {shapes.map((s) => (
              <Badge key={s} variant={shape === s ? "default" : "outline"} className="cursor-pointer capitalize" onClick={() => setShape(s)}>{s}</Badge>
            ))}
          </div>
          {[
            { label: "Distance", value: distance, set: setDistance, min: 1, max: 30 },
            { label: "Intensity", value: intensity, set: setIntensity, min: 10, max: 80 },
            { label: "Blur", value: blur, set: setBlur, min: 0, max: 60 },
            { label: "Radius", value: radius, set: setRadius, min: 0, max: 48 },
          ].map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-mono">{s.value}px</span>
              </div>
              <Slider min={s.min} max={s.max} step={1} value={[s.value]} onValueChange={([v]) => s.set(v)} />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center h-72 rounded-xl" style={{ background: bgColor }}>
            <div
              className="w-36 h-36 flex items-center justify-center text-sm font-medium"
              style={{ background: bgVal, borderRadius: `${radius}px`, boxShadow: shadowVal, color: adjustColor(bgColor, -80) }}
            >
              Neumorphic
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Badge variant="secondary">CSS</Badge>
            <Button size="sm" variant="ghost" onClick={copy}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</Button>
          </div>
          <pre className="bg-muted rounded-lg p-4 text-xs font-mono whitespace-pre-wrap">{css}</pre>
        </div>
      </div>
    </div>
  );
}
