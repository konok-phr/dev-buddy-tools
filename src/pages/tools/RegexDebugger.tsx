import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface StepMatch {
  index: number;
  match: string;
  groups: string[];
  start: number;
  end: number;
}

export default function RegexDebugger() {
  const [pattern, setPattern] = useState("(\\w+)@(\\w+\\.\\w+)");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact us at hello@example.com or support@test.org for help.");
  const [showGroups, setShowGroups] = useState(true);

  const { steps, error } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const matches: StepMatch[] = [];
      let m;
      while ((m = re.exec(text)) !== null) {
        matches.push({
          index: matches.length,
          match: m[0],
          groups: m.slice(1),
          start: m.index,
          end: m.index + m[0].length,
        });
        if (!flags.includes("g")) break;
      }
      return { steps: matches, error: "" };
    } catch (e: any) {
      return { steps: [], error: e.message };
    }
  }, [pattern, flags, text]);

  // Build highlighted text
  const highlighted = useMemo(() => {
    if (steps.length === 0) return [<span key="0" className="text-foreground">{text}</span>];
    const parts: JSX.Element[] = [];
    let lastEnd = 0;
    const colors = ["bg-primary/20 text-primary", "bg-accent/40 text-accent-foreground", "bg-destructive/20 text-destructive", "bg-secondary text-secondary-foreground"];
    steps.forEach((s, i) => {
      if (s.start > lastEnd) parts.push(<span key={`t${i}`} className="text-foreground">{text.slice(lastEnd, s.start)}</span>);
      parts.push(
        <span key={`m${i}`} className={`${colors[i % colors.length]} px-0.5 rounded font-semibold`} title={`Match ${i + 1}: "${s.match}"`}>
          {text.slice(s.start, s.end)}
        </span>
      );
      lastEnd = s.end;
    });
    if (lastEnd < text.length) parts.push(<span key="end" className="text-foreground">{text.slice(lastEnd)}</span>);
    return parts;
  }, [steps, text]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Regex Debugger" description="Step-by-step regex match visualization with capture groups" />

      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Pattern</label>
          <Input value={pattern} onChange={e => setPattern(e.target.value)} className="font-mono text-sm" placeholder="Enter regex..." />
        </div>
        <div className="w-20">
          <label className="text-xs text-muted-foreground mb-1 block">Flags</label>
          <Input value={flags} onChange={e => setFlags(e.target.value)} className="font-mono text-sm text-center" placeholder="gi" />
        </div>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="mb-4">
        <label className="text-xs text-muted-foreground mb-1 block">Test String</label>
        <Textarea value={text} onChange={e => setText(e.target.value)} className="font-mono text-sm min-h-[80px]" />
      </div>

      {/* Highlighted preview */}
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground mb-2">Match Highlight</h3>
        <p className="font-mono text-sm leading-relaxed break-all">{highlighted}</p>
      </div>

      {/* Step-by-step */}
      {steps.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">{steps.length} match(es) found</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Show groups</span>
              <Switch checked={showGroups} onCheckedChange={setShowGroups} />
            </div>
          </div>

          {steps.map((s, i) => (
            <div key={i} className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">Step {i + 1}</Badge>
                <span className="font-mono text-sm font-semibold text-primary">"{s.match}"</span>
                <span className="text-xs text-muted-foreground">at index {s.start}–{s.end}</span>
              </div>
              {showGroups && s.groups.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {s.groups.map((g, j) => (
                    <div key={j} className="text-xs">
                      <span className="text-muted-foreground">Group {j + 1}:</span>{" "}
                      <code className="font-mono text-foreground bg-muted px-1 rounded">{g || "(empty)"}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {steps.length === 0 && !error && pattern && (
        <p className="text-sm text-muted-foreground text-center py-4">No matches found</p>
      )}
    </div>
  );
}
