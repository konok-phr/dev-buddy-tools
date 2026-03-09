import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
}

export default function ColorMixer() {
  const [color1, setColor1] = useState("#ff0000");
  const [color2, setColor2] = useState("#0000ff");
  const [ratio, setRatio] = useState([50]);

  const mixed = useMemo(() => {
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    const t = ratio[0] / 100;
    return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
  }, [color1, color2, ratio]);

  const steps = useMemo(() => {
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    return Array.from({ length: 9 }, (_, i) => {
      const t = i / 8;
      return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
    });
  }, [color1, color2]);

  return (
    <div className="max-w-xl mx-auto">
      <ToolHeader title="Color Mixer" description="Mix two colors together and generate color steps" />
      <div className="flex gap-4 mb-4 items-end">
        <div><Label className="text-sm">Color 1</Label><Input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-16 h-10 p-1" /></div>
        <div><Label className="text-sm">Color 2</Label><Input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-16 h-10 p-1" /></div>
      </div>
      <div className="mb-4">
        <Label className="text-sm">Mix Ratio: {ratio[0]}%</Label>
        <Slider value={ratio} onValueChange={setRatio} min={0} max={100} step={1} />
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-20 h-20 rounded-md border" style={{ backgroundColor: mixed }} />
        <div>
          <p className="font-mono text-lg font-bold text-foreground">{mixed}</p>
          <CopyButton text={mixed} />
        </div>
      </div>
      <Label className="text-sm">Color Steps</Label>
      <div className="flex rounded-md overflow-hidden mt-1">
        {steps.map((c, i) => (
          <button key={i} className="flex-1 h-12 relative group" style={{ backgroundColor: c }} title={c} onClick={() => navigator.clipboard.writeText(c)}>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono opacity-0 group-hover:opacity-100 bg-black/40 text-white">{c}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
