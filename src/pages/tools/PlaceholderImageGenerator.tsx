import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PlaceholderImageGenerator() {
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("400");
  const [bgColor, setBgColor] = useState("#cccccc");
  const [textColor, setTextColor] = useState("#333333");
  const [text, setText] = useState("");
  const [format, setFormat] = useState("svg");

  const w = parseInt(width) || 800;
  const h = parseInt(height) || 400;
  const label = text || `${w} × ${h}`;

  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect fill="${bgColor}" width="100%" height="100%"/><text fill="${textColor}" font-family="sans-serif" font-size="${Math.min(w, h) / 8}" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${label}</text></svg>`;
  const dataUri = `data:image/svg+xml,${encodeURIComponent(svgStr)}`;

  const htmlTag = `<img src="${dataUri}" width="${w}" height="${h}" alt="Placeholder" />`;
  const picsumUrl = `https://picsum.photos/${w}/${h}`;

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Placeholder Image Generator" description="Generate placeholder images for mockups & prototypes" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Width</label>
            <Input value={width} onChange={e => setWidth(e.target.value)} type="number" className="bg-card" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Height</label>
            <Input value={height} onChange={e => setHeight(e.target.value)} type="number" className="bg-card" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Background Color</label>
            <div className="flex gap-2">
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-9 w-9 rounded border border-border cursor-pointer" />
              <Input value={bgColor} onChange={e => setBgColor(e.target.value)} className="font-mono bg-card" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Text Color</label>
            <div className="flex gap-2">
              <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="h-9 w-9 rounded border border-border cursor-pointer" />
              <Input value={textColor} onChange={e => setTextColor(e.target.value)} className="font-mono bg-card" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Custom Text (optional)</label>
          <Input value={text} onChange={e => setText(e.target.value)} className="bg-card" placeholder={`${w} × ${h}`} />
        </div>

        <div className="border border-border rounded-lg p-4 bg-card flex justify-center">
          <img src={dataUri} alt="Placeholder" className="max-w-full rounded" style={{ maxHeight: 300 }} />
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">SVG Data URI</label>
              <CopyButton text={dataUri} />
            </div>
            <pre className="text-xs font-mono bg-card border border-border rounded p-2 overflow-x-auto truncate">{dataUri.slice(0, 120)}...</pre>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">HTML Tag</label>
              <CopyButton text={htmlTag} />
            </div>
            <pre className="text-xs font-mono bg-card border border-border rounded p-2 overflow-x-auto truncate">{htmlTag.slice(0, 100)}...</pre>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">Lorem Picsum (random photo)</label>
              <CopyButton text={picsumUrl} />
            </div>
            <pre className="text-xs font-mono bg-card border border-border rounded p-2">{picsumUrl}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
