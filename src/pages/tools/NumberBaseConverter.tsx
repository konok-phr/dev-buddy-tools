import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const bases = [
  { value: "2", label: "Binary (2)" },
  { value: "8", label: "Octal (8)" },
  { value: "10", label: "Decimal (10)" },
  { value: "16", label: "Hexadecimal (16)" },
];

export default function NumberBaseConverter() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState("10");
  const [error, setError] = useState("");

  const convert = (base: number) => {
    try {
      const dec = parseInt(input, parseInt(fromBase));
      if (isNaN(dec)) throw new Error("Invalid number");
      setError("");
      return dec.toString(base).toUpperCase();
    } catch (e: any) {
      setError(e.message);
      return "";
    }
  };

  const results = input
    ? bases.map(b => ({ ...b, result: convert(parseInt(b.value)) }))
    : bases.map(b => ({ ...b, result: "" }));

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Number Base Converter" description="Convert between binary, octal, decimal & hexadecimal" />
      <div className="space-y-4">
        <div className="flex gap-3">
          <Select value={fromBase} onValueChange={setFromBase}>
            <SelectTrigger className="w-48 bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>{bases.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}</SelectContent>
          </Select>
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter number..." className="font-mono bg-card" />
        </div>
        {error && <p className="text-destructive text-sm font-mono">{error}</p>}
        <div className="space-y-2">
          {results.map(r => (
            <div key={r.value} className="flex items-center justify-between rounded-md border border-border bg-card p-3">
              <span className="text-xs text-muted-foreground w-32">{r.label}</span>
              <code className="text-sm font-mono text-foreground flex-1">{r.result}</code>
              {r.result && <CopyButton text={r.result} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
