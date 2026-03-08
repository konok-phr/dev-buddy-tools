import { useState, useRef, useCallback } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

const ASCII_CHARS_DETAILED = "@%#*+=-:. ";
const ASCII_CHARS_SIMPLE = "#@$%&?*+;:,. ";
const BLOCK_CHARS = "█▓▒░ ";

function imageToAscii(canvas: HTMLCanvasElement, width: number, charset: string, invert: boolean): string {
  const ctx = canvas.getContext("2d")!;
  const aspect = canvas.height / canvas.width;
  const height = Math.round(width * aspect * 0.5); // chars are taller than wide
  
  // Create temp canvas at target size
  const tmp = document.createElement("canvas");
  tmp.width = width;
  tmp.height = height;
  const tctx = tmp.getContext("2d")!;
  tctx.drawImage(canvas, 0, 0, width, height);
  
  const data = tctx.getImageData(0, 0, width, height).data;
  const chars = invert ? charset.split("").reverse().join("") : charset;
  const lines: string[] = [];

  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const brightness = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
      const charIdx = Math.floor(brightness * (chars.length - 1));
      line += chars[charIdx];
    }
    lines.push(line);
  }
  return lines.join("\n");
}

export default function ImageToAscii() {
  const [ascii, setAscii] = useState("");
  const [width, setWidth] = useState(80);
  const [charset, setCharset] = useState("detailed");
  const [invert, setInvert] = useState(false);
  const [preview, setPreview] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const charsets: Record<string, string> = {
    detailed: ASCII_CHARS_DETAILED,
    simple: ASCII_CHARS_SIMPLE,
    blocks: BLOCK_CHARS,
  };

  const convert = useCallback(() => {
    if (!imgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = imgRef.current.naturalWidth;
    canvas.height = imgRef.current.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgRef.current, 0, 0);
    setAscii(imageToAscii(canvas, width, charsets[charset], invert));
  }, [width, charset, invert]);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new window.Image();
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      setAscii(imageToAscii(canvas, width, charsets[charset], invert));
    };
    img.src = url;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Image to ASCII Art" description="Convert images to ASCII text art" />
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

      {preview && (
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <img src={preview} alt="Source" className="w-16 h-16 object-cover rounded" />
          <div>
            <label className="text-xs text-muted-foreground">Width (chars)</label>
            <Input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-24 text-sm" min={20} max={200} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Style</label>
            <Select value={charset} onValueChange={setCharset}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="blocks">Blocks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-4">
            <input type="checkbox" checked={invert} onChange={e => setInvert(e.target.checked)} id="invert" />
            <label htmlFor="invert" className="text-xs text-muted-foreground">Invert</label>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={convert}>Convert</Button>
        </div>
      )}

      {ascii && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">ASCII Art</h3>
            <CopyButton text={ascii} />
          </div>
          <pre className="text-[6px] sm:text-[8px] leading-[1.1] font-mono text-foreground bg-muted p-3 rounded overflow-x-auto whitespace-pre">{ascii}</pre>
        </div>
      )}
    </div>
  );
}
