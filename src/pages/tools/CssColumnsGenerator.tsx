import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CssColumnsGenerator() {
  const [count, setCount] = useState([3]);
  const [gap, setGap] = useState([20]);
  const [ruleStyle, setRuleStyle] = useState("solid");
  const [ruleWidth, setRuleWidth] = useState([1]);

  const css = useMemo(() => `column-count: ${count[0]};
column-gap: ${gap[0]}px;
column-rule: ${ruleWidth[0]}px ${ruleStyle} currentColor;`, [count, gap, ruleStyle, ruleWidth]);

  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.";

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="CSS Columns Generator" description="Generate CSS multi-column layouts visually" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div><Label className="text-xs">Columns: {count[0]}</Label><Slider value={count} onValueChange={setCount} min={1} max={6} /></div>
        <div><Label className="text-xs">Gap: {gap[0]}px</Label><Slider value={gap} onValueChange={setGap} min={0} max={60} /></div>
        <div><Label className="text-xs">Rule Width: {ruleWidth[0]}px</Label><Slider value={ruleWidth} onValueChange={setRuleWidth} min={0} max={5} /></div>
        <div><Label className="text-xs">Rule Style</Label>
          <Select value={ruleStyle} onValueChange={setRuleStyle}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["none","solid","dashed","dotted","double"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select></div>
      </div>
      <div className="border rounded-md p-4 mb-4 text-sm text-foreground" style={{ columnCount: count[0], columnGap: `${gap[0]}px`, columnRule: `${ruleWidth[0]}px ${ruleStyle} currentColor` }}>{text}</div>
      <div className="flex justify-end mb-1"><CopyButton text={css} /></div>
      <pre className="border rounded-md p-3 text-xs font-mono text-foreground">{css}</pre>
    </div>
  );
}
