import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function BorderRadiusGenerator() {
  const [linked, setLinked] = useState(true);
  const [all, setAll] = useState(12);
  const [tl, setTl] = useState(12);
  const [tr, setTr] = useState(12);
  const [br, setBr] = useState(12);
  const [bl, setBl] = useState(12);

  const vals = linked ? [all, all, all, all] : [tl, tr, br, bl];
  const css = linked
    ? `border-radius: ${all}px;`
    : `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;

  const corners = [
    { label: "Top Left", value: tl, set: setTl },
    { label: "Top Right", value: tr, set: setTr },
    { label: "Bottom Right", value: br, set: setBr },
    { label: "Bottom Left", value: bl, set: setBl },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Border Radius Generator" description="Visually adjust CSS border-radius values" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Switch checked={linked} onCheckedChange={setLinked} />
            <span className="text-sm text-foreground">Link all corners</span>
          </div>
          {linked ? (
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-muted-foreground">All Corners</label>
                <span className="text-xs font-mono text-foreground">{all}px</span>
              </div>
              <Slider min={0} max={150} step={1} value={[all]} onValueChange={v => setAll(v[0])} />
            </div>
          ) : (
            corners.map(c => (
              <div key={c.label}>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-muted-foreground">{c.label}</label>
                  <span className="text-xs font-mono text-foreground">{c.value}px</span>
                </div>
                <Slider min={0} max={150} step={1} value={[c.value]} onValueChange={v => c.set(v[0])} />
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-center bg-muted rounded-lg border border-border min-h-[250px]">
          <div
            className="w-40 h-40 bg-primary"
            style={{ borderRadius: `${vals[0]}px ${vals[1]}px ${vals[2]}px ${vals[3]}px` }}
          />
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
