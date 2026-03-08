import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Globe, ShieldCheck, AlertTriangle } from "lucide-react";

interface HeaderInfo {
  name: string;
  value: string;
  category: string;
}

const SECURITY_HEADERS = [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "x-frame-options",
  "x-xss-protection",
  "referrer-policy",
  "permissions-policy",
  "cross-origin-opener-policy",
  "cross-origin-resource-policy",
  "cross-origin-embedder-policy",
];

function categorize(name: string): string {
  const lower = name.toLowerCase();
  if (SECURITY_HEADERS.includes(lower)) return "Security";
  if (lower.startsWith("access-control")) return "CORS";
  if (["cache-control", "etag", "expires", "last-modified", "age", "vary"].includes(lower)) return "Caching";
  if (["content-type", "content-length", "content-encoding", "transfer-encoding"].includes(lower)) return "Content";
  return "General";
}

export default function HttpHeaderInspector() {
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<HeaderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusCode, setStatusCode] = useState(0);
  const [responseTime, setResponseTime] = useState(0);

  const inspect = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setHeaders([]);
    setStatusCode(0);

    const target = url.startsWith("http") ? url : `https://${url}`;

    try {
      const start = performance.now();
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`, { method: "HEAD" });
      setResponseTime(Math.round(performance.now() - start));
      setStatusCode(res.status);

      const headerList: HeaderInfo[] = [];
      res.headers.forEach((value, name) => {
        headerList.push({ name, value, category: categorize(name) });
      });
      headerList.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
      setHeaders(headerList);

      // If HEAD didn't return much, try GET
      if (headerList.length < 3) {
        const res2 = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(target)}`);
        const data = await res2.json();
        if (data.status) {
          setStatusCode(data.status.http_code);
          const parsedHeaders: HeaderInfo[] = [];
          if (data.status.content_type) parsedHeaders.push({ name: "content-type", value: data.status.content_type, category: "Content" });
          if (data.status.content_length) parsedHeaders.push({ name: "content-length", value: String(data.status.content_length), category: "Content" });
          if (parsedHeaders.length > headerList.length) setHeaders(parsedHeaders);
        }
      }
    } catch (e: any) {
      setError(`Failed to inspect: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const missingSecurityHeaders = SECURITY_HEADERS.filter(h => !headers.some(hdr => hdr.name.toLowerCase() === h));
  const categories = [...new Set(headers.map(h => h.category))];
  const headersText = headers.map(h => `${h.name}: ${h.value}`).join("\n");

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="HTTP Header Inspector" description="Inspect HTTP response headers of any URL" />

      <div className="flex gap-2 mb-4">
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="font-mono text-sm flex-1"
          onKeyDown={e => e.key === "Enter" && inspect()}
        />
        <Button onClick={inspect} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Globe className="h-4 w-4 mr-2" />Inspect</>}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {headers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={statusCode < 400 ? "secondary" : "destructive"}>{statusCode}</Badge>
            <span className="text-xs text-muted-foreground">{responseTime}ms response time</span>
            <span className="text-xs text-muted-foreground">{headers.length} headers</span>
            <CopyButton text={headersText} />
          </div>

          {categories.map(cat => (
            <div key={cat} className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-3 py-2">
                <span className="text-xs font-semibold text-muted-foreground">{cat}</span>
              </div>
              <div className="divide-y divide-border">
                {headers.filter(h => h.category === cat).map((h, i) => (
                  <div key={i} className="px-3 py-2 flex gap-3">
                    <span className="text-xs font-mono text-primary whitespace-nowrap min-w-[180px]">{h.name}</span>
                    <span className="text-xs font-mono text-foreground break-all">{h.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {missingSecurityHeaders.length > 0 && (
            <div className="border rounded-lg p-4 border-destructive/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <h3 className="text-sm font-semibold text-foreground">Missing Security Headers</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingSecurityHeaders.map(h => (
                  <Badge key={h} variant="outline" className="text-xs font-mono text-destructive border-destructive/30">{h}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Headers may differ via CORS proxy. Test directly for accurate results.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
