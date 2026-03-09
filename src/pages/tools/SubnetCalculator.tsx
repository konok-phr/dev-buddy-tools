import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function parseIp(ip: string): number[] | null {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null;
  return parts;
}

function ipToInt(parts: number[]): number {
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

function intToIp(n: number): string {
  return [(n >>> 24) & 0xFF, (n >>> 16) & 0xFF, (n >>> 8) & 0xFF, n & 0xFF].join(".");
}

function calculateSubnet(ip: string, cidr: number) {
  const parts = parseIp(ip);
  if (!parts) return null;

  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const ipInt = ipToInt(parts) >>> 0;
  const network = (ipInt & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const firstHost = cidr >= 31 ? network : (network + 1) >>> 0;
  const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;
  const totalHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr) - 2;
  const wildcard = (~mask) >>> 0;

  return {
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    mask: intToIp(mask),
    wildcard: intToIp(wildcard),
    firstHost: intToIp(firstHost),
    lastHost: intToIp(lastHost),
    totalHosts,
    cidr,
    maskBinary: mask.toString(2).padStart(32, "0").match(/.{8}/g)!.join("."),
  };
}

export default function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState("24");

  const result = calculateSubnet(ip, parseInt(cidr) || 0);

  const rows = result ? [
    { label: "Network Address", value: result.network },
    { label: "Subnet Mask", value: `${result.mask} (/${result.cidr})` },
    { label: "Wildcard Mask", value: result.wildcard },
    { label: "Broadcast Address", value: result.broadcast },
    { label: "First Host", value: result.firstHost },
    { label: "Last Host", value: result.lastHost },
    { label: "Total Usable Hosts", value: result.totalHosts.toLocaleString() },
    { label: "Mask (Binary)", value: result.maskBinary },
  ] : [];

  return (
    <div className="max-w-xl mx-auto">
      <ToolHeader title="Subnet Calculator" description="Calculate subnet details, host range and network address from IP/CIDR" />
      <div className="flex gap-2 mb-4 items-end">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">IP Address</label>
          <Input value={ip} onChange={e => setIp(e.target.value)} placeholder="192.168.1.0" className="font-mono" />
        </div>
        <div className="w-20">
          <label className="text-xs text-muted-foreground mb-1 block">CIDR</label>
          <Input value={cidr} onChange={e => setCidr(e.target.value)} type="number" min={0} max={32} className="font-mono" />
        </div>
      </div>

      {!result && ip && <p className="text-sm text-destructive">Invalid IP address</p>}

      {result && (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={i > 0 ? "border-t border-border" : ""}>
                  <td className="p-3 text-muted-foreground font-medium">{r.label}</td>
                  <td className="p-3 font-mono text-foreground">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2">Common CIDR Reference</h3>
          <div className="flex flex-wrap gap-1.5">
            {[8, 16, 20, 22, 24, 25, 26, 27, 28, 29, 30, 32].map(c => (
              <Badge key={c} variant={parseInt(cidr) === c ? "default" : "outline"} className="font-mono cursor-pointer text-xs" onClick={() => setCidr(String(c))}>
                /{c} ({c === 32 ? 1 : c >= 31 ? 2 : Math.pow(2, 32 - c) - 2})
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
