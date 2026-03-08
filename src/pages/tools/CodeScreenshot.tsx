import { useState, useRef, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Download, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const themes = {
  "Monokai": { bg: "#272822", text: "#f8f8f2", keyword: "#f92672", string: "#e6db74", comment: "#75715e", number: "#ae81ff", func: "#a6e22e", operator: "#f92672", tag: "#f92672", attr: "#a6e22e" },
  "Dracula": { bg: "#282a36", text: "#f8f8f2", keyword: "#ff79c6", string: "#f1fa8c", comment: "#6272a4", number: "#bd93f9", func: "#50fa7b", operator: "#ff79c6", tag: "#ff79c6", attr: "#50fa7b" },
  "GitHub Dark": { bg: "#0d1117", text: "#c9d1d9", keyword: "#ff7b72", string: "#a5d6ff", comment: "#8b949e", number: "#79c0ff", func: "#d2a8ff", operator: "#ff7b72", tag: "#7ee787", attr: "#79c0ff" },
  "Solarized": { bg: "#002b36", text: "#839496", keyword: "#b58900", string: "#2aa198", comment: "#586e75", number: "#d33682", func: "#268bd2", operator: "#b58900", tag: "#268bd2", attr: "#2aa198" },
  "Nord": { bg: "#2e3440", text: "#d8dee9", keyword: "#81a1c1", string: "#a3be8c", comment: "#616e88", number: "#b48ead", func: "#88c0d0", operator: "#81a1c1", tag: "#81a1c1", attr: "#8fbcbb" },
  "One Dark": { bg: "#282c34", text: "#abb2bf", keyword: "#c678dd", string: "#98c379", comment: "#5c6370", number: "#d19a66", func: "#61afef", operator: "#56b6c2", tag: "#e06c75", attr: "#d19a66" },
  "Synthwave 84": { bg: "#262335", text: "#ffffff", keyword: "#fede5d", string: "#ff7edb", comment: "#848bbd", number: "#f97e72", func: "#36f9f6", operator: "#fede5d", tag: "#72f1b8", attr: "#fede5d" },
  "Night Owl": { bg: "#011627", text: "#d6deeb", keyword: "#c792ea", string: "#ecc48d", comment: "#637777", number: "#f78c6c", func: "#82aaff", operator: "#7fdbca", tag: "#caece6", attr: "#addb67" },
  "Catppuccin": { bg: "#1e1e2e", text: "#cdd6f4", keyword: "#cba6f7", string: "#a6e3a1", comment: "#585b70", number: "#fab387", func: "#89b4fa", operator: "#89dceb", tag: "#f38ba8", attr: "#f9e2af" },
};

const gradients: Record<string, string[]> = {
  "Purple Haze": ["#667eea", "#764ba2"],
  "Ocean Blue": ["#2193b0", "#6dd5ed"],
  "Sunset": ["#ee9ca7", "#ffdde1"],
  "Emerald": ["#11998e", "#38ef7d"],
  "Fire": ["#f12711", "#f5af19"],
  "Cotton Candy": ["#D4145A", "#FBB03B"],
  "Midnight": ["#232526", "#414345"],
  "Neon": ["#12c2e9", "#c471ed", "#f64f59"],
  "None (Solid)": ["transparent"],
};

const languages: Record<string, { keywords: string[]; builtins: string[] }> = {
  javascript: { keywords: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "import", "export", "from", "default", "new", "this", "async", "await", "try", "catch", "throw", "switch", "case", "break", "continue", "typeof", "instanceof", "of", "in", "yield", "delete", "void"], builtins: ["console", "Math", "JSON", "Promise", "Array", "Object", "String", "Number", "Boolean", "Date", "RegExp", "Map", "Set", "Error", "setTimeout", "setInterval", "fetch", "document", "window"] },
  typescript: { keywords: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "import", "export", "from", "default", "new", "this", "async", "await", "try", "catch", "throw", "switch", "case", "break", "continue", "typeof", "instanceof", "type", "interface", "enum", "implements", "extends", "abstract", "readonly", "as", "is", "keyof", "infer", "never", "unknown"], builtins: ["console", "Math", "JSON", "Promise", "Array", "Object", "String", "Number", "Boolean", "Date", "RegExp", "Map", "Set", "Error", "setTimeout", "setInterval", "fetch", "Partial", "Required", "Pick", "Omit", "Record"] },
  python: { keywords: ["def", "class", "return", "if", "elif", "else", "for", "while", "import", "from", "as", "try", "except", "finally", "raise", "with", "yield", "lambda", "pass", "break", "continue", "and", "or", "not", "in", "is", "True", "False", "None", "global", "nonlocal", "del", "assert"], builtins: ["print", "len", "range", "str", "int", "float", "list", "dict", "set", "tuple", "type", "isinstance", "enumerate", "zip", "map", "filter", "sorted", "reversed", "input", "open", "super", "self"] },
  html: { keywords: ["DOCTYPE", "html", "head", "body", "div", "span", "p", "a", "img", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6", "table", "tr", "td", "th", "form", "input", "button", "script", "style", "link", "meta", "title", "section", "nav", "header", "footer", "main", "article", "aside"], builtins: ["class", "id", "href", "src", "alt", "type", "name", "value", "style", "onclick", "onload"] },
  css: { keywords: ["@media", "@keyframes", "@import", "@font-face", "@supports", "!important", ":root", ":hover", ":focus", ":active", ":before", ":after", "::before", "::after", ":first-child", ":last-child", ":nth-child"], builtins: ["display", "flex", "grid", "position", "margin", "padding", "border", "background", "color", "font", "width", "height", "top", "left", "right", "bottom", "z-index", "opacity", "transform", "transition", "animation", "overflow", "box-shadow", "text-align", "justify-content", "align-items"] },
  rust: { keywords: ["fn", "let", "mut", "const", "struct", "enum", "impl", "trait", "pub", "use", "mod", "self", "super", "crate", "return", "if", "else", "for", "while", "loop", "match", "as", "ref", "move", "async", "await", "where", "type", "unsafe", "dyn", "box"], builtins: ["println!", "vec!", "format!", "String", "Vec", "Option", "Result", "Some", "None", "Ok", "Err", "Box", "Rc", "Arc", "HashMap", "HashSet", "iter", "collect", "unwrap", "expect", "clone"] },
  go: { keywords: ["func", "var", "const", "type", "struct", "interface", "return", "if", "else", "for", "range", "switch", "case", "default", "break", "continue", "go", "chan", "select", "defer", "package", "import", "map", "make", "new", "nil", "true", "false"], builtins: ["fmt", "Println", "Printf", "Sprintf", "error", "string", "int", "float64", "bool", "byte", "rune", "append", "len", "cap", "copy", "delete", "close", "panic", "recover"] },
};

type Token = { text: string; color: string };

function tokenize(line: string, lang: string, t: typeof themes["Monokai"]): Token[] {
  const tokens: Token[] = [];
  const langDef = languages[lang] || languages.javascript;
  let i = 0;

  while (i < line.length) {
    // Comment (// or #)
    if ((line[i] === "/" && line[i + 1] === "/") || (lang === "python" && line[i] === "#")) {
      tokens.push({ text: line.slice(i), color: t.comment });
      break;
    }
    // Multi-line comment start
    if (line[i] === "/" && line[i + 1] === "*") {
      const end = line.indexOf("*/", i + 2);
      const slice = end >= 0 ? line.slice(i, end + 2) : line.slice(i);
      tokens.push({ text: slice, color: t.comment });
      i += slice.length;
      continue;
    }
    // Strings
    if (line[i] === '"' || line[i] === "'" || line[i] === "`") {
      const q = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== q) { if (line[j] === "\\") j++; j++; }
      tokens.push({ text: line.slice(i, j + 1), color: t.string });
      i = j + 1;
      continue;
    }
    // Numbers
    if (/\d/.test(line[i]) && (i === 0 || /[\s(,=:+\-*/<>[\]{}!&|^~%]/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[\d.xXa-fA-FeEoObB_]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), color: t.number });
      i = j;
      continue;
    }
    // Words (keywords, builtins, identifiers)
    if (/[a-zA-Z_$@!]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$!]/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (langDef.keywords.includes(word)) {
        tokens.push({ text: word, color: t.keyword });
      } else if (langDef.builtins.includes(word)) {
        tokens.push({ text: word, color: t.func });
      } else if (j < line.length && line[j] === "(") {
        tokens.push({ text: word, color: t.func });
      } else {
        tokens.push({ text: word, color: t.text });
      }
      i = j;
      continue;
    }
    // Operators
    if (/[+\-*/%=<>!&|^~?:]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[+\-*/%=<>!&|^~?:]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), color: t.operator });
      i = j;
      continue;
    }
    // HTML tags
    if (lang === "html" && line[i] === "<") {
      let j = i + 1;
      if (line[j] === "/") j++;
      let tagName = "";
      while (j < line.length && /[a-zA-Z0-9]/.test(line[j])) { tagName += line[j]; j++; }
      tokens.push({ text: line.slice(i, i + (line[i + 1] === "/" ? 2 : 1)), color: t.text });
      if (tagName) tokens.push({ text: tagName, color: t.tag });
      i = j;
      continue;
    }
    // Punctuation / whitespace
    tokens.push({ text: line[i], color: t.text });
    i++;
  }
  return tokens;
}

