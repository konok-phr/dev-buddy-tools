import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

function optimizeSvg(svg: string, opts: { removeComments: boolean; removeMetadata: boolean; minify: boolean; removeEmptyAttrs: boolean }): string {
  let result = svg;
  if (opts.removeComments) result = result.replace(/<!--[\s\S]*?-->/g, "");
  if (opts.removeMetadata) {
    result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
    result = result.replace(/<title[\s\S]*?<\/title>/gi, "");
    result = result.replace(/<desc[\s\S]*?<\/desc>/gi, "");
  }
  if (opts.removeEmptyAttrs) result = result.replace(/\s+\w+=""/g, "");
  if (opts.minify) {
    result = result.replace(/>\s+</g, "><");
    result = result.replace(/\s{2,}/g, " ");
    result = result.trim();
  }
  return result;
}

export default function SvgOptimizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState({ removeComments: true, removeMetadata: true, minify: true, removeEmptyAttrs: true });

  const optimize = () => setOutput(optimizeSvg(input, opts));

  const savings = input.length > 0 && output.length > 0 ? Math.round((1 - output.length / input.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="SVG Optimizer" description="Optimize SVG files by removing unnecessary data" />
      <div className="flex flex-wrap gap-4 mb-4">
        {(Object.entries(opts) as [keyof typeof opts, boolean][]).map(([key, val]) => (
          <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={val} onCheckedChange={v => setOpts(p => ({ ...p, [key]: !!v }))} />
            <span className="capitalize text-foreground">{key.replace(/([A-Z])/g, " $1").trim()}</span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input SVG</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-xs bg-card min-h-[300px]" placeholder="Paste SVG code here..." />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Optimized</label>
            {output && <CopyButton text={output} />}
          </div>
          <Textarea value={output} readOnly className="font-mono text-xs bg-card min-h-[300px]" />
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button onClick={optimize}>Optimize</Button>
        {output && <span className="text-xs text-muted-foreground">{input.length} → {output.length} chars ({savings}% smaller)</span>}
      </div>
      {output && output.startsWith("<svg") && (
        <div className="mt-4">
          <label className="text-xs text-muted-foreground mb-1 block">Preview</label>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: output }} />
        </div>
      )}
    </div>
  );
}
