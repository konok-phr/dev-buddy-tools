import { useState, useCallback } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw } from "lucide-react";

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    let chars = "";
    if (opts.uppercase) chars += CHARSETS.uppercase;
    if (opts.lowercase) chars += CHARSETS.lowercase;
    if (opts.numbers) chars += CHARSETS.numbers;
    if (opts.symbols) chars += CHARSETS.symbols;
    if (!chars) chars = CHARSETS.lowercase;
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, v => chars[v % chars.length]).join(""));
  }, [length, opts]);

  const strength = (() => {
    let s = 0;
    if (length >= 12) s++;
    if (length >= 16) s++;
    if (opts.uppercase && opts.lowercase) s++;
    if (opts.numbers) s++;
    if (opts.symbols) s++;
    return s;
  })();

  const strengthLabel = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][Math.min(strength, 4)];
  const strengthColor = ["bg-destructive", "bg-destructive", "bg-yellow-500", "bg-accent", "bg-accent"][Math.min(strength, 4)];

  useState(() => { generate(); });

  return (
    <div className="max-w-lg mx-auto">
      <ToolHeader title="Password Generator" description="Generate secure random passwords" />
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-lg flex-1 break-all text-foreground">{password}</span>
          <CopyButton text={password} />
          <Button variant="ghost" size="icon" onClick={generate}><RefreshCw className="h-4 w-4" /></Button>
        </div>
        <div className="flex gap-1 mb-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i < strength ? strengthColor : "bg-border"}`} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{strengthLabel}</p>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <label className="text-muted-foreground">Length</label>
            <span className="font-mono text-foreground">{length}</span>
          </div>
          <Slider value={[length]} onValueChange={([v]) => setLength(v)} min={4} max={64} step={1} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(CHARSETS) as Array<keyof typeof CHARSETS>).map(key => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={opts[key]} onCheckedChange={v => setOpts(p => ({ ...p, [key]: !!v }))} />
              <span className="capitalize text-foreground">{key}</span>
            </label>
          ))}
        </div>
        <Button onClick={generate} className="w-full">Generate Password</Button>
      </div>
    </div>
  );
}
