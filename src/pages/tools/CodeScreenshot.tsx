import { useState, useRef } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

const themes: Record<string, { bg: string; text: string; keyword: string; string: string; comment: string }> = {
  "Monokai": { bg: "#272822", text: "#f8f8f2", keyword: "#f92672", string: "#e6db74", comment: "#75715e" },
  "Dracula": { bg: "#282a36", text: "#f8f8f2", keyword: "#ff79c6", string: "#f1fa8c", comment: "#6272a4" },
  "GitHub Dark": { bg: "#0d1117", text: "#c9d1d9", keyword: "#ff7b72", string: "#a5d6ff", comment: "#8b949e" },
  "Solarized": { bg: "#002b36", text: "#839496", keyword: "#b58900", string: "#2aa198", comment: "#586e75" },
  "Nord": { bg: "#2e3440", text: "#d8dee9", keyword: "#81a1c1", string: "#a3be8c", comment: "#616e88" },
};

const paddings = ["16", "32", "48", "64"];

export default function CodeScreenshot() {
  const [code, setCode] = useState(`function greet(name) {\n  // Say hello\n  const msg = \`Hello, \${name}!\`;\n  console.log(msg);\n  return msg;\n}`);
  const [theme, setTheme] = useState("Monokai");
  const [padding, setPadding] = useState("32");
  const [title, setTitle] = useState("app.js");
  const [fontSize, setFontSize] = useState("14");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = themes[theme];

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pad = parseInt(padding);
    const fs = parseInt(fontSize);
    const lineHeight = fs * 1.5;
    const lines = code.split("\n");
    const headerH = 40;
    const w = Math.max(600, pad * 2 + lines.reduce((max, l) => Math.max(max, l.length * fs * 0.6), 0));
    const h = pad * 2 + headerH + lines.length * lineHeight + 10;

    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);

    // Outer gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#667eea");
    grad.addColorStop(1, "#764ba2");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 12);
    ctx.fill();

    // Inner bg
    ctx.fillStyle = t.bg;
    ctx.beginPath();
    ctx.roundRect(pad / 2, pad / 2, w - pad, h - pad, 8);
    ctx.fill();

    // Dots
    const dotY = pad / 2 + 18;
    [["#ff5f57", 0], ["#febc2e", 18], ["#28c840", 36]].forEach(([color, offset]) => {
      ctx.fillStyle = color as string;
      ctx.beginPath();
      ctx.arc(pad / 2 + 20 + (offset as number), dotY, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Title
    ctx.fillStyle = t.comment;
    ctx.font = `${fs - 1}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText(title, w / 2, dotY + 4);
    ctx.textAlign = "left";

    // Code
    ctx.font = `${fs}px monospace`;
    const codeY = pad / 2 + headerH + 10;
    lines.forEach((line, i) => {
      ctx.fillStyle = t.text;
      ctx.fillText(line, pad, codeY + i * lineHeight);
    });

    const link = document.createElement("a");
    link.download = "code-screenshot.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Code Screenshot" description="Create beautiful code screenshots like Carbon" />
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <div>
            <Label>Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-36 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.keys(themes).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Padding</Label>
            <Select value={padding} onValueChange={setPadding}>
              <SelectTrigger className="w-24 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{paddings.map(p => <SelectItem key={p} value={p}>{p}px</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Font Size</Label>
            <Input value={fontSize} onChange={e => setFontSize(e.target.value)} className="w-20 mt-1" />
          </div>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="w-32 mt-1" />
          </div>
        </div>

        <div>
          <Label>Code</Label>
          <Textarea value={code} onChange={e => setCode(e.target.value)} rows={10} className="mt-1 font-mono text-sm" />
        </div>

        {/* Preview */}
        <div className="rounded-xl overflow-hidden inline-block" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", padding: `${parseInt(padding) / 2}px` }}>
          <div className="rounded-lg overflow-hidden" style={{ background: t.bg, padding: `${parseInt(padding) / 2}px` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
              <span className="ml-auto text-xs" style={{ color: t.comment }}>{title}</span>
            </div>
            <pre className="text-sm" style={{ color: t.text, fontFamily: "monospace", fontSize: `${fontSize}px` }}>{code}</pre>
          </div>
        </div>

        <div>
          <canvas ref={canvasRef} className="hidden" />
          <Button onClick={exportImage}><Download className="h-4 w-4 mr-1" /> Export as PNG</Button>
        </div>
      </div>
    </div>
  );
}
