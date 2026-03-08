import { useState, useEffect, useCallback } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

function base32Decode(s: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = s.replace(/[=\s-]/g, "").toUpperCase();
  let bits = "";
  for (const ch of cleaned) {
    const idx = alphabet.indexOf(ch);
    if (idx === -1) continue;
    bits += idx.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey("raw", key.buffer as ArrayBuffer, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, message.buffer as ArrayBuffer);
  return new Uint8Array(sig);
}

async function generateTotp(secret: string, period = 30, digits = 6): Promise<string> {
  const key = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / period);
  const msg = new Uint8Array(8);
  let tmp = counter;
  for (let i = 7; i >= 0; i--) {
    msg[i] = tmp & 0xff;
    tmp >>= 8;
  }
  const hash = await hmacSha1(key, msg);
  const offset = hash[hash.length - 1] & 0x0f;
  const code = ((hash[offset] & 0x7f) << 24 | (hash[offset + 1] & 0xff) << 16 | (hash[offset + 2] & 0xff) << 8 | (hash[offset + 3] & 0xff)) % (10 ** digits);
  return code.toString().padStart(digits, "0");
}

export default function TotpGenerator() {
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("------");
  const [timeLeft, setTimeLeft] = useState(30);
  const [error, setError] = useState("");
  const period = 30;

  const generate = useCallback(async () => {
    if (!secret.trim()) { setCode("------"); return; }
    try {
      const totp = await generateTotp(secret, period);
      setCode(totp);
      setError("");
    } catch {
      setError("Invalid secret key");
      setCode("------");
    }
  }, [secret]);

  useEffect(() => {
    generate();
    const interval = setInterval(() => {
      const remaining = period - (Math.floor(Date.now() / 1000) % period);
      setTimeLeft(remaining);
      if (remaining === period) generate();
    }, 200);
    return () => clearInterval(interval);
  }, [generate]);

  const generateRandomSecret = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let s = "";
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    for (const b of arr) s += alphabet[b % 32];
    setSecret(s);
  };

  return (
    <div className="max-w-lg mx-auto">
      <ToolHeader title="TOTP/2FA Generator" description="Generate time-based one-time passwords (TOTP) for two-factor authentication" />

      <div className="space-y-4">
        <div>
          <Label className="text-xs">Secret Key (Base32)</Label>
          <div className="flex gap-2">
            <Input value={secret} onChange={e => setSecret(e.target.value)} placeholder="JBSWY3DPEHPK3PXP" className="font-mono text-sm" />
            <Button variant="outline" size="sm" onClick={generateRandomSecret}>Random</Button>
          </div>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="text-center p-6 bg-card border rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-4xl font-mono font-bold tracking-[0.3em] text-foreground">{code}</span>
            {code !== "------" && <CopyButton text={code} />}
          </div>
          <Progress value={(timeLeft / period) * 100} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">Refreshes in {timeLeft}s</p>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
          <p className="font-semibold mb-1">How it works:</p>
          <p>TOTP uses a shared secret and the current time to generate a 6-digit code that changes every 30 seconds. Compatible with Google Authenticator, Authy, and similar apps.</p>
        </div>
      </div>
    </div>
  );
}
