import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const cssToTw: Record<string, (v: string) => string> = {
  "display": v => ({ flex: "flex", grid: "grid", block: "block", "inline-block": "inline-block", "inline-flex": "inline-flex", inline: "inline", none: "hidden" }[v] || ""),
  "position": v => ({ relative: "relative", absolute: "absolute", fixed: "fixed", sticky: "sticky", static: "static" }[v] || ""),
  "text-align": v => `text-${v}`,
  "font-weight": v => {
    const map: Record<string, string> = { "100": "font-thin", "200": "font-extralight", "300": "font-light", "400": "font-normal", "500": "font-medium", "600": "font-semibold", "700": "font-bold", "800": "font-extrabold", "900": "font-black", bold: "font-bold", normal: "font-normal" };
    return map[v] || "";
  },
  "overflow": v => `overflow-${v}`,
  "cursor": v => `cursor-${v}`,
  "flex-direction": v => ({ row: "flex-row", column: "flex-col", "row-reverse": "flex-row-reverse", "column-reverse": "flex-col-reverse" }[v] || ""),
  "justify-content": v => ({ center: "justify-center", "flex-start": "justify-start", "flex-end": "justify-end", "space-between": "justify-between", "space-around": "justify-around", "space-evenly": "justify-evenly" }[v] || ""),
  "align-items": v => ({ center: "items-center", "flex-start": "items-start", "flex-end": "items-end", stretch: "items-stretch", baseline: "items-baseline" }[v] || ""),
  "flex-wrap": v => ({ wrap: "flex-wrap", nowrap: "flex-nowrap", "wrap-reverse": "flex-wrap-reverse" }[v] || ""),
};

function pxToTwSpacing(px: string): string {
  const n = parseFloat(px);
  if (isNaN(n)) return px;
  const rem = n / 4;
  if (rem === Math.round(rem)) return String(rem);
  return `[${px}]`;
}

function convertLine(prop: string, value: string): string {
  prop = prop.trim();
  value = value.trim().replace(/;$/, "");
  
  if (cssToTw[prop]) {
    const r = cssToTw[prop](value);
    if (r) return r;
  }
  
  const spacingProps: Record<string, string> = {
    "margin": "m", "margin-top": "mt", "margin-right": "mr", "margin-bottom": "mb", "margin-left": "ml",
    "padding": "p", "padding-top": "pt", "padding-right": "pr", "padding-bottom": "pb", "padding-left": "pl",
    "gap": "gap", "width": "w", "height": "h", "max-width": "max-w", "max-height": "max-h",
    "min-width": "min-w", "min-height": "min-h", "top": "top", "right": "right", "bottom": "bottom", "left": "left",
  };
  
  if (spacingProps[prop] && value.endsWith("px")) {
    return `${spacingProps[prop]}-${pxToTwSpacing(value)}`;
  }
  if (spacingProps[prop] && (value === "auto" || value === "0")) {
    return `${spacingProps[prop]}-${value}`;
  }
  
  if (prop === "border-radius" && value.endsWith("px")) {
    const n = parseFloat(value);
    if (n === 0) return "rounded-none";
    if (n <= 2) return "rounded-sm";
    if (n <= 4) return "rounded";
    if (n <= 6) return "rounded-md";
    if (n <= 8) return "rounded-lg";
    if (n <= 12) return "rounded-xl";
    if (n <= 16) return "rounded-2xl";
    if (n <= 24) return "rounded-3xl";
    return `rounded-[${value}]`;
  }
  
  if (prop === "font-size" && value.endsWith("px")) {
    const map: Record<number, string> = { 12: "text-xs", 14: "text-sm", 16: "text-base", 18: "text-lg", 20: "text-xl", 24: "text-2xl", 30: "text-3xl", 36: "text-4xl" };
    const n = parseFloat(value);
    return map[n] || `text-[${value}]`;
  }

  return `/* ${prop}: ${value} */`;
}

function convertCSS(css: string): string {
  const lines = css.split("\n").map(l => l.trim()).filter(Boolean);
  const classes: string[] = [];
  for (const line of lines) {
    if (line.includes("{") || line.includes("}")) continue;
    const [prop, ...rest] = line.split(":");
    if (!prop || rest.length === 0) continue;
    const val = rest.join(":").replace(/;$/, "").trim();
    const tw = convertLine(prop.trim(), val);
    if (tw) classes.push(tw);
  }
  return classes.join(" ");
}

export default function TailwindConverter() {
  const [css, setCss] = useState(`display: flex;
justify-content: center;
align-items: center;
padding: 16px;
margin-top: 8px;
border-radius: 8px;
font-size: 14px;
font-weight: 600;
cursor: pointer;`);

  const result = useMemo(() => convertCSS(css), [css]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Tailwind CSS Converter" description="Convert CSS properties to Tailwind utility classes" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">CSS Input</label>
          <Textarea value={css} onChange={e => setCss(e.target.value)} className="font-mono text-xs bg-card min-h-[150px]" placeholder="Paste CSS properties..." />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Tailwind Classes</label>
            <CopyButton text={result} />
          </div>
          <div className="bg-card border border-border rounded p-3">
            <code className="text-sm font-mono text-foreground break-all">{result || "Enter CSS above..."}</code>
          </div>
        </div>
        {result && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">JSX Usage</label>
              <CopyButton text={`className="${result}"`} />
            </div>
            <pre className="text-xs font-mono bg-card border border-border rounded p-3 overflow-x-auto">
              {`<div className="${result}">\n  ...\n</div>`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
