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
  java: { keywords: ["public", "private", "protected", "static", "final", "abstract", "class", "interface", "extends", "implements", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "new", "this", "super", "try", "catch", "finally", "throw", "throws", "import", "package", "void", "int", "boolean", "double", "float", "long", "char", "byte", "short", "enum", "synchronized", "volatile", "transient", "instanceof", "null", "true", "false"], builtins: ["System", "String", "Integer", "Double", "Float", "Boolean", "ArrayList", "HashMap", "HashSet", "List", "Map", "Set", "Optional", "Stream", "Collections", "Arrays", "Math", "Object", "Exception", "Thread", "Runnable", "Override", "Deprecated"] },
  cpp: { keywords: ["#include", "#define", "#ifdef", "#ifndef", "#endif", "int", "float", "double", "char", "void", "bool", "long", "short", "unsigned", "signed", "const", "static", "auto", "register", "extern", "volatile", "inline", "virtual", "class", "struct", "union", "enum", "namespace", "using", "public", "private", "protected", "template", "typename", "typedef", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "new", "delete", "try", "catch", "throw", "nullptr", "true", "false", "this", "operator", "friend", "override", "final", "constexpr", "noexcept"], builtins: ["std", "cout", "cin", "endl", "string", "vector", "map", "set", "unordered_map", "unordered_set", "pair", "make_pair", "shared_ptr", "unique_ptr", "move", "forward", "begin", "end", "size", "push_back", "emplace_back", "sort", "find", "printf", "scanf", "sizeof", "static_cast", "dynamic_cast", "reinterpret_cast"] },
  php: { keywords: ["function", "class", "public", "private", "protected", "static", "abstract", "interface", "extends", "implements", "return", "if", "else", "elseif", "for", "foreach", "while", "do", "switch", "case", "break", "continue", "new", "try", "catch", "finally", "throw", "use", "namespace", "require", "include", "require_once", "include_once", "echo", "print", "var", "const", "null", "true", "false", "array", "match", "fn", "yield", "as", "instanceof"], builtins: ["$this", "self", "parent", "strlen", "strpos", "substr", "array_map", "array_filter", "array_push", "array_pop", "array_merge", "count", "isset", "empty", "unset", "var_dump", "print_r", "json_encode", "json_decode", "date", "time", "explode", "implode", "preg_match", "file_get_contents"] },
  ruby: { keywords: ["def", "class", "module", "end", "if", "elsif", "else", "unless", "while", "until", "for", "do", "return", "yield", "begin", "rescue", "ensure", "raise", "require", "include", "extend", "attr_accessor", "attr_reader", "attr_writer", "self", "super", "nil", "true", "false", "and", "or", "not", "in", "then", "when", "case", "lambda", "proc", "block_given?", "puts", "print", "p"], builtins: ["Array", "Hash", "String", "Integer", "Float", "Symbol", "Proc", "Lambda", "Enumerable", "Comparable", "Kernel", "Object", "IO", "File", "Dir", "Time", "Regexp", "Range", "Struct", "OpenStruct", "each", "map", "select", "reject", "reduce", "inject", "collect", "detect", "find", "sort", "flatten", "compact", "uniq", "freeze", "dup", "clone"] },
  swift: { keywords: ["func", "var", "let", "class", "struct", "enum", "protocol", "extension", "import", "return", "if", "else", "guard", "switch", "case", "default", "for", "while", "repeat", "break", "continue", "in", "where", "try", "catch", "throw", "throws", "rethrows", "defer", "as", "is", "self", "super", "init", "deinit", "subscript", "typealias", "associatedtype", "public", "private", "internal", "fileprivate", "open", "static", "override", "final", "lazy", "weak", "unowned", "optional", "required", "convenience", "mutating", "nonmutating", "nil", "true", "false", "some", "any", "async", "await", "actor"], builtins: ["String", "Int", "Double", "Float", "Bool", "Array", "Dictionary", "Set", "Optional", "Result", "Error", "print", "debugPrint", "fatalError", "precondition", "assert", "DispatchQueue", "Task", "MainActor", "Codable", "Equatable", "Hashable", "Identifiable", "ObservableObject", "Published", "StateObject", "Binding", "View", "Text", "Image", "Button", "NavigationView", "List", "ForEach"] },
  kotlin: { keywords: ["fun", "val", "var", "class", "object", "interface", "abstract", "open", "sealed", "data", "enum", "companion", "import", "package", "return", "if", "else", "when", "for", "while", "do", "break", "continue", "in", "is", "as", "try", "catch", "finally", "throw", "null", "true", "false", "this", "super", "override", "private", "protected", "public", "internal", "inline", "crossinline", "noinline", "reified", "suspend", "coroutine", "lateinit", "by", "lazy", "init", "constructor", "typealias"], builtins: ["println", "print", "listOf", "mutableListOf", "mapOf", "mutableMapOf", "setOf", "mutableSetOf", "arrayOf", "intArrayOf", "String", "Int", "Double", "Float", "Boolean", "Long", "Char", "Byte", "Short", "Unit", "Any", "Nothing", "Pair", "Triple", "Result", "Sequence", "Iterable", "Collection", "Map", "Set", "List", "Array", "forEach", "map", "filter", "reduce", "fold", "flatMap", "groupBy", "sortedBy", "distinctBy", "takeIf", "let", "run", "also", "apply", "with"] },
};

