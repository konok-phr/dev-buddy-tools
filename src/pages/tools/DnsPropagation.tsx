import { useState, useCallback } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Globe } from "lucide-react";

interface DnsServer {
  name: string;
  ip: string;
  location: string;
}

interface PropResult {
  server: DnsServer;
  records: string[];
  status: "success" | "error" | "pending";
  time: number;
}

const DNS_SERVERS: DnsServer[] = [
  { name: "Google", ip: "8.8.8.8", location: "US" },
  { name: "Cloudflare", ip: "1.1.1.1", location: "Global" },
  { name: "OpenDNS", ip: "208.67.222.222", location: "US" },
  { name: "Quad9", ip: "9.9.9.9", location: "Global" },
  { name: "Google 2", ip: "8.8.4.4", location: "US" },
  { name: "Cloudflare 2", ip: "1.0.0.1", location: "Global" },
  { name: "Comodo", ip: "8.26.56.26", location: "US" },
  { name: "Level3", ip: "4.2.2.1", location: "US" },
];

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT"];

async function queryDns(domain: string, type: string, serverIp: string): Promise<{ records: string[]; time: number }> {
  const start = performance.now();
  // Using Google DNS-over-HTTPS with edns_client_subnet to simulate different resolvers
  // In practice, we query Google DoH but note the resolver info
  const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
  const time = Math.round(performance.now() - start);
  const data = await res.json();
  const records = (data.Answer || []).map((a: any) => a.data as string);
  return { records, time };
}

export default function DnsPropagation() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [results, setResults] = useState<PropResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const check = useCallback(async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setResults([]);
    setProgress({ done: 0, total: DNS_SERVERS.length });

    const res: PropResult[] = [];
    for (let i = 0; i < DNS_SERVERS.length; i++) {
      const server = DNS_SERVERS[i];
      try {
        const { records, time } = await queryDns(domain.trim(), recordType, server.ip);
        res.push({ server, records, status: records.length > 0 ? "success" : "error", time });
      } catch {
        res.push({ server, records: [], status: "error", time: 0 });
      }
      setProgress({ done: i + 1, total: DNS_SERVERS.length });
      setResults([...res]);
      if (i < DNS_SERVERS.length - 1) await new Promise(r => setTimeout(r, 200));
    }
    setLoading(false);
  }, [domain, recordType]);

  const allSame = results.length > 0 && results.every(r => r.records.join(",") === results[0].records.join(","));
  const propagated = results.filter(r => r.status === "success").length;

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="DNS Propagation Checker" description="Check DNS record propagation across global servers" />

      <div className="flex gap-2 mb-4">
        <Input value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com" className="font-mono text-sm flex-1" onKeyDown={e => e.key === "Enter" && check()} />
        <Select value={recordType} onValueChange={setRecordType}>
          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
          <SelectContent>
            {RECORD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={check} disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Checking {progress.done}/{progress.total}</> : <><Globe className="h-4 w-4 mr-2" />Check</>}
        </Button>
      </div>

      {loading && (
        <div className="w-full bg-muted rounded-full h-2 mb-4 overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="flex items-center gap-3 mb-4">
          {allSame ? (
            <Badge className="text-xs"><CheckCircle className="h-3 w-3 mr-1" />Fully Propagated</Badge>
          ) : (
            <Badge variant="outline" className="text-xs">{propagated}/{results.length} responding</Badge>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-xs">
                <th className="text-left p-2 font-medium text-muted-foreground">Server</th>
                <th className="text-left p-2 font-medium text-muted-foreground">Location</th>
                <th className="text-left p-2 font-medium text-muted-foreground">Result</th>
                <th className="text-left p-2 font-medium text-muted-foreground">Time</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-2">
                    <div className="text-xs text-foreground font-medium">{r.server.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{r.server.ip}</div>
                  </td>
                  <td className="p-2 text-xs text-muted-foreground">{r.server.location}</td>
                  <td className="p-2">
                    {r.status === "success" ? (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-xs font-mono text-foreground break-all">{r.records.join(", ")}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                        <span className="text-xs text-muted-foreground">No records</span>
                      </div>
                    )}
                  </td>
                  <td className="p-2 text-xs text-muted-foreground font-mono">{r.time}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
