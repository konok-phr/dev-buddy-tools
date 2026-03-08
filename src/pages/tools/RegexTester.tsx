import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testStr, setTestStr] = useState("");

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: "" };
    try {
      const re = new RegExp(pattern, flags);
      const m: { text: string; index: number; groups: string[] }[] = [];
      let match;
      if (flags.includes("g")) {
        while ((match = re.exec(testStr)) !== null) {
          m.push({ text: match[0], index: match.index, groups: match.slice(1) });
          if (!match[0]) re.lastIndex++;
        }
      } else {
        match = re.exec(testStr);
        if (match) m.push({ text: match[0], index: match.index, groups: match.slice(1) });
      }
      return { matches: m, error: "" };
    } catch (e: any) {
      return { matches: [], error: e.message };
    }
  }, [pattern, flags, testStr]);

  const highlighted = useMemo(() => {
    if (!pattern || !testStr || error) return testStr;
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      return testStr.replace(re, (m) => `██${m}██`);
    } catch { return testStr; }
  }, [pattern, flags, testStr, error]);

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="Regex Tester" description="Test regular expressions with live match highlighting" />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_100px] gap-3 mb-4">
        <Input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="Enter regex pattern..." className="font-mono bg-card" />
        <Input value={flags} onChange={e => setFlags(e.target.value)} placeholder="Flags" className="font-mono bg-card" />
      </div>
      {error && <p className="text-destructive text-sm font-mono mb-3">{error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Test String</label>
          <Textarea value={testStr} onChange={e => setTestStr(e.target.value)} className="font-mono text-sm bg-card min-h-[200px]" placeholder="Enter test string..." />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Matches ({matches.length})</label>
          <div className="bg-card border border-border rounded-md p-3 min-h-[200px] font-mono text-sm space-y-2 overflow-auto">
            {matches.length === 0 && <span className="text-muted-foreground">No matches</span>}
            {matches.map((m, i) => (
              <div key={i} className="border-b border-border pb-2 last:border-0">
                <span className="text-primary">Match {i + 1}:</span>{" "}
                <span className="text-accent">"{m.text}"</span>
                <span className="text-muted-foreground ml-2">at index {m.index}</span>
                {m.groups.length > 0 && (
                  <div className="ml-4 text-xs text-muted-foreground">
                    Groups: {m.groups.map((g, j) => <span key={j} className="text-foreground mr-2">({j + 1}) "{g}"</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
