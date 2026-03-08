import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const options = {
  flexDirection: ["row", "row-reverse", "column", "column-reverse"],
  justifyContent: ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"],
  alignItems: ["flex-start", "flex-end", "center", "stretch", "baseline"],
  flexWrap: ["nowrap", "wrap", "wrap-reverse"],
};

export default function FlexboxPlayground() {
  const [dir, setDir] = useState("row");
  const [justify, setJustify] = useState("flex-start");
  const [align, setAlign] = useState("stretch");
  const [wrap, setWrap] = useState("nowrap");
  const [gap, setGap] = useState(8);
  const [items, setItems] = useState(5);

  const css = `display: flex;\nflex-direction: ${dir};\njustify-content: ${justify};\nalign-items: ${align};\nflex-wrap: ${wrap};\ngap: ${gap}px;`;

  const selects: { label: string; value: string; onChange: (v: string) => void; opts: string[] }[] = [
    { label: "Direction", value: dir, onChange: setDir, opts: options.flexDirection },
    { label: "Justify Content", value: justify, onChange: setJustify, opts: options.justifyContent },
    { label: "Align Items", value: align, onChange: setAlign, opts: options.alignItems },
    { label: "Flex Wrap", value: wrap, onChange: setWrap, opts: options.flexWrap },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Flexbox Playground" description="Visualize CSS flexbox properties interactively" />
      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-4">
          {selects.map(s => (
            <div key={s.label}>
              <label className="text-xs text-muted-foreground block mb-1">{s.label}</label>
              <Select value={s.value} onValueChange={s.onChange}>
                <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {s.opts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-muted-foreground">Gap</label>
              <span className="text-xs font-mono text-foreground">{gap}px</span>
            </div>
            <Slider min={0} max={40} step={2} value={[gap]} onValueChange={v => setGap(v[0])} />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-muted-foreground">Items</label>
              <span className="text-xs font-mono text-foreground">{items}</span>
            </div>
            <Slider min={1} max={12} step={1} value={[items]} onValueChange={v => setItems(v[0])} />
          </div>
        </div>
        <div
          className="min-h-[300px] rounded-lg border border-border bg-muted p-4"
          style={{ display: "flex", flexDirection: dir as any, justifyContent: justify, alignItems: align, flexWrap: wrap as any, gap }}
        >
          {Array.from({ length: items }, (_, i) => (
            <div key={i} className="flex items-center justify-center rounded-md bg-primary text-primary-foreground font-mono text-sm font-bold min-w-[48px] min-h-[48px] px-3 py-2">
              {i + 1}
            </div>
          ))}
        </div>
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
