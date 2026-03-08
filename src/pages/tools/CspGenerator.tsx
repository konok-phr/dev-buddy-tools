import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Directive {
  key: string;
  label: string;
  description: string;
  values: string[];
}

const DIRECTIVES: Directive[] = [
  { key: "default-src", label: "default-src", description: "Fallback for other directives", values: ["'self'"] },
  { key: "script-src", label: "script-src", description: "JavaScript sources", values: ["'self'"] },
  { key: "style-src", label: "style-src", description: "CSS sources", values: ["'self'", "'unsafe-inline'"] },
  { key: "img-src", label: "img-src", description: "Image sources", values: ["'self'", "data:"] },
  { key: "font-src", label: "font-src", description: "Font sources", values: ["'self'"] },
  { key: "connect-src", label: "connect-src", description: "XHR, WebSocket, fetch", values: ["'self'"] },
  { key: "media-src", label: "media-src", description: "Audio & video sources", values: [] },
  { key: "frame-src", label: "frame-src", description: "iframe sources", values: [] },
  { key: "object-src", label: "object-src", description: "Plugin sources", values: ["'none'"] },
  { key: "base-uri", label: "base-uri", description: "Base URL for relative", values: ["'self'"] },
  { key: "form-action", label: "form-action", description: "Form submit targets", values: ["'self'"] },
  { key: "frame-ancestors", label: "frame-ancestors", description: "Who can embed this page", values: ["'none'"] },
];

const COMMON_VALUES = ["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", "data:", "blob:", "https:", "*"];

export default function CspGenerator() {
  const [directives, setDirectives] = useState<Record<string, string[]>>(
    Object.fromEntries(DIRECTIVES.map(d => [d.key, [...d.values]]))
  );
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [reportUri, setReportUri] = useState("");
  const [upgradeInsecure, setUpgradeInsecure] = useState(false);
  const [blockMixed, setBlockMixed] = useState(false);

  const toggleValue = (dir: string, val: string) => {
    setDirectives(prev => {
      const current = prev[dir] || [];
      return { ...prev, [dir]: current.includes(val) ? current.filter(v => v !== val) : [...current, val] };
    });
  };

  const addCustom = (dir: string) => {
    const val = customInputs[dir]?.trim();
    if (!val) return;
    setDirectives(prev => ({ ...prev, [dir]: [...(prev[dir] || []), val] }));
    setCustomInputs(prev => ({ ...prev, [dir]: "" }));
  };

  const removeValue = (dir: string, val: string) => {
    setDirectives(prev => ({ ...prev, [dir]: (prev[dir] || []).filter(v => v !== val) }));
  };

  const generateCsp = (): string => {
    const parts: string[] = [];
    for (const d of DIRECTIVES) {
      const vals = directives[d.key];
      if (vals && vals.length > 0) parts.push(`${d.key} ${vals.join(" ")}`);
    }
    if (upgradeInsecure) parts.push("upgrade-insecure-requests");
    if (blockMixed) parts.push("block-all-mixed-content");
    if (reportUri) parts.push(`report-uri ${reportUri}`);
    return parts.join("; ");
  };

  const csp = generateCsp();
  const metaTag = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
  const headerTag = `Content-Security-Policy: ${csp}`;

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="CSP Generator" description="Generate Content Security Policy headers interactively" />

      <div className="space-y-4 mb-6">
        {DIRECTIVES.map(d => (
          <div key={d.key} className="p-3 border rounded-md bg-card">
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs font-mono font-semibold">{d.label}</Label>
              <span className="text-[10px] text-muted-foreground">{d.description}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {COMMON_VALUES.map(v => (
                <Button
                  key={v} size="sm" variant={(directives[d.key] || []).includes(v) ? "default" : "outline"}
                  className="h-6 text-[10px] px-2"
                  onClick={() => toggleValue(d.key, v)}
                >{v}</Button>
              ))}
            </div>
            {(directives[d.key] || []).filter(v => !COMMON_VALUES.includes(v)).map(v => (
              <span key={v} className="inline-flex items-center gap-1 text-[10px] bg-muted px-2 py-0.5 rounded mr-1 mb-1">
                {v} <button className="text-muted-foreground hover:text-foreground" onClick={() => removeValue(d.key, v)}>×</button>
              </span>
            ))}
            <div className="flex gap-1 mt-1">
              <Input
                value={customInputs[d.key] || ""}
                onChange={e => setCustomInputs(p => ({ ...p, [d.key]: e.target.value }))}
                placeholder="custom domain..."
                className="h-7 text-xs font-mono"
                onKeyDown={e => e.key === "Enter" && addCustom(d.key)}
              />
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => addCustom(d.key)}>Add</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2"><Checkbox checked={upgradeInsecure} onCheckedChange={() => setUpgradeInsecure(!upgradeInsecure)} id="ui" /><Label htmlFor="ui" className="text-xs">upgrade-insecure-requests</Label></div>
        <div className="flex items-center gap-2"><Checkbox checked={blockMixed} onCheckedChange={() => setBlockMixed(!blockMixed)} id="bm" /><Label htmlFor="bm" className="text-xs">block-all-mixed-content</Label></div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">HTTP Header</label>
            <CopyButton text={headerTag} />
          </div>
          <pre className="bg-card border rounded-md p-3 text-xs font-mono overflow-auto whitespace-pre-wrap text-foreground">{headerTag}</pre>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Meta Tag</label>
            <CopyButton text={metaTag} />
          </div>
          <pre className="bg-card border rounded-md p-3 text-xs font-mono overflow-auto whitespace-pre-wrap text-foreground">{metaTag}</pre>
        </div>
      </div>
    </div>
  );
}
