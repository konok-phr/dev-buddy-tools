import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Matrix = [number, number, number, number, number, number, number, number, number];

const simulations: { name: string; matrix: Matrix }[] = [
  { name: "Protanopia (no red)", matrix: [0.567,0.433,0,0.558,0.442,0,0,0.242,0.758] },
  { name: "Deuteranopia (no green)", matrix: [0.625,0.375,0,0.7,0.3,0,0,0.3,0.7] },
  { name: "Tritanopia (no blue)", matrix: [0.95,0.05,0,0,0.433,0.567,0,0.475,0.525] },
  { name: "Achromatopsia (monochrome)", matrix: [0.299,0.587,0.114,0.299,0.587,0.114,0.299,0.587,0.114] },
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("");
}

function applyMatrix(rgb: [number, number, number], m: Matrix): [number, number, number] {
  return [
    m[0] * rgb[0] + m[1] * rgb[1] + m[2] * rgb[2],
    m[3] * rgb[0] + m[4] * rgb[1] + m[5] * rgb[2],
    m[6] * rgb[0] + m[7] * rgb[1] + m[8] * rgb[2],
  ];
}

export default function ColorBlindnessSimulator() {
  const [fg, setFg] = useState("#e74c3c");
  const [bg, setBg] = useState("#2ecc71");
  const [text, setText] = useState("#ffffff");

  const sims = useMemo(() =>
    simulations.map(s => ({
      name: s.name,
      fg: rgbToHex(...applyMatrix(hexToRgb(fg), s.matrix)),
      bg: rgbToHex(...applyMatrix(hexToRgb(bg), s.matrix)),
      text: rgbToHex(...applyMatrix(hexToRgb(text), s.matrix)),
    }))
  , [fg, bg, text]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Color Blindness Simulator" description="Preview how colors appear to people with color vision deficiency" />
      <div className="flex flex-wrap gap-4 mb-6">
        <div><Label>Foreground</Label><Input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-16 h-10 mt-1" /></div>
        <div><Label>Background</Label><Input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-16 h-10 mt-1" /></div>
        <div><Label>Text</Label><Input type="color" value={text} onChange={e => setText(e.target.value)} className="w-16 h-10 mt-1" /></div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg p-6 border border-border" style={{ background: bg }}>
          <div className="text-lg font-bold mb-2" style={{ color: fg }}>Normal Vision</div>
          <p style={{ color: text }}>Sample text on this background with foreground accent.</p>
          <div className="flex gap-2 mt-3">
            <div className="w-12 h-12 rounded" style={{ background: fg }} />
            <div className="w-12 h-12 rounded" style={{ background: bg, border: "2px solid" }} />
          </div>
        </div>

        {sims.map(s => (
          <div key={s.name} className="rounded-lg p-6 border border-border" style={{ background: s.bg }}>
            <div className="text-lg font-bold mb-2" style={{ color: s.fg }}>{s.name}</div>
            <p style={{ color: s.text }}>Sample text on this background with foreground accent.</p>
            <div className="flex gap-2 mt-3">
              <div className="w-12 h-12 rounded" style={{ background: s.fg }} />
              <div className="w-12 h-12 rounded" style={{ background: s.bg, border: "2px solid" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
