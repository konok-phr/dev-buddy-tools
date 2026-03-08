import { useState, useRef, useCallback } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Lock } from "lucide-react";

export default function ImageResizer() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState("");
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(0.9);
  const [resizedUrl, setResizedUrl] = useState("");
  const [resizedSize, setResizedSize] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setImage(img);
      setPreview(url);
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setResizedUrl("");
    };
    img.src = url;
  };

  const updateWidth = (w: number) => {
    setWidth(w);
    if (lockAspect && origW > 0) setHeight(Math.round((w / origW) * origH));
  };
  const updateHeight = (h: number) => {
    setHeight(h);
    if (lockAspect && origH > 0) setWidth(Math.round((h / origH) * origW));
  };

  const resize = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, width, height);

    canvas.toBlob(blob => {
      if (blob) {
        setResizedUrl(URL.createObjectURL(blob));
        setResizedSize(blob.size);
      }
    }, format, quality);
  }, [image, width, height, format, quality]);

  const download = () => {
    if (!resizedUrl) return;
    const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    const a = document.createElement("a");
    a.href = resizedUrl;
    a.download = `resized-${width}x${height}.${ext}`;
    a.click();
  };

  const presets = [
    { label: "HD", w: 1280, h: 720 },
    { label: "FHD", w: 1920, h: 1080 },
    { label: "4K", w: 3840, h: 2160 },
    { label: "Square", w: 1024, h: 1024 },
    { label: "Thumb", w: 200, h: 200 },
    { label: "OG Image", w: 1200, h: 630 },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Image Resizer" description="Resize images to exact dimensions with format conversion" />
      <canvas ref={canvasRef} className="hidden" />

      {!image ? (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
          onDragOver={e => e.preventDefault()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Drop an image or click to upload</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 flex gap-4 flex-col sm:flex-row items-start">
            <img src={preview} alt="Original" className="w-32 h-32 object-cover rounded-lg shrink-0" />
            <div className="flex-1 space-y-3">
              <Badge variant="outline">{origW} × {origH}px original</Badge>

              <div className="flex flex-wrap gap-2">
                {presets.map(p => (
                  <Badge key={p.label} variant="outline" className="cursor-pointer hover:bg-accent text-xs" onClick={() => { setWidth(p.w); setHeight(p.h); }}>
                    {p.label} ({p.w}×{p.h})
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Width</label>
                  <Input type="number" value={width} onChange={e => updateWidth(Number(e.target.value))} className="w-24 text-sm font-mono" />
                </div>
                <div className="pt-4">
                  <Lock className={`h-4 w-4 cursor-pointer ${lockAspect ? "text-primary" : "text-muted-foreground"}`} onClick={() => setLockAspect(!lockAspect)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Height</label>
                  <Input type="number" value={height} onChange={e => updateHeight(Number(e.target.value))} className="w-24 text-sm font-mono" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/png">PNG</SelectItem>
                    <SelectItem value="image/jpeg">JPEG</SelectItem>
                    <SelectItem value="image/webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
                {format !== "image/png" && (
                  <div>
                    <label className="text-xs text-muted-foreground">Quality</label>
                    <Input type="number" value={Math.round(quality * 100)} onChange={e => setQuality(Number(e.target.value) / 100)} className="w-20 text-sm" min={1} max={100} />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={resize}>Resize</Button>
                <Button variant="outline" onClick={() => { setImage(null); setPreview(""); setResizedUrl(""); }}>Reset</Button>
              </div>
            </div>
          </div>

          {resizedUrl && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">Resized</h3>
                  <Badge variant="secondary">{width} × {height}px</Badge>
                  <Badge variant="outline">{(resizedSize / 1024).toFixed(1)} KB</Badge>
                </div>
                <Button size="sm" onClick={download}><Download className="h-3.5 w-3.5 mr-1" />Download</Button>
              </div>
              <img src={resizedUrl} alt="Resized" className="max-w-full max-h-[300px] rounded-lg object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
