import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function decodeJwt(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT: must have 3 parts");
  const decode = (s: string) => {
    const padded = s.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  };
  return { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] };
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ header: any; payload: any; signature: string } | null>(null);
  const [error, setError] = useState("");

  const decode = () => {
    try { setResult(decodeJwt(input.trim())); setError(""); } catch (e: any) { setError(e.message); setResult(null); }
  };

  const isExpired = result?.payload?.exp ? result.payload.exp * 1000 < Date.now() : null;

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="JWT Decoder" description="Decode and inspect JSON Web Tokens" />
      <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JWT token here..." className="font-mono text-sm bg-card min-h-[100px] mb-3" />
      <Button onClick={decode} className="mb-4">Decode</Button>
      {error && <p className="text-destructive text-sm font-mono mb-3">{error}</p>}
      {result && (
        <div className="space-y-3">
          {isExpired !== null && (
            <div className={`text-sm font-semibold px-3 py-2 rounded-md ${isExpired ? "bg-destructive/20 text-destructive" : "bg-accent/20 text-accent"}`}>
              {isExpired ? "⚠ Token is expired" : "✓ Token is valid (not expired)"}
              {result.payload.exp && <span className="ml-2 font-mono text-xs">exp: {new Date(result.payload.exp * 1000).toISOString()}</span>}
            </div>
          )}
          {[{ label: "Header", data: result.header }, { label: "Payload", data: result.payload }].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-primary">{s.label}</span>
                <CopyButton text={JSON.stringify(s.data, null, 2)} />
              </div>
              <pre className="font-mono text-xs text-foreground whitespace-pre-wrap">{JSON.stringify(s.data, null, 2)}</pre>
            </div>
          ))}
          <div className="bg-card border border-border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary">Signature</span>
              <CopyButton text={result.signature} />
            </div>
            <p className="font-mono text-xs text-muted-foreground break-all">{result.signature}</p>
          </div>
        </div>
      )}
    </div>
  );
}
