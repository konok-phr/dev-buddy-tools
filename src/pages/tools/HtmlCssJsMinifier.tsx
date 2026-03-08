import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Lang = "html" | "css" | "js";

function minifyHtml(s: string): string {
  return s.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
}
function minifyCss(s: string): string {
  return s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>~+])\s*/g, "$1").replace(/;}/g, "}").trim();
}
function minifyJs(s: string): string {
  return s.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, "$1").trim();
}

const minifiers: Record<Lang, (s: string) => string> = { html: minifyHtml, css: minifyCss, js: minifyJs };

export default function HtmlCssJsMinifier() {
  const [lang, setLang] = useState<Lang>("html");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const minify = () => setOutput(minifiers[lang](input));
  const saved = input.length > 0 && output.length > 0 ? Math.round((1 - output.length / input.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="HTML/CSS/JS Minifier" description="Minify HTML, CSS or JavaScript by removing whitespace, comments and unnecessary characters" />

      <div className="flex gap-2 mb-4">
        {(["html", "css", "js"] as Lang[]).map(l => (
          <Button key={l} variant={lang === l ? "default" : "outline"} size="sm" onClick={() => { setLang(l); setOutput(""); }}>
            {l.toUpperCase()}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input {lang.toUpperCase()}</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm bg-card min-h-[300px]" placeholder={`Paste your ${lang.toUpperCase()} here...`} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Minified</label>
            {output && <CopyButton text={output} />}
          </div>
          <Textarea value={output} readOnly className="font-mono text-sm bg-card min-h-[300px]" />
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button onClick={minify}>Minify</Button>
        {output && (
          <span className="text-xs text-muted-foreground">
            {input.length} → {output.length} chars ({saved}% smaller)
          </span>
        )}
      </div>
    </div>
  );
}
