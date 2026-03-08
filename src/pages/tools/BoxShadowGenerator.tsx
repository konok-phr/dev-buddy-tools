import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function BoxShadowGenerator() {
  const [x, setX] = useState(4);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(10);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#00000040");
  const [inset, setInset] = useState(false);

  const shadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`;

  const controls = [
    { label: "Offset X", value: x, set: setX, min: -50, max: 50 },
    { label: "Offset Y", value: y, set: setY, min: -50, max: 50 },
    { label: "Blur", value: blur, set: setBlur, min: 0, max: 100 },
    { label: "Spread", value: spread, set: setSpread, min: -50, max: 50 },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Box Shadow Generator" description="Visually design CSS box-shadow values" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {controls.map(c => (
            <div key={c.label}>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-muted-foreground">{c.label}</label>
                <span className="text-xs font-mono text-foreground">{c.value}px</span>
              </div>
              <Slider min={c.min} max={c.max} step={1} value={[c.value]} onValueChange={v => c.set(v[0])} />
            </div>
          ))}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Color</label>
            <Input value={color} onChange={e => setColor(e.target.value)} className="font-mono bg-card" />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={inset} onCheckedChange={setInset} />
            <span className="text-sm text-foreground">Inset</span>
          </div>
        </div>
        <div className="flex items-center justify-center bg-muted rounded-lg border border-border min-h-[250px]">
          <div className="w-32 h-32 rounded-lg bg-card border border-border" style={{ boxShadow: shadow }} />
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">CSS</span>
          <CopyButton text={`box-shadow: ${shadow};`} />
        </div>
        <pre className="font-mono text-xs text-muted-foreground">{`box-shadow: ${shadow};`}</pre>
      </div>
    </div>
  );
}
