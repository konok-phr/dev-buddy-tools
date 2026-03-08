import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Key, Download } from "lucide-react";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

async function generateRSAKeyPair(bits: number) {
  const keyPair = await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"]
  );
  const pubKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  const pubPem = `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(pubKey).match(/.{1,64}/g)?.join("\n")}\n-----END PUBLIC KEY-----`;
  const privPem = `-----BEGIN PRIVATE KEY-----\n${arrayBufferToBase64(privKey).match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----`;
  return { publicKey: pubPem, privateKey: privPem };
}

async function generateECKeyPair(curve: string) {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: curve },
    true,
    ["sign", "verify"]
  );
  const pubKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  const pubPem = `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(pubKey).match(/.{1,64}/g)?.join("\n")}\n-----END PUBLIC KEY-----`;
  const privPem = `-----BEGIN PRIVATE KEY-----\n${arrayBufferToBase64(privKey).match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----`;
  return { publicKey: pubPem, privateKey: privPem };
}

export default function SshKeyGenerator() {
  const [keyType, setKeyType] = useState("rsa-2048");
  const [comment, setComment] = useState("user@example.com");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    setPublicKey("");
    setPrivateKey("");
    try {
      let result;
      if (keyType === "rsa-2048") result = await generateRSAKeyPair(2048);
      else if (keyType === "rsa-4096") result = await generateRSAKeyPair(4096);
      else if (keyType === "ec-p256") result = await generateECKeyPair("P-256");
      else if (keyType === "ec-p384") result = await generateECKeyPair("P-384");
      else throw new Error("Unknown key type");

      setPublicKey(result.publicKey);
      setPrivateKey(result.privateKey);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadKey = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="SSH Key Generator" description="Generate RSA / ECDSA key pairs in the browser (WebCrypto API)" />

      <div className="flex gap-3 mb-4 flex-wrap">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Key Type</label>
          <Select value={keyType} onValueChange={setKeyType}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rsa-2048">RSA 2048-bit</SelectItem>
              <SelectItem value="rsa-4096">RSA 4096-bit</SelectItem>
              <SelectItem value="ec-p256">ECDSA P-256</SelectItem>
              <SelectItem value="ec-p384">ECDSA P-384</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Comment</label>
          <Input value={comment} onChange={e => setComment(e.target.value)} placeholder="user@host" className="w-48 text-sm" />
        </div>
        <div className="flex items-end">
          <Button onClick={generate} disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Generating...</> : <><Key className="h-4 w-4 mr-2" />Generate Keys</>}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {publicKey && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Public Key</h3>
                <Badge variant="secondary" className="text-xs">Safe to share</Badge>
              </div>
              <div className="flex gap-2">
                <CopyButton text={publicKey} />
                <Button variant="ghost" size="sm" onClick={() => downloadKey(publicKey, "id_key.pub")}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <Textarea value={publicKey} readOnly className="font-mono text-xs min-h-[100px]" />
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Private Key</h3>
                <Badge variant="destructive" className="text-xs">Keep secret!</Badge>
              </div>
              <div className="flex gap-2">
                <CopyButton text={privateKey} />
                <Button variant="ghost" size="sm" onClick={() => downloadKey(privateKey, "id_key")}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <Textarea value={privateKey} readOnly className="font-mono text-xs min-h-[120px]" />
          </div>

          <p className="text-xs text-muted-foreground">⚠️ Keys are generated entirely in your browser using WebCrypto. Nothing is sent to any server.</p>
        </div>
      )}
    </div>
  );
}
