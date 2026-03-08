import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function analyzeIp(ip: string) {
  const parts = ip.split(".");
  if (parts.length !== 4 || parts.some(p => isNaN(Number(p)) || Number(p) < 0 || Number(p) > 255))
    throw new Error("Invalid IPv4 address");

  const octets = parts.map(Number);
  const num = (octets[0] << 24 | octets[1] << 16 | octets[2] << 8 | octets[3]) >>> 0;
  const binary = octets.map(o => o.toString(2).padStart(8, "0")).join(".");

  let cls = "", defaultMask = "";
  if (octets[0] <= 127) { cls = "A"; defaultMask = "255.0.0.0"; }
  else if (octets[0] <= 191) { cls = "B"; defaultMask = "255.255.0.0"; }
  else if (octets[0] <= 223) { cls = "C"; defaultMask = "255.255.255.0"; }
  else if (octets[0] <= 239) { cls = "D (Multicast)"; defaultMask = "N/A"; }
  else { cls = "E (Reserved)"; defaultMask = "N/A"; }

  const isPrivate = (octets[0] === 10) ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168);
  const isLoopback = octets[0] === 127;

  return { binary, cls, defaultMask, isPrivate, isLoopback, decimal: num, hex: "0x" + num.toString(16).toUpperCase().padStart(8, "0") };
}

export default function IpAddressAnalyzer() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof analyzeIp> | null>(null);
  const [error, setError] = useState("");

  const analyze = () => {
    try { setResult(analyzeIp(input.trim())); setError(""); } catch (e: any) { setError(e.message); setResult(null); }
  };

  const rows = result ? [
    ["Binary", result.binary],
    ["Class", result.cls],
    ["Default Mask", result.defaultMask],
    ["Private", result.isPrivate ? "Yes" : "No"],
    ["Loopback", result.isLoopback ? "Yes" : "No"],
    ["Decimal", result.decimal.toString()],
    ["Hexadecimal", result.hex],
  ] : [];

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="IP Address Analyzer" description="Analyze IPv4 addresses — class, type, binary & more" />
      <div className="flex gap-2 mb-4">
        <Input value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. 192.168.1.1" className="font-mono bg-card" onKeyDown={e => e.key === "Enter" && analyze()} />
        <Button onClick={analyze}>Analyze</Button>
      </div>
      {error && <p className="text-destructive text-sm font-mono">{error}</p>}
      {result && (
        <div className="space-y-2">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-md border border-border bg-card p-3">
              <span className="text-xs text-muted-foreground w-32">{label}</span>
              <code className="text-sm font-mono text-foreground flex-1">{value}</code>
              <CopyButton text={value} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
