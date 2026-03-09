import { useState, useRef } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCw, FlipHorizontal, FlipVertical } from "lucide-react";

export default function ImageFlipRotate() {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
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
      const swap = rotation % 180 !== 0;
      canvas.width = swap ? img.height : img.width;
      canvas.height = swap ? img.width : img.height;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    };
    img.src = image;
  };

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a"); a.download = "transformed.png"; a.href = canvasRef.current.toDataURL("image/png"); a.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Image Flip & Rotate" description="Flip and rotate images with one click" />
      <Input type="file" accept="image/*" onChange={handleFile} className="mb-3" />
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button variant="outline" onClick={() => { setRotation(r => (r + 90) % 360); }}><RotateCw className="h-4 w-4 mr-1" />Rotate 90°</Button>
        <Button variant="outline" onClick={() => setFlipH(f => !f)}><FlipHorizontal className="h-4 w-4 mr-1" />Flip H {flipH && "✓"}</Button>
        <Button variant="outline" onClick={() => setFlipV(f => !f)}><FlipVertical className="h-4 w-4 mr-1" />Flip V {flipV && "✓"}</Button>
        <Button onClick={apply} disabled={!image}>Apply</Button>
        <Button variant="outline" onClick={download}>Download</Button>
      </div>
      <p className="text-xs text-muted-foreground mb-2">Rotation: {rotation}° | Flip H: {flipH ? "Yes" : "No"} | Flip V: {flipV ? "Yes" : "No"}</p>
      <canvas ref={canvasRef} className="max-w-full border rounded-md" />
    </div>
  );
}
