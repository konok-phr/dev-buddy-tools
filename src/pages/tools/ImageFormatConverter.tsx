import { useState, useRef } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, ArrowRight } from "lucide-react";

export default function ImageFormatConverter() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [sourceFormat, setSourceFormat] = useState("");
  const [targetFormat, setTargetFormat] = useState("image/webp");
  const [quality, setQuality] = useState(90);
  const [convertedUrl, setConvertedUrl] = useState("");
  const [convertedSize, setConvertedSize] = useState(0);
  const [origSize, setOrigSize] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const formats = [
    { value: "image/png", label: "PNG", ext: "png" },
    { value: "image/jpeg", label: "JPEG", ext: "jpg" },
    { value: "image/webp", label: "WebP", ext: "webp" },
  ];

  const handleFile = (file: File) => {
    setFileName(file.name);
    setSourceFormat(file.type);
    setOrigSize(file.size);
    setConvertedUrl("");

    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new window.Image();
    img.onload = () => setImage(img);
    img.src = url;

    // Auto-select different target format
    if (file.type === "image/png") setTargetFormat("image/webp");
    else if (file.type === "image/webp") setTargetFormat("image/png");
    else setTargetFormat("image/webp");
  };

  const convert = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0);

    canvas.toBlob(blob => {
      if (blob) {
        setConvertedUrl(URL.createObjectURL(blob));
        setConvertedSize(blob.size);
      }
    }, targetFormat, quality / 100);
  };

  const download = () => {
    if (!convertedUrl) return;
    const ext = formats.find(f => f.value === targetFormat)?.ext || "png";
    const baseName = fileName.replace(/\.[^.]+$/, "");
    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `${baseName}.${ext}`;
    a.click();
  };

  const savings = origSize > 0 && convertedSize > 0
    ? Math.round((1 - convertedSize / origSize) * 100)
    : 0;

  const sourceLabel = formats.find(f => f.value === sourceFormat)?.label || sourceFormat.split("/")[1]?.toUpperCase() || "?";

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Image Format Converter" description="Convert between PNG, JPEG, and WebP formats" />
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
          <p className="text-xs text-muted-foreground mt-1">PNG, JPEG, WebP, GIF, BMP supported</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <img src={preview} alt="Source" className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex items-center gap-2">
                <Badge variant="outline">{sourceLabel}</Badge>
                <Badge variant="outline">{(origSize / 1024).toFixed(1)} KB</Badge>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {formats.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {targetFormat !== "image/png" && (
                  <div>
                    <Input type="number" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-20 text-sm" min={1} max={100} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={convert}>Convert</Button>
              <Button variant="outline" onClick={() => { setImage(null); setPreview(""); setConvertedUrl(""); }}>Reset</Button>
            </div>
          </div>

          {convertedUrl && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">Converted</h3>
                  <Badge variant="secondary">{(convertedSize / 1024).toFixed(1)} KB</Badge>
                  {savings > 0 ? (
                    <Badge className="text-xs">{savings}% smaller</Badge>
                  ) : savings < 0 ? (
                    <Badge variant="destructive" className="text-xs">{Math.abs(savings)}% larger</Badge>
                  ) : null}
                </div>
                <Button size="sm" onClick={download}><Download className="h-3.5 w-3.5 mr-1" />Download</Button>
              </div>
              <img src={convertedUrl} alt="Converted" className="max-w-full max-h-[300px] rounded-lg object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
