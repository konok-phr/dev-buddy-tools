import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function TextFindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const result = useMemo(() => {
    if (!find || !text) return { output: text, count: 0 };
    try {
      const flags = caseSensitive ? "g" : "gi";
      const regex = useRegex ? new RegExp(find, flags) : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      const matches = text.match(regex);
      return { output: text.replace(regex, replace), count: matches ? matches.length : 0 };
    } catch { return { output: text, count: 0 }; }
  }, [text, find, replace, caseSensitive, useRegex]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Find & Replace" description="Find and replace text with regex support" />
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex gap-2">
          <Input value={find} onChange={e => setFind(e.target.value)} placeholder="Find..." className="font-mono text-sm" />
          <Input value={replace} onChange={e => setReplace(e.target.value)} placeholder="Replace with..." className="font-mono text-sm" />
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2"><Switch checked={caseSensitive} onCheckedChange={setCaseSensitive} /><Label className="text-sm">Case sensitive</Label></div>
          <div className="flex items-center gap-2"><Switch checked={useRegex} onCheckedChange={setUseRegex} /><Label className="text-sm">Regex</Label></div>
          {find && <span className="text-xs text-muted-foreground">{result.count} match(es)</span>}
        </div>
      </div>
      <Textarea value={text} onChange={e => setText(e.target.value)} className="h-40 font-mono text-sm mb-3" placeholder="Paste text..." />
      <div className="flex justify-end mb-1"><CopyButton text={result.output} /></div>
      <Textarea value={result.output} readOnly className="h-40 font-mono text-sm" />
    </div>
  );
}
