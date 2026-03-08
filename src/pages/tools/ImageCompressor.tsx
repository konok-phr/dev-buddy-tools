import { useState, useRef } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ImageCompressor() {
  const [original, setOriginal] = useState<{ url: string; size: number; name: string } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginal({ url: URL.createObjectURL(file), size: file.size, name: file.name });
    setCompressed(null);
  };

  const compress = () => {
    if (!original) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => {
        if (blob) setCompressed({ url: URL.createObjectURL(blob), size: blob.size });
      }, "image/jpeg", quality / 100);
    };
    img.src = original.url;
  };

  const fmt = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Image Compressor" description="Compress images in your browser — no upload to servers" />
      <div className="space-y-4">
        <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} className="hidden" />
        <Button variant="outline" onClick={() => fileRef.current?.click()}>Select Image</Button>

        {original && (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-muted-foreground">Original: {fmt(original.size)}</div>
              {compressed && (
                <div className="text-muted-foreground">
                  Compressed: {fmt(compressed.size)} ({Math.round((1 - compressed.size / original.size) * 100)}% smaller)
                </div>
              )}
            </div>
            <div>
              <Label>Quality: {quality}%</Label>
              <Slider value={[quality]} onValueChange={v => setQuality(v[0])} min={10} max={100} step={5} className="mt-2" />
            </div>
            <div>
              <Label>Max Width: {maxWidth}px</Label>
              <Slider value={[maxWidth]} onValueChange={v => setMaxWidth(v[0])} min={320} max={3840} step={10} className="mt-2" />
            </div>
            <Button onClick={compress}>Compress</Button>

            {compressed && (
              <div className="space-y-2">
                <img src={compressed.url} alt="Compressed preview" className="max-w-full rounded border border-border" />
                <a href={compressed.url} download={`compressed-${original.name}`}>
                  <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" /> Download</Button>
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
