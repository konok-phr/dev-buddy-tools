import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

async function hash(algo: string, data: string) {
  const encoded = new TextEncoder().encode(data);
  const buffer = await crypto.subtle.digest(algo, encoded);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<{ algo: string; value: string }[]>([]);

  const generate = async () => {
    const results = await Promise.all([
      hash("SHA-1", input).then(v => ({ algo: "SHA-1", value: v })),
      hash("SHA-256", input).then(v => ({ algo: "SHA-256", value: v })),
      hash("SHA-512", input).then(v => ({ algo: "SHA-512", value: v })),
    ]);
    setHashes(results);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Hash Generator" description="Generate SHA-1, SHA-256, and SHA-512 hashes" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input Text</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm bg-card min-h-[100px]" placeholder="Enter text to hash..." />
        </div>
        <Button onClick={generate}>Generate Hashes</Button>
        {hashes.length > 0 && (
          <div className="space-y-2">
            {hashes.map(h => (
              <div key={h.algo} className="bg-card border border-border rounded-md px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-primary">{h.algo}</span>
                  <CopyButton text={h.value} />
                </div>
                <p className="font-mono text-xs text-foreground break-all">{h.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
