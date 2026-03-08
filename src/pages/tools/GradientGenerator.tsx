import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Stop { color: string; position: number }

export default function GradientGenerator() {
  const [type, setType] = useState("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { color: "#6366f1", position: 0 },
    { color: "#ec4899", position: 100 },
  ]);

  const updateStop = (i: number, patch: Partial<Stop>) =>
    setStops(s => s.map((st, j) => j === i ? { ...st, ...patch } : st));

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const colorsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(", ");
  const gradient = type === "linear"
    ? `linear-gradient(${angle}deg, ${colorsStr})`
    : `radial-gradient(circle, ${colorsStr})`;
  const css = `background: ${gradient};`;

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Gradient Generator" description="Create beautiful CSS gradients visually" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {type === "linear" && (
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-muted-foreground">Angle</label>
                <span className="text-xs font-mono text-foreground">{angle}°</span>
              </div>
              <Slider min={0} max={360} step={1} value={[angle]} onValueChange={v => setAngle(v[0])} />
            </div>
          )}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Color Stops</span>
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setStops(s => [...s, { color: "#ffffff", position: 50 }])}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {stops.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="color" value={s.color} onChange={e => updateStop(i, { color: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                <Input value={s.color} onChange={e => updateStop(i, { color: e.target.value })} className="font-mono bg-card text-xs flex-1" />
                <div className="w-20">
                  <Slider min={0} max={100} step={1} value={[s.position]} onValueChange={v => updateStop(i, { position: v[0] })} />
                </div>
                <span className="text-xs font-mono text-muted-foreground w-8">{s.position}%</span>
                {stops.length > 2 && (
                  <Button variant="ghost" size="sm" className="h-7 px-1" onClick={() => setStops(st => st.filter((_, j) => j !== i))}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="min-h-[250px] rounded-lg border border-border" style={{ background: gradient }} />
      </div>
      <div className="bg-card border border-border rounded-lg p-4 mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">CSS</span>
          <CopyButton text={css} />
        </div>
        <pre className="font-mono text-xs text-muted-foreground whitespace-pre">{css}</pre>
      </div>
    </div>
  );
}
