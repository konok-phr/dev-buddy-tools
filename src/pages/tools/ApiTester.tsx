import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function ApiTester() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<number | null>(null);

  const send = async () => {
    setLoading(true);
    setResponse("");
    setStatus(null);
    const start = performance.now();
    try {
      const opts: RequestInit = { method };
      try { opts.headers = JSON.parse(headers); } catch {}
      if (["POST", "PUT", "PATCH"].includes(method) && body) opts.body = body;
      const res = await fetch(url, opts);
      setStatus(res.status);
      setTime(Math.round(performance.now() - start));
      const text = await res.text();
      try { setResponse(JSON.stringify(JSON.parse(text), null, 2)); } catch { setResponse(text); }
    } catch (e: any) {
      setResponse(`Error: ${e.message}`);
      setTime(Math.round(performance.now() - start));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="API Tester" description="Send HTTP requests and view responses" />
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-[120px] bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com/data" className="flex-1 font-mono bg-card" />
        <Button onClick={send} disabled={loading || !url}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Headers (JSON)</label>
          <Textarea value={headers} onChange={e => setHeaders(e.target.value)} className="font-mono text-sm bg-card min-h-[100px]" />
        </div>
        {["POST", "PUT", "PATCH"].includes(method) && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Body</label>
            <Textarea value={body} onChange={e => setBody(e.target.value)} className="font-mono text-sm bg-card min-h-[100px]" placeholder='{"key": "value"}' />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted-foreground">Response</label>
            {status && (
              <span className={`text-xs font-mono ${status < 300 ? "text-accent" : status < 500 ? "text-yellow-400" : "text-destructive"}`}>
                {status} • {time}ms
              </span>
            )}
          </div>
          {response && <CopyButton text={response} />}
        </div>
        <Textarea value={response} readOnly className="font-mono text-sm bg-card min-h-[200px]" />
      </div>
    </div>
  );
}
