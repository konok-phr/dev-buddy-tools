import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function SriHashGenerator() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<{ algo: string; hash: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!url.trim()) return;
    setLoading(true); setError(""); setResults([]);
    try {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      const algos = ["SHA-256", "SHA-384", "SHA-512"];
      const hashes = await Promise.all(algos.map(async a => {
        const hash = await crypto.subtle.digest(a, buf);
        const b64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
        return { algo: a.toLowerCase().replace("-", ""), hash: `${a.toLowerCase().replace("-", "")}-${b64}` };
      }));
      setResults(hashes);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="SRI Hash Generator" description="Generate Subresource Integrity hashes for scripts and styles" />
      <div className="flex gap-2 mb-4">
        <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://cdn.example.com/script.js" className="font-mono text-sm flex-1" onKeyDown={e => e.key === "Enter" && generate()} />
        <Button onClick={generate} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}</Button>
      </div>
      {error && <p className="text-sm text-destructive mb-3">{error}</p>}
      {results.map(r => (
        <div key={r.algo} className="border rounded-md p-3 mb-2">
          <div className="flex justify-between items-center mb-1"><p className="text-xs text-muted-foreground font-semibold">{r.algo}</p><CopyButton text={r.hash} /></div>
          <p className="font-mono text-xs text-foreground break-all">{r.hash}</p>
        </div>
      ))}
    </div>
  );
}
