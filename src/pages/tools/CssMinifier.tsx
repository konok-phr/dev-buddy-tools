import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const minify = () => setOutput(minifyCss(input));

  const saved = input.length > 0 ? Math.round((1 - output.length / input.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="CSS Minifier" description="Minify CSS by removing whitespace and comments" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input CSS</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm bg-card min-h-[300px]" placeholder=".example {\n  color: red;\n}" />
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
