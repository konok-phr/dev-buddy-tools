import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const PROPERTIES = ["all", "opacity", "transform", "background-color", "color", "border", "box-shadow", "width", "height", "padding", "margin", "border-radius"];
const EASINGS = ["ease", "linear", "ease-in", "ease-out", "ease-in-out", "cubic-bezier(0.4, 0, 0.2, 1)", "cubic-bezier(0.68, -0.55, 0.27, 1.55)"];
const EASING_LABELS: Record<string, string> = {
  "ease": "ease", "linear": "linear", "ease-in": "ease-in", "ease-out": "ease-out", "ease-in-out": "ease-in-out",
  "cubic-bezier(0.4, 0, 0.2, 1)": "material", "cubic-bezier(0.68, -0.55, 0.27, 1.55)": "bounce",
};

interface TransitionItem { property: string; duration: number; delay: number; easing: string; }

export default function CssTransitionBuilder() {
  const [items, setItems] = useState<TransitionItem[]>([
    { property: "all", duration: 300, delay: 0, easing: "ease" },
  ]);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    return `transition: ${items.map((i) => `${i.property} ${i.duration}ms ${i.easing} ${i.delay}ms`).join(",\n             ")};`;
  }, [items]);

  const update = (idx: number, field: keyof TransitionItem, val: string | number) => {
    const next = [...items];
    (next[idx] as any)[field] = val;
    setItems(next);
  };

  const copy = () => { navigator.clipboard.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const previewStyle = useMemo(() => {
    const t = items.map((i) => `${i.property} ${i.duration}ms ${i.easing} ${i.delay}ms`).join(", ");
    return {
      transition: t,
      transform: hovered ? "scale(1.15) rotate(5deg)" : "scale(1)",
      opacity: hovered ? 1 : 0.7,
      backgroundColor: hovered ? "hsl(var(--primary))" : "hsl(var(--muted))",
      borderRadius: hovered ? "24px" : "12px",
      boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.1)",
    };
  }, [items, hovered]);

  return (
    <ToolPage toolId="css-transition" title="CSS Transition Builder" description="Build multi-property CSS transitions visually">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="border border-border rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Transition {i + 1}</Badge>
                {items.length > 1 && <Button size="icon" variant="ghost" onClick={() => setItems(items.filter((_, j) => j !== i))}><X className="w-4 h-4" /></Button>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select value={item.property} onValueChange={(v) => update(i, "property", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PROPERTIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={item.easing} onValueChange={(v) => update(i, "easing", v)}>
                  <SelectTrigger><SelectValue>{EASING_LABELS[item.easing] || item.easing}</SelectValue></SelectTrigger>
                  <SelectContent>{EASINGS.map((e) => <SelectItem key={e} value={e}>{EASING_LABELS[e] || e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground"><span>Duration</span><span>{item.duration}ms</span></div>
                <Slider min={50} max={2000} step={50} value={[item.duration]} onValueChange={([v]) => update(i, "duration", v)} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground"><span>Delay</span><span>{item.delay}ms</span></div>
                <Slider min={0} max={1000} step={50} value={[item.delay]} onValueChange={([v]) => update(i, "delay", v)} />
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => setItems([...items, { property: "opacity", duration: 300, delay: 0, easing: "ease" }])}>
            <Plus className="w-3 h-3 mr-1" /> Add Transition
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center h-64 rounded-xl bg-muted/50">
            <div
              className="w-28 h-28 flex items-center justify-center text-sm font-medium cursor-pointer select-none"
              style={previewStyle}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              Hover me
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Badge variant="secondary">CSS</Badge>
            <Button size="sm" variant="ghost" onClick={copy}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</Button>
          </div>
          <pre className="bg-muted rounded-lg p-4 text-xs font-mono whitespace-pre-wrap">{css}</pre>
        </div>
      </div>
    </ToolPage>
  );
}
