import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface DnsRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "SRV"];

export default function DnsLookup() {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState("A");
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setRecords([]);
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
      const data = await res.json();
      if (data.Answer) {
        setRecords(data.Answer);
      } else if (data.Authority) {
        setRecords(data.Authority);
      } else {
        setError("No records found");
      }
    } catch (e: any) {
      setError(`Lookup failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const typeNames: Record<number, string> = { 1: "A", 28: "AAAA", 5: "CNAME", 15: "MX", 2: "NS", 16: "TXT", 6: "SOA", 33: "SRV" };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="DNS Lookup Tool" description="Query DNS records for any domain using Google DNS" />

      <div className="flex gap-2 mb-6">
        <Input
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="example.com"
          className="font-mono text-sm flex-1"
          onKeyDown={e => e.key === "Enter" && lookup()}
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
          <SelectContent>
            {RECORD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={lookup} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lookup"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {records.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">{records.length} record(s) found</h2>
            <CopyButton text={records.map(r => `${r.data}`).join("\n")} />
          </div>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted text-xs">
                  <th className="text-left p-2 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Value</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">TTL</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2 font-mono text-xs text-primary">{typeNames[r.type] || r.type}</td>
                    <td className="p-2 font-mono text-xs text-foreground">{r.name}</td>
                    <td className="p-2 font-mono text-xs text-foreground break-all">{r.data}</td>
                    <td className="p-2 font-mono text-xs text-muted-foreground">{r.TTL}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
