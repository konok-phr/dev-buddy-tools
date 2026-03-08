import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

export default function TextShadowGenerator() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [blur, setBlur] = useState(4);
  const [color, setColor] = useState("#00000060");
  const [text, setText] = useState("Sample Text");

  const shadow = `${x}px ${y}px ${blur}px ${color}`;
  const css = `text-shadow: ${shadow};`;

  const controls = [
    { label: "Offset X", value: x, set: setX, min: -30, max: 30 },
    { label: "Offset Y", value: y, set: setY, min: -30, max: 30 },
    { label: "Blur", value: blur, set: setBlur, min: 0, max: 50 },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Text Shadow Generator" description="Visually design CSS text-shadow values" />
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
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Preview Text</label>
            <Input value={text} onChange={e => setText(e.target.value)} className="bg-card" />
          </div>
        </div>
        <div className="flex items-center justify-center bg-muted rounded-lg border border-border min-h-[250px]">
          <span className="text-4xl font-bold text-foreground" style={{ textShadow: shadow }}>{text}</span>
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
