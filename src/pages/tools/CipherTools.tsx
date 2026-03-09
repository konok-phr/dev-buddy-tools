import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

const MORSE: Record<string, string> = {
  A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",
  M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",
  Y:"-.--",Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....",
  "6":"-....","7":"--...","8":"---..","9":"----.",
  " ":"/",".":".-.-.-",",":"--..--","?":"..--..",":":"---...","'":".----.","-":"-....-",
  "/":"-..-.",'"':".-..-."
};
const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

function textToMorse(text: string): string { return text.toUpperCase().split("").map(c => MORSE[c] || c).join(" "); }
function morseToText(morse: string): string { return morse.split(" ").map(c => c === "/" ? " " : REVERSE_MORSE[c] || c).join(""); }

function caesarEncrypt(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
  });
}

export default function CipherTools() {
  const [input, setInput] = useState("Hello World 123");
  const [shift, setShift] = useState(3);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Cipher & Encoding Tools" description="ROT13, Caesar cipher and Morse code converter" />
      <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text..." className="font-mono text-sm min-h-[100px] mb-4" />

      <Tabs defaultValue="rot13" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="rot13" className="flex-1">ROT13</TabsTrigger>
          <TabsTrigger value="caesar" className="flex-1">Caesar</TabsTrigger>
          <TabsTrigger value="morse" className="flex-1">Morse</TabsTrigger>
        </TabsList>

        <TabsContent value="rot13">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">ROT13 Output</h2>
            <CopyButton text={rot13(input)} />
          </div>
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap text-foreground">{rot13(input)}</pre>
        </TabsContent>

        <TabsContent value="caesar">
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm text-muted-foreground">Shift:</label>
            <input type="range" min={1} max={25} value={shift} onChange={e => setShift(Number(e.target.value))} className="flex-1" />
            <span className="text-sm font-mono text-foreground w-6 text-center">{shift}</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs text-muted-foreground">Encrypted</h3>
                <CopyButton text={caesarEncrypt(input, shift)} />
              </div>
              <pre className="p-3 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap text-foreground">{caesarEncrypt(input, shift)}</pre>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs text-muted-foreground">Decrypted</h3>
                <CopyButton text={caesarEncrypt(input, 26 - shift)} />
              </div>
              <pre className="p-3 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap text-foreground">{caesarEncrypt(input, 26 - shift)}</pre>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="morse">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs text-muted-foreground">Text → Morse</h3>
                <CopyButton text={textToMorse(input)} />
              </div>
              <pre className="p-3 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap text-foreground">{textToMorse(input)}</pre>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs text-muted-foreground">Morse → Text</h3>
                <CopyButton text={morseToText(input)} />
              </div>
              <pre className="p-3 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap text-foreground">{morseToText(input)}</pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
