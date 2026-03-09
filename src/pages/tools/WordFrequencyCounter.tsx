import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function getFrequency(text: string, caseSensitive: boolean): { word: string; count: number; pct: number }[] {
  const processed = caseSensitive ? text : text.toLowerCase();
  const words = processed.match(/\b[\w'-]+\b/g) || [];
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  const total = words.length;
  return Object.entries(freq)
    .map(([word, count]) => ({ word, count, pct: (count / total) * 100 }))
    .sort((a, b) => b.count - a.count);
}

export default function WordFrequencyCounter() {
  const [input, setInput] = useState("The quick brown fox jumps over the lazy dog. The dog barked at the fox. The fox ran away from the dog.");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [limit, setLimit] = useState(50);

  const freq = getFrequency(input, caseSensitive);
  const displayed = freq.slice(0, limit);
  const maxCount = displayed[0]?.count || 1;

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Word Frequency Counter" description="Count word occurrences and frequency in any text" />
      <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste your text here..." className="font-mono text-sm min-h-[120px] mb-4" />

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Button variant={caseSensitive ? "default" : "outline"} size="sm" onClick={() => setCaseSensitive(!caseSensitive)}>Case Sensitive</Button>
        <div className="flex-1" />
        <Badge variant="secondary" className="text-xs">{freq.length} unique words</Badge>
        <Badge variant="outline" className="text-xs">{freq.reduce((s, f) => s + f.count, 0)} total words</Badge>
      </div>

      {displayed.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-xs">
                <th className="text-left p-2 font-medium text-muted-foreground w-8">#</th>
                <th className="text-left p-2 font-medium text-muted-foreground">Word</th>
                <th className="text-left p-2 font-medium text-muted-foreground">Count</th>
                <th className="text-left p-2 font-medium text-muted-foreground">%</th>
                <th className="text-left p-2 font-medium text-muted-foreground w-40">Bar</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((f, i) => (
                <tr key={f.word} className="border-t border-border">
                  <td className="p-2 text-xs text-muted-foreground">{i + 1}</td>
                  <td className="p-2 font-mono text-foreground">{f.word}</td>
                  <td className="p-2 font-mono text-primary">{f.count}</td>
                  <td className="p-2 text-xs text-muted-foreground">{f.pct.toFixed(1)}%</td>
                  <td className="p-2">
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${(f.count / maxCount) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {freq.length > limit && (
        <Button variant="ghost" size="sm" onClick={() => setLimit(l => l + 50)} className="mt-2 w-full">
          Show more ({freq.length - limit} remaining)
        </Button>
      )}
    </div>
  );
}
