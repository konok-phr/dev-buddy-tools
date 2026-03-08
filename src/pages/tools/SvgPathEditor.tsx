import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Copy, Check } from "lucide-react";

const PRESETS: Record<string, string> = {
  "Heart": "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  "Star": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  "Arrow": "M5 12h14M12 5l7 7-7 7",
  "Check": "M20 6L9 17l-5-5",
  "Wave": "M0 20 Q25 0, 50 20 T100 20",
};

export default function SvgPathEditor() {
  const [path, setPath] = useState(PRESETS["Heart"]);
  const [viewBox, setViewBox] = useState("0 0 24 24");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fill, setFill] = useState("none");
  const [stroke, setStroke] = useState("#000000");
  const [fillColor, setFillColor] = useState("#3b82f6");
  const [copied, setCopied] = useState(false);

  const isFilled = fill !== "none";

  const svgCode = useMemo(() => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100" height="100">
  <path d="${path}" fill="${isFilled ? fillColor : "none"}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  }, [path, viewBox, strokeWidth, fill, stroke, fillColor, isFilled]);

  const copy = () => { navigator.clipboard.writeText(svgCode); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-0">
      <ToolHeader title="SVG Path Editor" description="Edit SVG paths with live preview and presets" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {Object.keys(PRESETS).map((k) => (
              <Badge key={k} variant={path === PRESETS[k] ? "default" : "outline"} className="cursor-pointer" onClick={() => setPath(PRESETS[k])}>{k}</Badge>
            ))}
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Path Data (d)</label>
            <Textarea className="font-mono text-xs min-h-[80px]" value={path} onChange={(e) => setPath(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">viewBox</label>
              <input className="w-full bg-muted px-2 py-1.5 rounded text-sm font-mono border border-border" value={viewBox} onChange={(e) => setViewBox(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Stroke Width</span><span className="font-mono">{strokeWidth}</span></div>
            <Slider min={0.5} max={6} step={0.5} value={[strokeWidth]} onValueChange={([v]) => setStrokeWidth(v)} />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Stroke</label>
              <input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)} className="w-7 h-7 rounded cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                <input type="checkbox" checked={isFilled} onChange={(e) => setFill(e.target.checked ? fillColor : "none")} />
                Fill
              </label>
              {isFilled && <input type="color" value={fillColor} onChange={(e) => { setFillColor(e.target.value); setFill(e.target.value); }} className="w-7 h-7 rounded cursor-pointer" />}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-xl border-2 border-dashed border-border">
            <svg
              viewBox={viewBox}
              className="w-48 h-48"
            >
              <path
                d={path}
                fill={isFilled ? fillColor : "none"}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex justify-between items-center">
            <Badge variant="secondary">SVG Code</Badge>
            <Button size="sm" variant="ghost" onClick={copy}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</Button>
          </div>
          <pre className="bg-muted rounded-lg p-4 text-xs font-mono whitespace-pre-wrap overflow-auto">{svgCode}</pre>
        </div>
      </div>
    </ToolPage>
  );
}
