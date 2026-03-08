import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function calcSpecificity(selector: string): [number, number, number] {
  let a = 0, b = 0, c = 0;
  // Remove :not() wrapper but count its contents
  let s = selector.replace(/::[\w-]+/g, () => { c++; return ""; });
  s = s.replace(/:not\(([^)]+)\)/g, (_, inner) => { 
    const [ia, ib, ic] = calcSpecificity(inner);
    a += ia; b += ib; c += ic;
    return "";
  });
  // IDs
  const ids = s.match(/#[\w-]+/g);
  a += ids ? ids.length : 0;
  s = s.replace(/#[\w-]+/g, "");
  // Classes, attributes, pseudo-classes
  const classes = s.match(/\.[\w-]+/g);
  b += classes ? classes.length : 0;
  const attrs = s.match(/\[[^\]]+\]/g);
  b += attrs ? attrs.length : 0;
  const pseudoClasses = s.match(/:[\w-]+/g);
  b += pseudoClasses ? pseudoClasses.length : 0;
  s = s.replace(/\.[\w-]+|\[[^\]]+\]|:[\w-]+/g, "");
  // Elements
  const elems = s.match(/[a-zA-Z][\w-]*/g);
  c += elems ? elems.length : 0;
  return [a, b, c];
}

export default function CssSpecificityCalculator() {
  const [input, setInput] = useState("#main .content > p.highlight:hover\ndiv.container ul li a\n#nav .item.active\n*");

  const results = useMemo(() =>
    input.split("\n").filter(l => l.trim()).map(selector => {
      const s = selector.trim();
      const [a, b, c] = calcSpecificity(s);
      return { selector: s, specificity: [a, b, c] as [number, number, number], score: a * 100 + b * 10 + c };
    }).sort((x, y) => y.score - x.score)
  , [input]);

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="CSS Specificity Calculator" description="Calculate and compare CSS selector specificity" />
      <div className="space-y-4">
        <div>
          <Label>CSS Selectors (one per line)</Label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} rows={6} className="mt-1 font-mono text-sm" />
        </div>
        {results.length > 0 && (
          <div className="space-y-2">
            <Label>Results (sorted by specificity)</Label>
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm text-foreground">{r.selector}</code>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {r.specificity.map((n, j) => (
                      <span key={j} className={`inline-block w-8 text-center text-sm font-mono rounded px-1 ${j === 0 ? "bg-destructive/20 text-destructive" : j === 1 ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent-foreground"}`}>
                        {n}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({r.specificity.join(",")})</span>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Format: (IDs, Classes/Attrs/Pseudo-classes, Elements/Pseudo-elements)</p>
          </div>
        )}
      </div>
    </div>
  );
}
