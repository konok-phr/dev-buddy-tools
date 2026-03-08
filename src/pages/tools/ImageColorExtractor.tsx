import { useState, useRef } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Badge } from "@/components/ui/badge";
import { Upload, Pipette } from "lucide-react";

interface ColorInfo {
  hex: string;
  rgb: string;
  count: number;
  percentage: number;
}

function extractColors(canvas: HTMLCanvasElement, numColors: number): ColorInfo[] {
  const ctx = canvas.getContext("2d")!;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const colorMap: Record<string, number> = {};
  const total = data.length / 4;

  // Quantize colors to reduce noise
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 16) * 16;
    const g = Math.round(data[i + 1] / 16) * 16;
    const b = Math.round(data[i + 2] / 16) * 16;
    const a = data[i + 3];
    if (a < 128) continue;
    const key = `${Math.min(r, 255)},${Math.min(g, 255)},${Math.min(b, 255)}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }

  return Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, numColors)
    .map(([key, count]) => {
      const [r, g, b] = key.split(",").map(Number);
      return {
        hex: `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
        rgb: `rgb(${r}, ${g}, ${b})`,
        count,
        percentage: Math.round((count / total) * 100),
      };
    });
}

export default function ImageColorExtractor() {
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [preview, setPreview] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);

    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const scale = Math.min(1, 200 / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setColors(extractColors(canvas, 12));
    };
    img.src = url;
  };

  const paletteText = colors.map(c => `${c.hex} (${c.percentage}%)`).join("\n");

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Image Color Extractor" description="Extract dominant colors and palette from any image" />
      <canvas ref={canvasRef} className="hidden" />

      <div
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors mb-4"
        onClick={() => fileRef.current?.click()}
        onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
        onDragOver={e => e.preventDefault()}
      >
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Drop an image or click to upload</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {preview && colors.length > 0 && (
        <div className="space-y-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <img src={preview} alt="Source" className="w-48 h-48 object-cover rounded-lg shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Pipette className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Extracted Palette</h3>
                </div>
                <CopyButton text={paletteText} />
              </div>
              {/* Color strip */}
              <div className="flex rounded-lg overflow-hidden h-12 mb-3">
                {colors.slice(0, 8).map((c, i) => (
                  <div key={i} className="flex-1 cursor-pointer group relative" style={{ backgroundColor: c.hex }}
                    onClick={() => navigator.clipboard.writeText(c.hex)}
                    title={c.hex}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">Click any color to copy hex code</div>
            </div>
          </div>

          {/* Color grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {colors.map((c, i) => (
              <div key={i} className="border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => navigator.clipboard.writeText(c.hex)}
              >
                <div className="w-full h-16 rounded-md mb-2" style={{ backgroundColor: c.hex }} />
                <p className="font-mono text-xs font-semibold text-foreground">{c.hex}</p>
                <p className="font-mono text-xs text-muted-foreground">{c.rgb}</p>
                <Badge variant="outline" className="mt-1 text-xs">{c.percentage}%</Badge>
              </div>
            ))}
          </div>

          {/* CSS Variables */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground">CSS Variables</h3>
              <CopyButton text={colors.slice(0, 8).map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n")} />
            </div>
            <pre className="text-xs font-mono text-foreground bg-muted p-3 rounded">
              {`:root {\n${colors.slice(0, 8).map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n")}\n}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
