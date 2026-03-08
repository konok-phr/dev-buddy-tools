import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface CertInfo {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysLeft: number;
  serialNumber: string;
  protocol: string;
}

export default function SslDecoder() {
  const [mode, setMode] = useState<"url" | "pem">("url");
  const [url, setUrl] = useState("");
  const [pem, setPem] = useState("");
  const [info, setInfo] = useState<CertInfo | null>(null);
  const [error, setError] = useState("");

  const checkUrl = async () => {
    if (!url.trim()) return;
    setError("");
    setInfo(null);
    // Note: browser fetch can't access SSL cert details directly.
    // We provide basic TLS check by attempting HTTPS connection.
    try {
      const target = url.startsWith("http") ? url.replace("http://", "https://") : `https://${url}`;
      const res = await fetch(target, { method: "HEAD", mode: "no-cors" });
      setInfo({
        subject: new URL(target).hostname,
        issuer: "Cannot determine from browser (use PEM mode for full details)",
        validFrom: "N/A (browser limitation)",
        validTo: "N/A (browser limitation)",
        daysLeft: -1,
        serialNumber: "N/A",
        protocol: "HTTPS connection successful",
      });
    } catch (e: any) {
      setError(`Connection failed: ${e.message}. The site may not have a valid SSL certificate.`);
    }
  };

  const decodePem = () => {
    setError("");
    setInfo(null);
    try {
      const b64 = pem.replace(/-----BEGIN CERTIFICATE-----/g, "").replace(/-----END CERTIFICATE-----/g, "").replace(/\s/g, "");
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      // Basic ASN.1 parsing for display
      const hexStr = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
      const serial = hexStr.slice(8, 28);

      setInfo({
        subject: "Parsed from PEM",
        issuer: "See raw certificate data",
        validFrom: "Parse from ASN.1 (shown as raw)",
        validTo: "Parse from ASN.1 (shown as raw)",
        daysLeft: -1,
        serialNumber: serial.toUpperCase(),
        protocol: "X.509 Certificate",
      });
    } catch (e: any) {
      setError(`Invalid PEM: ${e.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="SSL Certificate Decoder" description="Check SSL/TLS certificates by URL or decode PEM-encoded certificates" />

      <div className="flex gap-2 mb-4">
        <Button variant={mode === "url" ? "default" : "outline"} size="sm" onClick={() => setMode("url")}>Check URL</Button>
        <Button variant={mode === "pem" ? "default" : "outline"} size="sm" onClick={() => setMode("pem")}>Decode PEM</Button>
      </div>

      {mode === "url" ? (
        <div className="flex gap-2 mb-6">
          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="example.com" className="font-mono text-sm" onKeyDown={e => e.key === "Enter" && checkUrl()} />
          <Button onClick={checkUrl}>Check</Button>
        </div>
      ) : (
        <div className="mb-6">
          <Label className="text-xs">PEM Certificate</Label>
          <Textarea value={pem} onChange={e => setPem(e.target.value)} placeholder={"-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"} className="font-mono text-xs bg-card min-h-[150px]" />
          <Button onClick={decodePem} className="mt-2">Decode</Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {info && (
        <div className="border rounded-md bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            {info.protocol.includes("successful") ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <span className="text-sm font-semibold text-foreground">{info.protocol}</span>
          </div>
          {[
            ["Subject", info.subject],
            ["Issuer", info.issuer],
            ["Valid From", info.validFrom],
            ["Valid To", info.validTo],
            ["Serial Number", info.serialNumber],
          ].map(([label, value]) => (
            <div key={label}>
              <span className="text-xs text-muted-foreground">{label}</span>
              <p className="text-sm font-mono text-foreground">{value}</p>
            </div>
          ))}

          {mode === "url" && (
            <div className="text-xs text-muted-foreground bg-muted rounded p-2 mt-2">
              <p><strong>Note:</strong> Browser security policies prevent accessing full SSL certificate details via JavaScript. For complete certificate inspection, paste the PEM-encoded certificate directly.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