type Token = { text: string; color: string };

function tokenize(line: string, lang: string, t: typeof themes["Monokai"]): Token[] {
  const tokens: Token[] = [];
  const langDef = languages[lang] || languages.javascript;
  let i = 0;

  while (i < line.length) {
    if ((line[i] === "/" && line[i + 1] === "/") || (lang === "python" && line[i] === "#") || (lang === "ruby" && line[i] === "#")) {
      tokens.push({ text: line.slice(i), color: t.comment });
      break;
    }
    if (line[i] === "/" && line[i + 1] === "*") {
      const end = line.indexOf("*/", i + 2);
      const slice = end >= 0 ? line.slice(i, end + 2) : line.slice(i);
      tokens.push({ text: slice, color: t.comment });
      i += slice.length;
      continue;
    }
    if (line[i] === '"' || line[i] === "'" || line[i] === "`") {
      const q = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== q) { if (line[j] === "\\") j++; j++; }
      tokens.push({ text: line.slice(i, j + 1), color: t.string });
      i = j + 1;
      continue;
    }
    if (/\d/.test(line[i]) && (i === 0 || /[\s(,=:+\-*/<>[\]{}!&|^~%]/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[\d.xXa-fA-FeEoObB_]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), color: t.number });
      i = j;
      continue;
    }
    if (/[a-zA-Z_$@!#]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$!?]/.test(line[j])) j++;
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
    if (/[+\-*/%=<>!&|^~?:]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[+\-*/%=<>!&|^~?:]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), color: t.operator });
      i = j;
      continue;
    }
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
    tokens.push({ text: line[i], color: t.text });
    i++;
  }
  return tokens;
}

type WindowStyle = "macos" | "windows" | "linux";

const socialPresets: Record<string, { w: number; h: number; label: string }> = {
  auto: { w: 0, h: 0, label: "Auto" },
  twitter: { w: 1200, h: 675, label: "Twitter / X (1200×675)" },
  instagram: { w: 1080, h: 1080, label: "Instagram (1080×1080)" },
  linkedin: { w: 1200, h: 627, label: "LinkedIn (1200×627)" },
  "og-image": { w: 1200, h: 630, label: "OG Image (1200×630)" },
};

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

