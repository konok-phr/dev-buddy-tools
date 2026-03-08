import { useState, useRef } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload, Download } from "lucide-react";

interface EnvVar { key: string; value: string; comment: string }

function parseEnv(text: string): EnvVar[] {
  const vars: EnvVar[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let rest = trimmed.slice(eqIdx + 1);
    let comment = "";
    const commentMatch = rest.match(/\s+#\s*(.*)/);
    if (commentMatch && !rest.startsWith('"') && !rest.startsWith("'")) {
      comment = commentMatch[1];
      rest = rest.slice(0, commentMatch.index);
    }
    const value = rest.replace(/^["']|["']$/g, "").trim();
    vars.push({ key, value, comment });
  }
  return vars;
}

function toEnvString(vars: EnvVar[]): string {
  return vars.map(v => {
    const needsQuote = v.value.includes(" ") || v.value.includes("#");
    const val = needsQuote ? `"${v.value}"` : v.value;
    return `${v.key}=${val}${v.comment ? ` # ${v.comment}` : ""}`;
  }).join("\n");
}

export default function EnvFileEditor() {
  const [vars, setVars] = useState<EnvVar[]>([{ key: "", value: "", comment: "" }]);
  const [rawMode, setRawMode] = useState(false);
  const [rawText, setRawText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (i: number, field: keyof EnvVar, val: string) => {
    setVars(vars.map((v, idx) => idx === i ? { ...v, [field]: val } : v));
  };

  const addVar = () => setVars([...vars, { key: "", value: "", comment: "" }]);
  const removeVar = (i: number) => setVars(vars.filter((_, idx) => idx !== i));

  const switchToRaw = () => { setRawText(toEnvString(vars)); setRawMode(true); };
  const switchToVisual = () => { setVars(parseEnv(rawText)); setRawMode(false); };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setVars(parseEnv(text));
      setRawText(text);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const download = () => {
    const content = rawMode ? rawText : toEnvString(vars);
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = ".env";
    a.click();
  };

  const output = rawMode ? rawText : toEnvString(vars);

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title=".env File Editor" description="Edit environment variable files visually or in raw mode" />

      <div className="flex gap-2 mb-4 flex-wrap">
        <Button variant={rawMode ? "outline" : "default"} size="sm" onClick={() => { if (rawMode) switchToVisual(); }}>Visual</Button>
        <Button variant={rawMode ? "default" : "outline"} size="sm" onClick={() => { if (!rawMode) switchToRaw(); }}>Raw</Button>
        <input ref={fileRef} type="file" accept=".env,.env.*,.txt" className="hidden" onChange={handleFile} />
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}><Upload className="h-3 w-3 mr-1" /> Upload</Button>
        <Button variant="outline" size="sm" onClick={download}><Download className="h-3 w-3 mr-1" /> Download</Button>
        <CopyButton text={output} />
      </div>

      {rawMode ? (
        <Textarea value={rawText} onChange={e => setRawText(e.target.value)} className="font-mono text-sm bg-card min-h-[400px]" placeholder="KEY=value" />
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs text-muted-foreground">
            <span>Key</span><span>Value</span><span>Comment</span><span />
          </div>
          {vars.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
              <Input value={v.key} onChange={e => update(i, "key", e.target.value)} placeholder="KEY" className="font-mono text-sm" />
              <Input value={v.value} onChange={e => update(i, "value", e.target.value)} placeholder="value" className="font-mono text-sm" />
              <Input value={v.comment} onChange={e => update(i, "comment", e.target.value)} placeholder="comment" className="text-sm" />
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => removeVar(i)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addVar}><Plus className="h-3 w-3 mr-1" /> Add Variable</Button>
        </div>
      )}
    </div>
  );
}
