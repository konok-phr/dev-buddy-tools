import { useState, useRef } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Trophy, Clock } from "lucide-react";

interface BenchResult {
  name: string;
  code: string;
  opsPerSec: number;
  avgTime: number;
  runs: number;
  error?: string;
}

export default function JsBenchmark() {
  const [snippets, setSnippets] = useState([
    { name: "Snippet A", code: 'const arr = Array.from({length: 1000}, (_, i) => i);\narr.map(x => x * 2);' },
    { name: "Snippet B", code: 'const arr = Array.from({length: 1000}, (_, i) => i);\nconst result = [];\nfor (let i = 0; i < arr.length; i++) result.push(arr[i] * 2);' },
  ]);
  const [iterations, setIterations] = useState(1000);
  const [results, setResults] = useState<BenchResult[]>([]);
  const [running, setRunning] = useState(false);
  const abortRef = useRef(false);

  const runBenchmark = async () => {
    setRunning(true);
    abortRef.current = false;
    const res: BenchResult[] = [];

    for (const snippet of snippets) {
      if (abortRef.current) break;
      try {
        const fn = new Function(snippet.code);
        // Warmup
        for (let i = 0; i < 10; i++) fn();

        const times: number[] = [];
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
          const t0 = performance.now();
          fn();
          times.push(performance.now() - t0);
        }
        const totalTime = performance.now() - start;
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const opsPerSec = Math.round((iterations / totalTime) * 1000);

        res.push({ name: snippet.name, code: snippet.code, opsPerSec, avgTime, runs: iterations });
      } catch (e: any) {
        res.push({ name: snippet.name, code: snippet.code, opsPerSec: 0, avgTime: 0, runs: 0, error: e.message });
      }
    }
    setResults(res);
    setRunning(false);
  };

  const fastest = results.length > 0 ? results.reduce((a, b) => a.opsPerSec > b.opsPerSec ? a : b) : null;

  const resultText = results.map(r =>
    r.error ? `${r.name}: ERROR - ${r.error}` : `${r.name}: ${r.opsPerSec.toLocaleString()} ops/s (avg ${r.avgTime.toFixed(4)}ms)`
  ).join("\n");

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="JS Performance Benchmarker" description="Compare JavaScript code snippet execution performance" />

      <div className="space-y-4 mb-4">
        {snippets.map((s, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <Input
              value={s.name}
              onChange={e => { const n = [...snippets]; n[i] = { ...n[i], name: e.target.value }; setSnippets(n); }}
              className="font-medium text-sm"
              placeholder="Snippet name"
            />
            <Textarea
              value={s.code}
              onChange={e => { const n = [...snippets]; n[i] = { ...n[i], code: e.target.value }; setSnippets(n); }}
              className="font-mono text-sm min-h-[80px]"
              placeholder="JavaScript code..."
            />
            {snippets.length > 2 && (
              <Button variant="ghost" size="sm" onClick={() => setSnippets(snippets.filter((_, j) => j !== i))}>Remove</Button>
            )}
          </div>
        ))}
      </div>

      {snippets.length < 5 && (
        <Button variant="outline" size="sm" className="mb-4" onClick={() => setSnippets([...snippets, { name: `Snippet ${String.fromCharCode(65 + snippets.length)}`, code: "" }])}>
          + Add Snippet
        </Button>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Iterations:</label>
          <Input type="number" value={iterations} onChange={e => setIterations(Number(e.target.value))} className="w-28 text-sm" min={10} max={100000} />
        </div>
        <Button onClick={runBenchmark} disabled={running}>
          {running ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Running...</> : <><Play className="h-4 w-4 mr-2" />Run Benchmark</>}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Results</h2>
            <CopyButton text={resultText} />
          </div>
          {results.map((r, i) => (
            <div key={i} className={`border rounded-lg p-4 ${fastest && r.name === fastest.name ? "border-primary bg-primary/5" : ""}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm text-foreground">{r.name}</span>
                {fastest && r.name === fastest.name && <Badge className="text-xs"><Trophy className="h-3 w-3 mr-1" />Fastest</Badge>}
                {r.error && <Badge variant="destructive" className="text-xs">Error</Badge>}
              </div>
              {r.error ? (
                <p className="text-sm text-destructive font-mono">{r.error}</p>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Ops/sec</p>
                    <p className="font-mono font-semibold text-foreground">{r.opsPerSec.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                    <p className="font-mono text-foreground">{r.avgTime.toFixed(4)}ms</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Runs</p>
                    <p className="font-mono text-foreground">{r.runs.toLocaleString()}</p>
                  </div>
                </div>
              )}
              {fastest && !r.error && r.name !== fastest.name && fastest.opsPerSec > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {((1 - r.opsPerSec / fastest.opsPerSec) * 100).toFixed(1)}% slower than {fastest.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
