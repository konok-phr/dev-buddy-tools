import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Entry { type: string; message: string }

const TYPES = ["Added", "Changed", "Fixed", "Removed", "Deprecated", "Security"];

export default function ChangelogGenerator() {
  const [version, setVersion] = useState("1.0.0");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [type, setType] = useState("Added");
  const [msg, setMsg] = useState("");

  const addEntry = () => { if (msg.trim()) { setEntries([...entries, { type, message: msg.trim() }]); setMsg(""); } };

  const output = `## [${version}] - ${date}\n\n` + TYPES
    .map(t => {
      const items = entries.filter(e => e.type === t);
      return items.length ? `### ${t}\n${items.map(e => `- ${e.message}`).join("\n")}` : "";
    })
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Changelog Generator" description="Generate CHANGELOG.md entries following Keep a Changelog format" />
      <div className="flex gap-3 mb-4 items-end">
        <div><Label className="text-sm">Version</Label><Input value={version} onChange={e => setVersion(e.target.value)} className="w-28" /></div>
        <div><Label className="text-sm">Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-36" /></div>
      </div>
      <div className="flex gap-2 mb-4">
        <Select value={type} onValueChange={setType}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
        <Input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Change description..." className="flex-1" onKeyDown={e => e.key === "Enter" && addEntry()} />
        <Button onClick={addEntry}>Add</Button>
      </div>
      {entries.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {entries.map((e, i) => (
            <span key={i} className="text-xs border rounded px-2 py-1">
              <strong>{e.type}:</strong> {e.message}
              <button className="ml-1 text-destructive" onClick={() => setEntries(entries.filter((_, j) => j !== i))}>×</button>
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
      <Textarea value={output} readOnly className="font-mono text-sm h-48" />
    </div>
  );
}
