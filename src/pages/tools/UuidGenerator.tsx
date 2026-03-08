import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function uuidv4() {
  return crypto.randomUUID();
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [count, setCount] = useState("5");

  const generate = () => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    setUuids(Array.from({ length: n }, () => uuidv4()));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="UUID Generator" description="Generate UUID v4 identifiers" />
      <div className="flex gap-2 mb-4">
        <Input type="number" value={count} onChange={e => setCount(e.target.value)} className="w-24 bg-card" min="1" max="100" />
        <Button onClick={generate}>Generate</Button>
        <CopyButton text={uuids.join("\n")} />
      </div>
      <div className="space-y-1">
        {uuids.map((u, i) => (
          <div key={i} className="flex items-center justify-between bg-card border border-border rounded-md px-3 py-2">
            <span className="font-mono text-sm text-foreground">{u}</span>
            <CopyButton text={u} />
          </div>
        ))}
      </div>
    </div>
  );
}
