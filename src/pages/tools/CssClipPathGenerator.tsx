import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const presets: Record<string, string> = {
  "Triangle": "polygon(50% 0%, 0% 100%, 100% 100%)",
  "Pentagon": "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  "Hexagon": "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  "Star": "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  "Circle": "circle(50% at 50% 50%)",
  "Ellipse": "ellipse(50% 35% at 50% 50%)",
  "Inset": "inset(10% 10% 10% 10% round 10px)",
  "Arrow Right": "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)",
  "Cross": "polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)",
  "Message": "polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)",
};

export default function CssClipPathGenerator() {
  const [selected, setSelected] = useState("Triangle");
  const [custom, setCustom] = useState("");

  const clipPath = custom || presets[selected];
  const css = `clip-path: ${clipPath};`;

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="CSS Clip Path Generator" description="Generate CSS clip-path shapes visually" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Preset Shape</label>
          <Select value={selected} onValueChange={v => { setSelected(v); setCustom(""); }}>
            <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(presets).map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center p-8 border border-border rounded-lg bg-card">
          <div className="w-48 h-48 bg-primary" style={{ clipPath }} />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Custom clip-path value (overrides preset)</label>
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm font-mono"
            placeholder="polygon(50% 0%, 0% 100%, 100% 100%)"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">CSS</label>
            <CopyButton text={css} />
          </div>
          <pre className="text-xs font-mono bg-card border border-border rounded p-3">{css}</pre>
        </div>
      </div>
    </div>
  );
}
