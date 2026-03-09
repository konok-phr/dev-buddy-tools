import { useState, useRef } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function ImagePixelate() {
  const [image, setImage] = useState<string | null>(null);
  const [pixelSize, setPixelSize] = useState([8]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onload = () => { setImage(r.result as string); }; r.readAsDataURL(file); }
  };

  const apply = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      const w = img.width, h = img.height, ps = pixelSize[0];
      canvas.width = w; canvas.height = h;
      const sw = Math.ceil(w / ps), sh = Math.ceil(h / ps);
      ctx.drawImage(img, 0, 0, sw, sh);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(canvas, 0, 0, sw, sh, 0, 0, w, h);
    };
    img.src = image;
  };

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a"); a.download = "pixelated.png"; a.href = canvasRef.current.toDataURL("image/png"); a.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Image Pixelate" description="Pixelate images with adjustable block size" />
      <Input type="file" accept="image/*" onChange={handleFile} className="mb-3" />
      <div className="mb-4">
        <Label className="text-sm">Pixel Size: {pixelSize[0]}px</Label>
        <Slider value={pixelSize} onValueChange={setPixelSize} min={2} max={40} />
      </div>
      <div className="flex gap-2 mb-4">
        <Button onClick={apply} disabled={!image}>Pixelate</Button>
        <Button variant="outline" onClick={download}>Download</Button>
      </div>
      <canvas ref={canvasRef} className="max-w-full border rounded-md" />
    </div>
  );
}
