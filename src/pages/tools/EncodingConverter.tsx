import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function toUnicodeEscape(str: string) {
  return [...str].map(c => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")).join("");
}
function toHexEncoding(str: string) {
  return [...str].map(c => "0x" + c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
}
function toDecimalCodes(str: string) {
  return [...str].map(c => c.charCodeAt(0)).join(" ");
}
function toBinaryEncoding(str: string) {
  return [...str].map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}
function fromUnicodeEscape(str: string) {
  try { return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))); } catch { return ""; }
}
function fromHexEncoding(str: string) {
  try { return str.split(/\s+/).map(h => String.fromCharCode(parseInt(h, 16))).join(""); } catch { return ""; }
}
function fromDecimalCodes(str: string) {
  try { return str.split(/\s+/).map(d => String.fromCharCode(parseInt(d, 10))).join(""); } catch { return ""; }
}
function fromBinaryEncoding(str: string) {
  try { return str.split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join(""); } catch { return ""; }
}

const encodings = [
  { id: "unicode", label: "Unicode Escape", encode: toUnicodeEscape, decode: fromUnicodeEscape },
  { id: "hex", label: "Hex", encode: toHexEncoding, decode: fromHexEncoding },
  { id: "decimal", label: "Decimal", encode: toDecimalCodes, decode: fromDecimalCodes },
  { id: "binary", label: "Binary", encode: toBinaryEncoding, decode: fromBinaryEncoding },
];

export default function EncodingConverter() {
  const [input, setInput] = useState("Hello, World! 🌍");

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Encoding Converter" description="Convert text between UTF-8, Unicode, Hex, Decimal & Binary" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Text Input</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="bg-card text-sm min-h-[80px]" placeholder="Enter text..." />
        </div>
        <div className="space-y-3">
          {encodings.map(enc => {
            const encoded = enc.encode(input);
            return (
              <div key={enc.id} className="border border-border rounded-lg p-3 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-muted-foreground font-medium">{enc.label}</label>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setInput(enc.decode(encoded))}>Decode</Button>
                    <CopyButton text={encoded} />
                  </div>
                </div>
                <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all text-foreground">{encoded}</pre>
              </div>
            );
          })}
        </div>
        <div className="border border-border rounded-lg p-3 bg-card">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground font-medium">UTF-8 Bytes</label>
            <CopyButton text={new TextEncoder().encode(input).toString()} />
          </div>
          <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all text-foreground">
            {[...new TextEncoder().encode(input)].map(b => b.toString(16).padStart(2, "0")).join(" ")}
          </pre>
        </div>
      </div>
    </div>
  );
}
