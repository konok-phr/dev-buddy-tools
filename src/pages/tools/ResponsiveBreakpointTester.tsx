import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const presets = [
  { name: "iPhone SE", w: 375, h: 667 },
  { name: "iPhone 14", w: 390, h: 844 },
  { name: "iPhone 14 Pro Max", w: 430, h: 932 },
  { name: "iPad Mini", w: 768, h: 1024 },
  { name: "iPad Pro 12.9\"", w: 1024, h: 1366 },
  { name: "Laptop", w: 1366, h: 768 },
  { name: "Desktop", w: 1920, h: 1080 },
  { name: "Galaxy S21", w: 360, h: 800 },
  { name: "Pixel 7", w: 412, h: 915 },
];

export default function ResponsiveBreakpointTester() {
  const [url, setUrl] = useState("https://example.com");
  const [width, setWidth] = useState(375);
  const [height, setHeight] = useState(667);
  const [activeName, setActiveName] = useState("iPhone SE");

  const selectPreset = (p: typeof presets[0]) => {
    setWidth(p.w);
    setHeight(p.h);
    setActiveName(p.name);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader title="Responsive Breakpoint Tester" description="Preview websites at different screen sizes" />
      <div className="space-y-4">
        <div>
          <Label>URL to Preview</Label>
          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="mt-1" />
        </div>

        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button
              key={p.name}
              onClick={() => selectPreset(p)}
              className={`px-3 py-1.5 rounded text-xs border transition-colors ${activeName === p.name ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
            >
              {p.name} ({p.w}×{p.h})
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          <div>
            <Label>Width</Label>
            <Input type="number" value={width} onChange={e => { setWidth(+e.target.value); setActiveName("Custom"); }} className="w-24 mt-1" />
          </div>
          <span className="mt-6 text-muted-foreground">×</span>
          <div>
            <Label>Height</Label>
            <Input type="number" value={height} onChange={e => { setHeight(+e.target.value); setActiveName("Custom"); }} className="w-24 mt-1" />
          </div>
          <span className="mt-6 text-sm text-muted-foreground">{activeName}</span>
        </div>

        <div className="flex justify-center bg-muted/50 rounded-lg p-4 overflow-auto">
          <div className="border-2 border-border rounded-lg overflow-hidden shadow-lg" style={{ width: `${Math.min(width, 1200)}px`, height: `${Math.min(height, 800)}px` }}>
            <iframe
              src={url}
              title="Preview"
              className="w-full h-full"
              style={{ transform: width > 1200 ? `scale(${1200 / width})` : undefined, transformOrigin: "top left", width: `${width}px`, height: `${height}px` }}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
