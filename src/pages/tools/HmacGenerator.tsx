import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ALGOS = ["SHA-256", "SHA-384", "SHA-512"];

export default function HmacGenerator() {
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [algo, setAlgo] = useState("SHA-256");
  const [result, setResult] = useState("");

  const generate = async () => {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: algo }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
    setResult(Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join(""));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="HMAC Generator" description="Generate HMAC signatures using SHA-256, SHA-384, SHA-512" />
      <div className="space-y-3 mb-4">
        <div><Label className="text-sm">Message</Label><Textarea value={message} onChange={e => setMessage(e.target.value)} className="font-mono text-sm h-24" /></div>
        <div className="flex gap-3 items-end">
          <div className="flex-1"><Label className="text-sm">Secret Key</Label><Input value={secret} onChange={e => setSecret(e.target.value)} className="font-mono text-sm" /></div>
          <div><Label className="text-sm">Algorithm</Label>
            <Select value={algo} onValueChange={setAlgo}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>{ALGOS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select></div>
          <Button onClick={generate}>Generate</Button>
        </div>
      </div>
      {result && (
        <div className="border rounded-md p-3">
          <div className="flex justify-between items-center mb-1"><p className="text-xs text-muted-foreground">HMAC ({algo})</p><CopyButton text={result} /></div>
          <p className="font-mono text-sm text-foreground break-all">{result}</p>
        </div>
      )}
    </div>
  );
}
