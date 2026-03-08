import { useState, useMemo, useRef } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const LEVELS = ["ERROR", "WARN", "INFO", "DEBUG"] as const;

function getLevel(line: string): string {
  const upper = line.toUpperCase();
  for (const l of LEVELS) if (upper.includes(l)) return l;
  return "OTHER";
}

const levelColors: Record<string, string> = {
  ERROR: "text-destructive",
  WARN: "text-yellow-400",
  INFO: "text-primary",
  DEBUG: "text-muted-foreground",
  OTHER: "text-foreground",
};

export default function LogViewer() {
  const [logs, setLogs] = useState("");
  const [filter, setFilter] = useState("");
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogs(reader.result as string);
    reader.readAsText(file);
    e.target.value = "";
  };

  const lines = useMemo(() => {
    return logs.split("\n").filter(l => l.trim()).map((line, i) => ({
      num: i + 1,
      text: line,
      level: getLevel(line),
    }));
  }, [logs]);

  const filtered = lines.filter(l => {
    if (activeLevel && l.level !== activeLevel) return false;
    if (filter && !l.text.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const l of lines) c[l.level] = (c[l.level] || 0) + 1;
    return c;
  }, [lines]);

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader title="Log Viewer" description="Paste logs or upload a log file, filter by level and search" />
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-2">
            <Upload className="h-3.5 w-3.5" /> Upload log file
          </Button>
          <input ref={fileRef} type="file" accept=".log,.txt,.csv,.json,*" className="hidden" onChange={handleFile} />
          <span className="text-xs text-muted-foreground">or paste below</span>
        </div>
        <Textarea
          value={logs}
          onChange={e => setLogs(e.target.value)}
          placeholder="Paste your log output here..."
          className="font-mono text-sm bg-card min-h-[120px]"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter logs..." className="bg-card flex-1" />
        <div className="flex gap-2 flex-wrap">
          <Badge variant={activeLevel === null ? "default" : "secondary"} className="cursor-pointer" onClick={() => setActiveLevel(null)}>
            All ({lines.length})
          </Badge>
          {LEVELS.map(l => counts[l] ? (
            <Badge key={l} variant={activeLevel === l ? "default" : "secondary"} className="cursor-pointer" onClick={() => setActiveLevel(activeLevel === l ? null : l)}>
              {l} ({counts[l]})
            </Badge>
          ) : null)}
        </div>
      </div>
      <div className="bg-card border border-border rounded-md max-h-[400px] overflow-auto">
        {filtered.length === 0 && <p className="p-4 text-muted-foreground text-sm">No log lines to display</p>}
        {filtered.map(l => (
          <div key={l.num} className="flex gap-3 px-3 py-1 border-b border-border/50 hover:bg-secondary/50 font-mono text-xs">
            <span className="text-muted-foreground w-8 text-right shrink-0">{l.num}</span>
            <span className={`w-12 shrink-0 font-semibold ${levelColors[l.level]}`}>{l.level !== "OTHER" ? l.level : ""}</span>
            <span className="text-foreground whitespace-pre-wrap break-all">{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
