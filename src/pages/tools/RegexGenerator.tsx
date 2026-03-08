import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface PatternPart {
  id: string;
  label: string;
  pattern: string;
  description: string;
}

const patternParts: PatternPart[] = [
  { id: "start", label: "Start of string", pattern: "^", description: "Anchors to beginning" },
  { id: "end", label: "End of string", pattern: "$", description: "Anchors to end" },
  { id: "digits", label: "Digits (0-9)", pattern: "\\d+", description: "One or more digits" },
  { id: "letters", label: "Letters (a-z)", pattern: "[a-zA-Z]+", description: "One or more letters" },
  { id: "alphanumeric", label: "Alphanumeric", pattern: "[a-zA-Z0-9]+", description: "Letters and digits" },
  { id: "whitespace", label: "Whitespace", pattern: "\\s+", description: "Spaces, tabs, newlines" },
  { id: "word", label: "Word characters", pattern: "\\w+", description: "Letters, digits, underscore" },
  { id: "any", label: "Any character", pattern: ".", description: "Any single character" },
  { id: "email", label: "Email pattern", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", description: "Basic email format" },
  { id: "url", label: "URL pattern", pattern: "https?://[^\\s]+", description: "HTTP/HTTPS URLs" },
  { id: "ipv4", label: "IPv4 address", pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}", description: "e.g. 192.168.1.1" },
  { id: "phone", label: "Phone number", pattern: "\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}", description: "International phone" },
  { id: "date-iso", label: "ISO Date", pattern: "\\d{4}-\\d{2}-\\d{2}", description: "YYYY-MM-DD" },
  { id: "hex-color", label: "Hex color", pattern: "#[0-9a-fA-F]{3,8}", description: "#RGB or #RRGGBB" },
];

const presets = [
  { label: "Email", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
  { label: "URL", pattern: "^https?://[^\\s]+$" },
  { label: "IPv4", pattern: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$" },
  { label: "Date (YYYY-MM-DD)", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
  { label: "Phone", pattern: "^\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$" },
  { label: "Hex Color", pattern: "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$" },
  { label: "Slug", pattern: "^[a-z0-9]+(-[a-z0-9]+)*$" },
  { label: "Username", pattern: "^[a-zA-Z0-9_]{3,20}$" },
];

export default function RegexGenerator() {
  const [pattern, setPattern] = useState("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
  const [testStr, setTestStr] = useState("user@example.com");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });

  const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");

  const matches = useMemo(() => {
    try {
      const re = new RegExp(pattern, flagStr);
      const m = [...testStr.matchAll(new RegExp(pattern, flagStr.includes("g") ? flagStr : flagStr + "g"))];
      return { matches: m, valid: true, error: "" };
    } catch (e: any) {
      return { matches: [], valid: false, error: e.message };
    }
  }, [pattern, testStr, flagStr]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Regex Generator" description="Build regular expressions from presets and patterns" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Quick Presets</label>
          <div className="flex flex-wrap gap-1.5">
            {presets.map(p => (
              <Button key={p.label} variant="outline" size="sm" className="h-7 text-xs" onClick={() => setPattern(p.pattern)}>
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Pattern</label>
            <CopyButton text={pattern} />
          </div>
          <Input value={pattern} onChange={e => setPattern(e.target.value)} className="font-mono text-sm bg-card" />
          {!matches.valid && <p className="text-destructive text-xs mt-1 font-mono">{matches.error}</p>}
        </div>

        <div className="flex gap-4">
          {(["g", "i", "m"] as const).map(f => (
            <label key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Checkbox checked={flags[f]} onCheckedChange={v => setFlags(prev => ({ ...prev, [f]: !!v }))} />
              {f === "g" ? "Global" : f === "i" ? "Case-insensitive" : "Multiline"}
            </label>
          ))}
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Test String</label>
          <Input value={testStr} onChange={e => setTestStr(e.target.value)} className="bg-card text-sm" />
        </div>

        {matches.valid && (
          <div className="border border-border rounded-lg p-3 bg-card">
            <p className="text-xs text-muted-foreground mb-1">
              {matches.matches.length} match{matches.matches.length !== 1 ? "es" : ""} found
            </p>
            {matches.matches.map((m, i) => (
              <div key={i} className="text-sm font-mono">
                <span className="text-primary font-medium">{m[0]}</span>
                <span className="text-muted-foreground text-xs ml-2">index {m.index}</span>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Pattern Building Blocks</label>
          <div className="grid grid-cols-2 gap-1.5">
            {patternParts.map(p => (
              <button
                key={p.id}
                onClick={() => setPattern(prev => prev + p.pattern)}
                className="flex items-center justify-between border border-border rounded px-3 py-1.5 bg-card hover:bg-accent text-left"
              >
                <span className="text-xs text-foreground">{p.label}</span>
                <code className="text-xs font-mono text-muted-foreground">{p.pattern}</code>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">JavaScript Usage</label>
            <CopyButton text={`const regex = /${pattern}/${flagStr};`} />
          </div>
          <pre className="text-xs font-mono bg-card border border-border rounded p-3 overflow-x-auto">
            {`const regex = /${pattern}/${flagStr};\nconst result = regex.test("${testStr}"); // ${matches.valid ? new RegExp(pattern, flagStr).test(testStr).toString() : "error"}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
