import { useState, useRef, useCallback, useEffect } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, RotateCcw, Lock, Unlock } from "lucide-react";

interface CropArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

const ASPECT_PRESETS = [
  { label: "Free", ratio: 0 },
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "3:2", ratio: 3 / 2 },
  { label: "2:3", ratio: 2 / 3 },
  { label: "9:16", ratio: 9 / 16 },
  { label: "OG 1200×630", ratio: 1200 / 630 },
];

export default function ImageCropper() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState("");
  const [crop, setCrop] = useState<CropArea>({ x: 50, y: 50, w: 200, h: 200 });
  const [aspectRatio, setAspectRatio] = useState(0);
  const [dragging, setDragging] = useState<"move" | "resize" | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cx: 0, cy: 0, cw: 0, ch: 0 });
  const [croppedUrl, setCroppedUrl] = useState("");
  const [croppedSize, setCroppedSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Display scale factor
  const [displayScale, setDisplayScale] = useState(1);
  const [displayW, setDisplayW] = useState(0);
  const [displayH, setDisplayH] = useState(0);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setCroppedUrl("");
    const img = new window.Image();
    img.onload = () => {
      setImage(img);
      const maxW = 600;
      const scale = Math.min(1, maxW / img.naturalWidth);
      setDisplayScale(scale);
      setDisplayW(img.naturalWidth * scale);
      setDisplayH(img.naturalHeight * scale);
      const size = Math.min(img.naturalWidth * scale, img.naturalHeight * scale) * 0.6;
      const w = size;
      const h = aspectRatio > 0 ? w / aspectRatio : size;
      setCrop({
        x: (img.naturalWidth * scale - w) / 2,
        y: (img.naturalHeight * scale - h) / 2,
        w, h: Math.min(h, img.naturalHeight * scale),
      });
    };
    img.src = url;
  };

  const clampCrop = useCallback((c: CropArea): CropArea => {
    let { x, y, w, h } = c;
    w = Math.max(20, Math.min(w, displayW));
    h = Math.max(20, Math.min(h, displayH));
    x = Math.max(0, Math.min(x, displayW - w));
    y = Math.max(0, Math.min(y, displayH - h));
    return { x, y, w, h };
  }, [displayW, displayH]);

  const onMouseDown = (e: React.MouseEvent, type: "move" | "resize") => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(type);
    setDragStart({ x: e.clientX, y: e.clientY, cx: crop.x, cy: crop.y, cw: crop.w, ch: crop.h });
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      if (dragging === "move") {
        setCrop(clampCrop({ x: dragStart.cx + dx, y: dragStart.cy + dy, w: crop.w, h: crop.h }));
      } else {
        let newW = Math.max(20, dragStart.cw + dx);
        let newH = aspectRatio > 0 ? newW / aspectRatio : Math.max(20, dragStart.ch + dy);
        newW = Math.min(newW, displayW - crop.x);
        newH = Math.min(newH, displayH - crop.y);
        if (aspectRatio > 0) {
          newH = newW / aspectRatio;
          if (newH > displayH - crop.y) {
            newH = displayH - crop.y;
            newW = newH * aspectRatio;
          }
        }
        setCrop(clampCrop({ x: crop.x, y: crop.y, w: newW, h: newH }));
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, dragStart, crop, aspectRatio, displayW, displayH, clampCrop]);

  const applyAspect = (ratio: number) => {
    setAspectRatio(ratio);
    if (ratio > 0 && image) {
      const newH = crop.w / ratio;
      setCrop(clampCrop({ ...crop, h: Math.min(newH, displayH - crop.y) }));
    }
  };

  const doCrop = () => {
    if (!image || !canvasRef.current) return;
    const scale = 1 / displayScale;
    const sx = crop.x * scale;
    const sy = crop.y * scale;
    const sw = crop.w * scale;
    const sh = crop.h * scale;

    const canvas = canvasRef.current;
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    setCroppedSize({ w: canvas.width, h: canvas.height });
    canvas.toBlob(blob => {
      if (blob) setCroppedUrl(URL.createObjectURL(blob));
    }, "image/png");
  };

  const download = () => {
    if (!croppedUrl) return;
    const a = document.createElement("a");
    a.href = croppedUrl;
    a.download = `cropped-${croppedSize.w}x${croppedSize.h}.png`;
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Image Cropper" description="Crop images with aspect ratio lock and presets" />
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
          {/* Aspect ratio presets */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground flex items-center mr-1">
              {aspectRatio > 0 ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
              Aspect:
            </span>
            {ASPECT_PRESETS.map(p => (
              <Badge
                key={p.label}
                variant={aspectRatio === p.ratio ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => applyAspect(p.ratio)}
              >
                {p.label}
              </Badge>
            ))}
          </div>

          {/* Crop area */}
          <div
            ref={containerRef}
            className="relative inline-block select-none border rounded-lg overflow-hidden bg-muted/30"
            style={{ width: displayW, height: displayH }}
          >
            <img
              src={preview}
              alt="Source"
              className="block"
              style={{ width: displayW, height: displayH }}
              draggable={false}
            />
            {/* Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Dark overlay outside crop */}
              <svg width={displayW} height={displayH} className="absolute inset-0">
                <defs>
                  <mask id="cropMask">
                    <rect width={displayW} height={displayH} fill="white" />
                    <rect x={crop.x} y={crop.y} width={crop.w} height={crop.h} fill="black" />
                  </mask>
                </defs>
                <rect width={displayW} height={displayH} fill="rgba(0,0,0,0.5)" mask="url(#cropMask)" />
              </svg>
            </div>

            {/* Crop selection */}
            <div
              className="absolute border-2 border-primary cursor-move"
              style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
              onMouseDown={e => onMouseDown(e, "move")}
            >
              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-primary/30" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-primary/30" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-primary/30" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-primary/30" />
              </div>
              {/* Resize handle */}
              <div
                className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-primary rounded-sm cursor-se-resize"
                onMouseDown={e => onMouseDown(e, "resize")}
              />
              {/* Size label */}
              <div className="absolute -top-6 left-0 text-xs font-mono text-primary bg-background/80 px-1 rounded">
                {Math.round(crop.w / displayScale)}×{Math.round(crop.h / displayScale)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={doCrop}>Crop</Button>
            <Button variant="outline" onClick={() => {
              const size = Math.min(displayW, displayH) * 0.6;
              setCrop(clampCrop({ x: (displayW - size) / 2, y: (displayH - size) / 2, w: size, h: aspectRatio > 0 ? size / aspectRatio : size }));
            }}>
              <RotateCcw className="h-4 w-4 mr-2" />Reset Selection
            </Button>
            <Button variant="outline" onClick={() => { setImage(null); setPreview(""); setCroppedUrl(""); }}>New Image</Button>
          </div>

          {/* Cropped result */}
          {croppedUrl && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">Cropped</h3>
                  <Badge variant="secondary">{croppedSize.w} × {croppedSize.h}px</Badge>
                </div>
                <Button size="sm" onClick={download}><Download className="h-3.5 w-3.5 mr-1" />Download</Button>
              </div>
              <img src={croppedUrl} alt="Cropped" className="max-w-full max-h-[250px] rounded-lg object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