function drawWindowControls(ctx: CanvasRenderingContext2D, style: WindowStyle, x: number, y: number, t: typeof themes["Monokai"]) {
  if (style === "macos") {
    [["#ff5f57", 0], ["#febc2e", 20], ["#28c840", 40]].forEach(([color, offset]) => {
      ctx.fillStyle = color as string;
      ctx.beginPath();
      ctx.arc(x + (offset as number), y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (style === "windows") {
    // Minimize
    ctx.strokeStyle = t.comment;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10, y);
    ctx.stroke();
    // Maximize
    ctx.strokeRect(x + 22, y - 5, 10, 10);
    // Close
    ctx.beginPath();
    ctx.moveTo(x + 44, y - 5);
    ctx.lineTo(x + 54, y + 5);
    ctx.moveTo(x + 54, y - 5);
    ctx.lineTo(x + 44, y + 5);
    ctx.stroke();
  } else {
    // Linux style - filled circles with X, -, +
    ctx.fillStyle = t.comment;
    ctx.globalAlpha = 0.6;
    [0, 20, 40].forEach(offset => {
      ctx.beginPath();
      ctx.arc(x + offset, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = t.bg;
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("×", x, y + 3);
    ctx.fillText("−", x + 20, y + 3);
    ctx.fillText("+", x + 40, y + 3);
    ctx.textAlign = "left";
  }
}

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
  const [windowStyle, setWindowStyle] = useState<WindowStyle>("macos");
  const [exportSize, setExportSize] = useState("auto");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = themes[theme as keyof typeof themes];
  const grad = gradients[gradient];
  const lines = code.split("\n");

  const highlightedLines = useMemo(() => {
    return lines.map(line => tokenize(line, language, t));
  }, [code, language, theme]);

  const renderToCanvas = (canvas: HTMLCanvasElement, forcedW?: number, forcedH?: number) => {
    const ctx = canvas.getContext("2d")!;
    const pad = padding;
    const fs = fontSize;
    const lineHeight = fs * 1.6;
    const headerH = showDots ? 44 : 12;
    const lineNumW = showLineNumbers ? `${lines.length}`.length * fs * 0.62 + 24 : 0;
    const maxLineW = lines.reduce((max, l) => Math.max(max, l.length * fs * 0.602), 0);
    let w = Math.max(500, pad * 2 + lineNumW + maxLineW + 40);
    let h = pad * 2 + headerH + lines.length * lineHeight + 20;

    if (forcedW && forcedH) {
      w = forcedW;
      h = forcedH;
    }

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
    ctx.roundRect(innerX, innerY, innerW, innerH, Math.max(borderRadius - 4, 4));
    ctx.fill();
    ctx.globalAlpha = 1;

    let yOffset = innerY;

    if (showDots) {
      const dotY = yOffset + 22;

      if (windowStyle === "windows") {
        // Windows controls on right
        drawWindowControls(ctx, "windows", innerX + innerW - 70, dotY, t);
      } else {
        drawWindowControls(ctx, windowStyle, innerX + 20, dotY, t);
      }

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
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const preset = socialPresets[exportSize];
    if (preset.w > 0) {
      renderToCanvas(canvas, preset.w, preset.h);
    } else {
      renderToCanvas(canvas);
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
    const preset = socialPresets[exportSize];
    if (preset.w > 0) {
      renderToCanvas(canvas, preset.w, preset.h);
    } else {
      renderToCanvas(canvas);
    }
    canvas.toBlob(async blob => {
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("Copied to clipboard!");
    }, "image/png");
  };

  const gradientStyle = grad[0] !== "transparent"
    ? grad.length === 2
      ? `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`
      : `linear-gradient(135deg, ${grad.join(", ")})`
    : "transparent";

  const lineNumWidth = showLineNumbers ? `${lines.length}`.length * 0.62 + 1.5 : 0;

  const resetAll = () => {
    setCode(defaultCode); setTheme("One Dark"); setPadding(40); setFontSize(14);
    setGradient("Purple Haze"); setShowLineNumbers(true); setShowDots(true);
    setBorderRadius(12); setOpacity(100); setTitle("Counter.tsx");
    setLanguage("typescript"); setWatermark(""); setShowWatermark(false);
    setWindowStyle("macos"); setExportSize("auto");
  };

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
            <Label className="text-xs text-muted-foreground">Window Style</Label>
            <Select value={windowStyle} onValueChange={v => setWindowStyle(v as WindowStyle)}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="macos">macOS</SelectItem>
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="linux">Linux</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Export Size</Label>
            <Select value={exportSize} onValueChange={setExportSize}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(socialPresets).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
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

          {/* Watermark */}
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
            <Button onClick={resetAll} size="sm" variant="ghost" className="text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Right side: Code Input on top, Preview on bottom */}
        <div className="space-y-4">
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

          {/* Live Preview */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="p-2 border-b border-border bg-muted/50 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Preview</span>
              {exportSize !== "auto" && (
                <span className="text-xs text-muted-foreground">{socialPresets[exportSize].label}</span>
              )}
            </div>
            <div className="p-6 bg-muted/20 flex justify-center overflow-auto">
              <div
                className="inline-block overflow-hidden relative"
                style={{
                  background: gradientStyle,
                  padding: `${padding / 2}px`,
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <div
                  className="overflow-hidden relative"
                  style={{
                    background: t.bg,
                    borderRadius: `${Math.max(borderRadius - 4, 4)}px`,
                    opacity: opacity / 100,
                  }}
                >
                  {showDots && (
                    <div className="flex items-center px-4 pt-3 pb-1" style={{ gap: windowStyle === "windows" ? "12px" : "8px" }}>
                      {windowStyle === "macos" && (
                        <>
                          <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                          <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                          <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                        </>
                      )}
                      {windowStyle === "linux" && (
                        <>
                          {["×", "−", "+"].map((sym, idx) => (
                            <div key={idx} className="w-3 h-3 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ background: t.comment, color: t.bg, opacity: 0.6 }}>
                              {sym}
                            </div>
                          ))}
                        </>
                      )}
                      {title && (
                        <span className={windowStyle === "windows" ? "text-xs mr-auto" : "ml-auto text-xs"} style={{ color: t.comment, fontFamily: '"JetBrains Mono", monospace' }}>{title}</span>
                      )}
                      {windowStyle === "windows" && (
                        <div className="flex items-center gap-3 ml-auto">
                          <span className="text-xs" style={{ color: t.comment }}>─</span>
                          <span className="text-xs" style={{ color: t.comment }}>□</span>
                          <span className="text-xs" style={{ color: t.comment }}>✕</span>
                        </div>
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
                  {showWatermark && watermark && (
                    <div
                      className="px-4 pb-2 text-xs opacity-50"
                      style={{
                        color: t.comment,
                        fontFamily: '"JetBrains Mono", monospace',
                        textAlign: watermarkPosition === "bottom-right" ? "right" : watermarkPosition === "bottom-center" ? "center" : "left",
                      }}
                    >
                      {watermark}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
