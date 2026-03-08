import { useState, useRef, useEffect } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

const SIZES = [16, 32, 48, 64, 128, 192, 512];

export default function FaviconGenerator() {
  const [emoji, setEmoji] = useState("🚀");
  const [bgColor, setBgColor] = useState("#4f46e5");
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const newPreviews: Record<number, string> = {};
    SIZES.forEach(size => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, size * 0.15);
      ctx.fill();
      ctx.font = `${size * 0.65}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, size / 2, size / 2 + size * 0.05);
      newPreviews[size] = canvas.toDataURL("image/png");
    });
    setPreviews(newPreviews);
  }, [emoji, bgColor]);

  const download = (size: number) => {
    const a = document.createElement("a");
    a.href = previews[size];
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  };

  const linkTags = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png">`;

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Favicon Generator" description="Generate favicons from emoji with custom backgrounds" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Emoji</label>
            <Input value={emoji} onChange={e => setEmoji(e.target.value)} className="text-2xl h-12 bg-card" maxLength={2} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Background Color</label>
            <div className="flex gap-2">
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-12 w-12 rounded border border-border cursor-pointer" />
              <Input value={bgColor} onChange={e => setBgColor(e.target.value)} className="font-mono bg-card h-12" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Sizes</label>
          <div className="flex flex-wrap gap-4">
            {SIZES.map(size => (
              <div key={size} className="flex flex-col items-center gap-1">
                {previews[size] && (
                  <img src={previews[size]} alt={`${size}x${size}`} className="rounded border border-border" style={{ width: Math.max(size, 32), height: Math.max(size, 32) }} />
                )}
                <span className="text-xs text-muted-foreground">{size}px</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => download(size)}>
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">HTML Link Tags</label>
            <CopyButton text={linkTags} />
          </div>
          <pre className="text-xs font-mono bg-card border border-border rounded p-3 overflow-x-auto">{linkTags}</pre>
        </div>
      </div>
    </div>
  );
}