const defaultCode = `import { useState } from "react";

// A simple counter component
function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
}

export default Counter;`;

export default function CodeScreenshot() {
  const [code, setCode] = useState(defaultCode);
  const [theme, setTheme] = useState("One Dark");
  const [padding, setPadding] = useState(40);
  const [title, setTitle] = useState("Counter.tsx");
  const [fontSize, setFontSize] = useState(14);
  const [language, setLanguage] = useState("typescript");
  const [gradient, setGradient] = useState("Purple Haze");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showDots, setShowDots] = useState(true);
  const [borderRadius, setBorderRadius] = useState(12);
  const [opacity, setOpacity] = useState(100);
  const [watermark, setWatermark] = useState("");
  const [watermarkPosition, setWatermarkPosition] = useState<"bottom-right" | "bottom-left" | "bottom-center">("bottom-right");
  const [showWatermark, setShowWatermark] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = themes[theme as keyof typeof themes];
  const grad = gradients[gradient];
  const lines = code.split("\n");

  const highlightedLines = useMemo(() => {
    return lines.map(line => tokenize(line, language, t));
  }, [code, language, theme]);

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pad = padding;
    const fs = fontSize;
    const lineHeight = fs * 1.6;
    const headerH = showDots ? 44 : 12;
    const lineNumW = showLineNumbers ? `${lines.length}`.length * fs * 0.62 + 24 : 0;
    const maxLineW = lines.reduce((max, l) => Math.max(max, l.length * fs * 0.602), 0);
    const w = Math.max(500, pad * 2 + lineNumW + maxLineW + 40);
    const h = pad * 2 + headerH + lines.length * lineHeight + 20;

    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);

    // Outer gradient bg
    if (grad[0] !== "transparent") {
      const g = ctx.createLinearGradient(0, 0, w, h);
      grad.forEach((c, i) => g.addColorStop(i / (grad.length - 1 || 1), c));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, borderRadius);
      ctx.fill();
    } else {
      ctx.clearRect(0, 0, w, h);
    }

    // Inner editor bg
    const innerX = pad * 0.5;
    const innerY = pad * 0.5;
    const innerW = w - pad;
    const innerH = h - pad;
    ctx.fillStyle = t.bg;
    ctx.globalAlpha = opacity / 100;
    ctx.beginPath();
    ctx.roundRect(innerX, innerY, innerW, innerH, borderRadius - 4 > 0 ? borderRadius - 4 : 4);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Subtle inner shadow
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(innerX, innerY, innerW, innerH, borderRadius - 4 > 0 ? borderRadius - 4 : 4);
    ctx.clip();
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = "transparent";
    ctx.restore();

    let yOffset = innerY;

    if (showDots) {
      // Traffic light dots
      const dotY = yOffset + 22;
      [["#ff5f57", 0], ["#febc2e", 20], ["#28c840", 40]].forEach(([color, offset]) => {
        ctx.fillStyle = color as string;
        ctx.beginPath();
        ctx.arc(innerX + 20 + (offset as number), dotY, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Title centered
      if (title) {
        ctx.fillStyle = t.comment;
        ctx.font = `${fs - 1}px "SF Mono", "Fira Code", "JetBrains Mono", Menlo, monospace`;
        ctx.textAlign = "center";
        ctx.fillText(title, w / 2, dotY + 4);
        ctx.textAlign = "left";
      }

      yOffset += headerH;
    } else {
      yOffset += 12;
    }

    // Code lines
    ctx.font = `${fs}px "SF Mono", "Fira Code", "JetBrains Mono", Menlo, monospace`;
    const codeStartY = yOffset + 6;

    highlightedLines.forEach((tokens, i) => {
      const y = codeStartY + i * lineHeight + fs;

      // Line numbers
      if (showLineNumbers) {
        ctx.fillStyle = t.comment;
        ctx.globalAlpha = 0.5;
        const numStr = `${i + 1}`;
        ctx.fillText(numStr, innerX + 16, y);
        ctx.globalAlpha = 1;
      }

      // Tokens
      let x = innerX + 16 + lineNumW;
      tokens.forEach(tok => {
        ctx.fillStyle = tok.color;
        ctx.fillText(tok.text, x, y);
        x += ctx.measureText(tok.text).width;
      });
    });

    // Watermark
    if (showWatermark && watermark) {
      const wmFs = Math.max(11, fs * 0.75);
      ctx.font = `${wmFs}px "SF Mono","Fira Code","JetBrains Mono",Menlo,monospace`;
      ctx.fillStyle = t.comment;
      ctx.globalAlpha = 0.5;
      const wmY = innerY + innerH - 10;
      if (watermarkPosition === "bottom-right") {
        ctx.textAlign = "right";
        ctx.fillText(watermark, innerX + innerW - 14, wmY);
      } else if (watermarkPosition === "bottom-left") {
        ctx.textAlign = "left";
        ctx.fillText(watermark, innerX + 14, wmY);
      } else {
        ctx.textAlign = "center";
        ctx.fillText(watermark, w / 2, wmY);
      }
      ctx.textAlign = "left";
      ctx.globalAlpha = 1;
    }

    canvas.toBlob(blob => {
      if (!blob) return;
      const link = document.createElement("a");
      link.download = `${title.replace(/\.[^.]+$/, "") || "code"}-screenshot.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("Screenshot exported!");
    }, "image/png");
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Re-render for copy
    exportToCanvas();
    canvas.toBlob(async blob => {
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("Copied to clipboard!");
    }, "image/png");
  };

  const exportToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pad = padding;
    const fs = fontSize;
    const lineHeight = fs * 1.6;
    const headerH = showDots ? 44 : 12;
    const lineNumW = showLineNumbers ? `${lines.length}`.length * fs * 0.62 + 24 : 0;
    const maxLineW = lines.reduce((max, l) => Math.max(max, l.length * fs * 0.602), 0);
    const w = Math.max(500, pad * 2 + lineNumW + maxLineW + 40);
    const h = pad * 2 + headerH + lines.length * lineHeight + 20;

    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);

    if (grad[0] !== "transparent") {
      const g = ctx.createLinearGradient(0, 0, w, h);
      grad.forEach((c, i) => g.addColorStop(i / (grad.length - 1 || 1), c));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, borderRadius);
      ctx.fill();
    }

    ctx.fillStyle = t.bg;
    ctx.globalAlpha = opacity / 100;
    const innerX = pad * 0.5, innerY = pad * 0.5, innerW = w - pad, innerH = h - pad;
    ctx.beginPath();
    ctx.roundRect(innerX, innerY, innerW, innerH, Math.max(borderRadius - 4, 4));
    ctx.fill();
    ctx.globalAlpha = 1;

    let yOffset = innerY;
    if (showDots) {
      const dotY = yOffset + 22;
      [["#ff5f57", 0], ["#febc2e", 20], ["#28c840", 40]].forEach(([color, offset]) => {
        ctx.fillStyle = color as string;
        ctx.beginPath();
        ctx.arc(innerX + 20 + (offset as number), dotY, 6, 0, Math.PI * 2);
        ctx.fill();
      });
      if (title) {
        ctx.fillStyle = t.comment;
        ctx.font = `${fs - 1}px "SF Mono","Fira Code","JetBrains Mono",Menlo,monospace`;
        ctx.textAlign = "center";
        ctx.fillText(title, w / 2, dotY + 4);
        ctx.textAlign = "left";
      }
      yOffset += headerH;
    } else {
      yOffset += 12;
    }

    ctx.font = `${fs}px "SF Mono","Fira Code","JetBrains Mono",Menlo,monospace`;
    const codeStartY = yOffset + 6;
    highlightedLines.forEach((tokens, i) => {
      const y = codeStartY + i * lineHeight + fs;
      if (showLineNumbers) {
        ctx.fillStyle = t.comment;
        ctx.globalAlpha = 0.5;
        ctx.fillText(`${i + 1}`, innerX + 16, y);
        ctx.globalAlpha = 1;
      }
      let x = innerX + 16 + lineNumW;
      tokens.forEach(tok => {
        ctx.fillStyle = tok.color;
        ctx.fillText(tok.text, x, y);
        x += ctx.measureText(tok.text).width;
      });
    });

    // Watermark for copy
    if (showWatermark && watermark) {
      const wmFs = Math.max(11, fs * 0.75);
      ctx.font = `${wmFs}px "SF Mono","Fira Code","JetBrains Mono",Menlo,monospace`;
      ctx.fillStyle = t.comment;
      ctx.globalAlpha = 0.5;
      const wmY = innerY + innerH - 10;
      if (watermarkPosition === "bottom-right") {
        ctx.textAlign = "right";
        ctx.fillText(watermark, innerX + innerW - 14, wmY);
      } else if (watermarkPosition === "bottom-left") {
        ctx.textAlign = "left";
        ctx.fillText(watermark, innerX + 14, wmY);
      } else {
        ctx.textAlign = "center";
        ctx.fillText(watermark, w / 2, wmY);
      }
      ctx.textAlign = "left";
      ctx.globalAlpha = 1;
    }
  };

  const gradientStyle = grad[0] !== "transparent"
    ? grad.length === 2
      ? `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`
      : `linear-gradient(135deg, ${grad.join(", ")})`
    : "transparent";

  const lineNumWidth = showLineNumbers ? `${lines.length}`.length * 0.62 + 1.5 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="Code Screenshot" description="Create beautiful, IDE-style code screenshots with syntax highlighting" />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Settings Panel */}
        <div className="space-y-4 p-4 rounded-lg border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground">Settings</h3>

          <div>
            <Label className="text-xs text-muted-foreground">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.keys(themes).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.keys(languages).map(l => <SelectItem key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Background</Label>
            <Select value={gradient} onValueChange={setGradient}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.keys(gradients).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Padding: {padding}px</Label>
            <Slider value={[padding]} onValueChange={v => setPadding(v[0])} min={16} max={80} step={4} className="mt-2" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Font Size: {fontSize}px</Label>
            <Slider value={[fontSize]} onValueChange={v => setFontSize(v[0])} min={10} max={24} step={1} className="mt-2" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Border Radius: {borderRadius}px</Label>
            <Slider value={[borderRadius]} onValueChange={v => setBorderRadius(v[0])} min={0} max={24} step={2} className="mt-2" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Opacity: {opacity}%</Label>
            <Slider value={[opacity]} onValueChange={v => setOpacity(v[0])} min={60} max={100} step={5} className="mt-2" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">File Name</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 h-8 text-xs" placeholder="filename.tsx" />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Line Numbers</Label>
            <Switch checked={showLineNumbers} onCheckedChange={setShowLineNumbers} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Window Controls</Label>
            <Switch checked={showDots} onCheckedChange={setShowDots} />
          </div>

          {/* Watermark / Branding */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Watermark</Label>
              <Switch checked={showWatermark} onCheckedChange={setShowWatermark} />
            </div>
            {showWatermark && (
              <div className="space-y-2">
                <Input value={watermark} onChange={e => setWatermark(e.target.value)} className="h-8 text-xs" placeholder="@yourname or brand" />
                <Select value={watermarkPosition} onValueChange={v => setWatermarkPosition(v as typeof watermarkPosition)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-center">Bottom Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={exportImage} size="sm" className="flex-1 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" /> Export PNG
            </Button>
            <Button onClick={copyToClipboard} size="sm" variant="outline" className="text-xs">
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button onClick={() => { setCode(defaultCode); setTheme("One Dark"); setPadding(40); setFontSize(14); setGradient("Purple Haze"); setShowLineNumbers(true); setShowDots(true); setBorderRadius(12); setOpacity(100); setTitle("Counter.tsx"); setLanguage("typescript"); setWatermark(""); setShowWatermark(false); }} size="sm" variant="ghost" className="text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Right side: Preview + Code Input */}
        <div className="space-y-4">
          {/* Live Preview */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="p-2 border-b border-border bg-muted/50">
              <span className="text-xs font-medium text-muted-foreground">Preview</span>
            </div>
            <div className="p-6 bg-muted/20 flex justify-center overflow-auto">
              <div
                className="inline-block overflow-hidden"
                style={{
                  background: gradientStyle,
                  padding: `${padding / 2}px`,
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <div
                  className="overflow-hidden"
                  style={{
                    background: t.bg,
                    borderRadius: `${Math.max(borderRadius - 4, 4)}px`,
                    opacity: opacity / 100,
                  }}
                >
                  {showDots && (
                    <div className="flex items-center gap-[8px] px-4 pt-3 pb-1">
                      <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                      {title && (
                        <span className="ml-auto text-xs" style={{ color: t.comment, fontFamily: '"JetBrains Mono", monospace' }}>{title}</span>
                      )}
                    </div>
                  )}
                  <div className="px-4 py-3 overflow-x-auto">
                    <pre style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: `${fontSize}px`, lineHeight: 1.6, margin: 0 }}>
                      {highlightedLines.map((tokens, i) => (
                        <div key={i} className="flex">
                          {showLineNumbers && (
                            <span
                              className="select-none text-right shrink-0 pr-4"
                              style={{ color: t.comment, opacity: 0.5, width: `${lineNumWidth}em`, fontSize: `${fontSize}px` }}
                            >
                              {i + 1}
                            </span>
                          )}
                          <span>
                            {tokens.map((tok, j) => (
                              <span key={j} style={{ color: tok.color }}>{tok.text}</span>
                            ))}
                          </span>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Input */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Code</Label>
            <Textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              rows={12}
              className="font-mono text-sm resize-y"
              placeholder="Paste your code here..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
