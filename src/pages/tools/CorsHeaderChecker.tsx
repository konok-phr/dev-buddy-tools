import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface HeaderResult {
  name: string;
  value: string | null;
  status: "present" | "missing" | "warning";
  note: string;
}

const CORS_HEADERS = [
  "access-control-allow-origin",
  "access-control-allow-methods",
  "access-control-allow-headers",
  "access-control-allow-credentials",
  "access-control-max-age",
  "access-control-expose-headers",
];

export default function CorsHeaderChecker() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<HeaderResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allHeaders, setAllHeaders] = useState<[string, string][]>([]);

  const check = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    setAllHeaders([]);

    try {
      const target = url.startsWith("http") ? url : `https://${url}`;
      const res = await fetch(target, { method: "HEAD", mode: "cors" });

      const headers: [string, string][] = [];
      res.headers.forEach((v, k) => headers.push([k, v]));
      setAllHeaders(headers);

      const corsResults: HeaderResult[] = CORS_HEADERS.map(name => {
        const value = res.headers.get(name);
        if (!value) return { name, value: null, status: "missing" as const, note: "Header not present" };
        if (name === "access-control-allow-origin" && value === "*") {
          return { name, value, status: "warning" as const, note: "Wildcard origin — consider restricting" };
        }
        return { name, value, status: "present" as const, note: "OK" };
      });
      setResults(corsResults);
    } catch (e: any) {
      setError(`CORS request blocked or failed: ${e.message}. This likely means CORS is not enabled for this origin.`);
      setResults(CORS_HEADERS.map(name => ({ name, value: null, status: "missing" as const, note: "Could not read — request blocked" })));
    } finally {
      setLoading(false);
    }
  };

  const Icon = ({ status }: { status: string }) => {
    if (status === "present") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status === "warning") return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="CORS Header Checker" description="Check if a URL returns proper CORS headers" />

      <div className="flex gap-2 mb-6">
        <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com" className="font-mono text-sm" onKeyDown={e => e.key === "Enter" && check()} />
        <Button onClick={check} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {results.length > 0 && (
        <div className="space-y-2 mb-6">
          <h2 className="text-sm font-semibold text-foreground">CORS Headers</h2>
          {results.map(r => (
            <div key={r.name} className="flex items-start gap-2 p-2 rounded border border-border bg-card">
              <Icon status={r.status} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.value || r.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {allHeaders.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">All Response Headers</h2>
          <div className="bg-card border rounded-md p-3 text-xs font-mono space-y-1">
            {allHeaders.map(([k, v]) => (
              <div key={k}><span className="text-primary">{k}</span>: <span className="text-muted-foreground">{v}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
