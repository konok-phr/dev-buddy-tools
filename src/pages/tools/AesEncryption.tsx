import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Unlock, Loader2 } from "lucide-react";

async function aesEncrypt(text: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(text));
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  return btoa(String.fromCharCode(...combined));
}

async function aesDecrypt(b64: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const ciphertext = data.slice(28);
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

export default function AesEncryption() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const process = async () => {
    if (!input || !password) return;
    setLoading(true); setError(""); setOutput("");
    try {
      const result = mode === "encrypt" ? await aesEncrypt(input, password) : await aesDecrypt(input, password);
      setOutput(result);
    } catch { setError(mode === "encrypt" ? "Encryption failed" : "Decryption failed — wrong password or corrupted data"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="AES Encryption" description="Encrypt and decrypt text using AES-256-GCM with PBKDF2 key derivation" />
      <div className="flex gap-2 mb-4">
        <Select value={mode} onValueChange={(v: any) => { setMode(v); setOutput(""); setError(""); }}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="encrypt"><span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />Encrypt</span></SelectItem>
            <SelectItem value="decrypt"><span className="flex items-center gap-1.5"><Unlock className="h-3.5 w-3.5" />Decrypt</span></SelectItem>
          </SelectContent>
        </Select>
        <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password / Key" className="font-mono text-sm flex-1" />
        <Button onClick={process} disabled={loading || !input || !password}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "encrypt" ? "Encrypt" : "Decrypt"}
        </Button>
      </div>
      <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Paste encrypted Base64..."} className="font-mono text-sm min-h-[120px] mb-4" />
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">{mode === "encrypt" ? "Encrypted (Base64)" : "Decrypted Text"}</h2>
            <CopyButton text={output} />
          </div>
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap break-all text-foreground">{output}</pre>
        </div>
      )}
    </div>
  );
}
