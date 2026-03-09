import { useState, useRef } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function ImageWatermark() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("© Watermark");
  const [fontSize, setFontSize] = useState([32]);
  const [opacity, setOpacity] = useState([50]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onload = () => setImage(r.result as string); r.readAsDataURL(file); }
  };

  const apply = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = opacity[0] / 100;
      ctx.font = `${fontSize[0]}px sans-serif`;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 2;
      ctx.textAlign = "center";
      // Repeat watermark
      for (let y = fontSize[0]; y < img.height; y += fontSize[0] * 4) {
        for (let x = 0; x < img.width; x += fontSize[0] * 8) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-Math.PI / 6);
          ctx.strokeText(text, 0, 0);
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      }
    };
    img.src = image;
  };

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = "watermarked.png";
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Image Watermark" description="Add text watermark to images" />
      <Input type="file" accept="image/*" onChange={handleFile} className="mb-3" />
      <div className="space-y-3 mb-4">
        <div><Label className="text-sm">Watermark Text</Label><Input value={text} onChange={e => setText(e.target.value)} /></div>
        <div><Label className="text-sm">Font Size: {fontSize[0]}px</Label><Slider value={fontSize} onValueChange={setFontSize} min={12} max={72} /></div>
        <div><Label className="text-sm">Opacity: {opacity[0]}%</Label><Slider value={opacity} onValueChange={setOpacity} min={10} max={100} /></div>
      </div>
      <div className="flex gap-2 mb-4">
        <Button onClick={apply} disabled={!image}>Apply Watermark</Button>
        <Button variant="outline" onClick={download}>Download</Button>
      </div>
      <canvas ref={canvasRef} className="max-w-full border rounded-md" />
    </div>
  );
}
