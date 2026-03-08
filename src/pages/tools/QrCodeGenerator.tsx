import { useState, useEffect } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRCode from "qrcode";
import { Download } from "lucide-react";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState("256");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    if (!text) { setDataUrl(""); return; }
    QRCode.toDataURL(text, {
      width: parseInt(size),
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    }).then(setDataUrl).catch(() => setDataUrl(""));
  }, [text, size, fgColor, bgColor]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="QR Code Generator" description="Generate QR codes from text or URLs" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Content</label>
          <Input value={text} onChange={e => setText(e.target.value)} className="bg-card text-sm" placeholder="Enter text or URL..." />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Size</label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["128", "256", "512", "1024"].map(s => (
                  <SelectItem key={s} value={s}>{s}px</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Foreground</label>
            <div className="flex gap-2">
              <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="h-9 w-9 rounded border border-border cursor-pointer" />
              <Input value={fgColor} onChange={e => setFgColor(e.target.value)} className="font-mono bg-card text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Background</label>
            <div className="flex gap-2">
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-9 w-9 rounded border border-border cursor-pointer" />
              <Input value={bgColor} onChange={e => setBgColor(e.target.value)} className="font-mono bg-card text-sm" />
            </div>
          </div>
        </div>
        {dataUrl && (
          <div className="flex flex-col items-center gap-3 p-6 border border-border rounded-lg bg-card">
            <img src={dataUrl} alt="QR Code" className="rounded" />
            <Button variant="secondary" size="sm" onClick={download}>
              <Download className="h-3 w-3 mr-1" /> Download PNG
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
