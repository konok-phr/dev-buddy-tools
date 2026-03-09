import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let bits = "", out = "";
  for (const b of bytes) bits += b.toString(2).padStart(8, "0");
  while (bits.length % 5 !== 0) bits += "0";
  for (let i = 0; i < bits.length; i += 5) out += B32[parseInt(bits.slice(i, i + 5), 2)];
  while (out.length % 8 !== 0) out += "=";
  return out;
}

function base32Decode(input: string): string {
  const clean = input.replace(/=+$/, "").toUpperCase();
  let bits = "";
  for (const c of clean) { const i = B32.indexOf(c); if (i < 0) return "Invalid Base32"; bits += i.toString(2).padStart(5, "0"); }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export default function Base32Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const convert = () => setOutput(mode === "encode" ? base32Encode(input) : base32Decode(input));

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Base32 Encoder/Decoder" description="Encode and decode Base32 strings" />
      <div className="flex gap-2 mb-4">
        <Button variant={mode === "encode" ? "default" : "outline"} onClick={() => setMode("encode")}>Encode</Button>
        <Button variant={mode === "decode" ? "default" : "outline"} onClick={() => setMode("decode")}>Decode</Button>
      </div>
      <Textarea value={input} onChange={e => setInput(e.target.value)} className="h-28 font-mono text-sm mb-2" placeholder={mode === "encode" ? "Text to encode..." : "Base32 to decode..."} />
      <Button onClick={convert} className="mb-3">Convert</Button>
      <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
      <Textarea value={output} readOnly className="h-28 font-mono text-sm" />
    </div>
  );
}
