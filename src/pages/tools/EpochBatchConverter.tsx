import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

function parseTimestamp(val: string): Date | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!isNaN(num)) {
    if (num > 1e12) return new Date(num);
    return new Date(num * 1000);
  }
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}

export default function EpochBatchConverter() {
  const [input, setInput] = useState(`1700000000
1700100000
1700200000
2024-01-15T10:30:00Z
2024-06-01`);

  const lines = input.split("\n").filter(l => l.trim());

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Epoch Batch Converter" description="Convert multiple timestamps at once" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input (one per line — Unix epoch or date string)</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-xs bg-card min-h-[120px]" />
        </div>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Input</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Unix (s)</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">ISO 8601</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Human Readable</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, i) => {
                const d = parseTimestamp(line);
                return (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-mono text-foreground">{line.trim()}</td>
                    {d ? (
                      <>
                        <td className="px-3 py-2 font-mono text-foreground">{Math.floor(d.getTime() / 1000)}</td>
                        <td className="px-3 py-2 font-mono text-foreground">{d.toISOString()}</td>
                        <td className="px-3 py-2 text-foreground">{d.toLocaleString()}</td>
                      </>
                    ) : (
                      <td colSpan={3} className="px-3 py-2 text-destructive italic">Invalid</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
