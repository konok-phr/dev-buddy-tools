import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";

interface WebhookLog {
  id: number;
  method: string;
  url: string;
  status: number | null;
  time: number;
  response: string;
  timestamp: string;
}

export default function WebhookTester() {
  const [method, setMethod] = useState("POST");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('{\n  "event": "test",\n  "data": {\n    "message": "Hello from webhook tester"\n  }\n}');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<WebhookLog[]>([]);

  const send = async () => {
    if (!url.trim()) return;
    setLoading(true);
    const start = performance.now();
    let status: number | null = null;
    let response = "";
    try {
      const opts: RequestInit = { method };
      try { opts.headers = JSON.parse(headers); } catch {}
      if (["POST", "PUT", "PATCH"].includes(method)) opts.body = body;
      const res = await fetch(url, opts);
      status = res.status;
      try { response = JSON.stringify(await res.json(), null, 2); } catch { response = await res.text(); }
    } catch (e: any) {
      response = `Error: ${e.message}`;
    }
    const time = Math.round(performance.now() - start);
    setLogs(prev => [{ id: Date.now(), method, url, status, time, response, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="Webhook Tester" description="Send test webhook requests and inspect responses" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://webhook.site/..." className="font-mono text-sm flex-1" />
          </div>

          <div>
            <Label className="text-xs">Headers (JSON)</Label>
            <Textarea value={headers} onChange={e => setHeaders(e.target.value)} className="font-mono text-sm bg-card min-h-[80px]" />
          </div>

          {["POST", "PUT", "PATCH"].includes(method) && (
            <div>
              <Label className="text-xs">Body</Label>
              <Textarea value={body} onChange={e => setBody(e.target.value)} className="font-mono text-sm bg-card min-h-[120px]" />
            </div>
          )}

          <Button onClick={send} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
            Send Webhook
          </Button>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Response Log ({logs.length})</Label>
          <div className="space-y-2 max-h-[500px] overflow-auto">
            {logs.length === 0 && <p className="text-sm text-muted-foreground">No requests sent yet</p>}
            {logs.map(log => (
              <div key={log.id} className="border rounded-md bg-card p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-semibold">{log.method} <span className={log.status && log.status < 400 ? "text-green-500" : "text-destructive"}>{log.status || "ERR"}</span></span>
                  <span className="text-muted-foreground">{log.time}ms • {log.timestamp}</span>
                </div>
                <p className="text-muted-foreground truncate mb-1">{log.url}</p>
                <div className="flex justify-end"><CopyButton text={log.response} /></div>
                <pre className="font-mono text-[10px] max-h-[120px] overflow-auto whitespace-pre-wrap text-foreground">{log.response}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
