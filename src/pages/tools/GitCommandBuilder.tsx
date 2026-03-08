import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Option { label: string; flag: string; placeholder?: string; hasValue?: boolean }

const commands: Record<string, { description: string; base: string; options: Option[] }> = {
  "Clone": { description: "Clone a repository", base: "git clone", options: [
    { label: "Depth (shallow)", flag: "--depth", hasValue: true, placeholder: "1" },
    { label: "Branch", flag: "--branch", hasValue: true, placeholder: "main" },
    { label: "Single branch", flag: "--single-branch" },
  ]},
  "Commit": { description: "Commit changes", base: "git commit", options: [
    { label: "Message", flag: "-m", hasValue: true, placeholder: "feat: add feature" },
    { label: "All tracked files", flag: "-a" },
    { label: "Amend last commit", flag: "--amend" },
    { label: "No edit", flag: "--no-edit" },
  ]},
  "Branch": { description: "Manage branches", base: "git branch", options: [
    { label: "Delete", flag: "-d" },
    { label: "Force delete", flag: "-D" },
    { label: "List all (incl. remote)", flag: "-a" },
    { label: "Move/rename", flag: "-m" },
  ]},
  "Checkout": { description: "Switch branches or restore", base: "git checkout", options: [
    { label: "Create new branch", flag: "-b" },
    { label: "Force", flag: "-f" },
    { label: "Track remote", flag: "--track" },
  ]},
  "Merge": { description: "Merge branches", base: "git merge", options: [
    { label: "No fast-forward", flag: "--no-ff" },
    { label: "Squash", flag: "--squash" },
    { label: "Abort", flag: "--abort" },
  ]},
  "Rebase": { description: "Rebase commits", base: "git rebase", options: [
    { label: "Interactive", flag: "-i" },
    { label: "Abort", flag: "--abort" },
    { label: "Continue", flag: "--continue" },
  ]},
  "Stash": { description: "Stash changes", base: "git stash", options: [
    { label: "With message", flag: "-m", hasValue: true, placeholder: "WIP: description" },
    { label: "Include untracked", flag: "-u" },
    { label: "Pop (apply & remove)", flag: "pop" },
    { label: "List", flag: "list" },
  ]},
  "Reset": { description: "Reset changes", base: "git reset", options: [
    { label: "Soft (keep staged)", flag: "--soft" },
    { label: "Hard (discard all)", flag: "--hard" },
    { label: "Mixed (default)", flag: "--mixed" },
  ]},
  "Log": { description: "View commit history", base: "git log", options: [
    { label: "One line", flag: "--oneline" },
    { label: "Graph", flag: "--graph" },
    { label: "Limit", flag: "-n", hasValue: true, placeholder: "10" },
    { label: "All branches", flag: "--all" },
  ]},
};

export default function GitCommandBuilder() {
  const [selected, setSelected] = useState("Commit");
  const [args, setArgs] = useState("");
  const [activeFlags, setActiveFlags] = useState<Record<string, boolean>>({});
  const [flagValues, setFlagValues] = useState<Record<string, string>>({});

  const cmd = commands[selected];

  const toggleFlag = (flag: string) => setActiveFlags(prev => ({ ...prev, [flag]: !prev[flag] }));

  const result = useMemo(() => {
    let parts = [cmd.base];
    cmd.options.forEach(opt => {
      if (!activeFlags[opt.flag]) return;
      if (opt.hasValue && flagValues[opt.flag]) {
        if (opt.flag === "-m") parts.push(`${opt.flag} "${flagValues[opt.flag]}"`);
        else parts.push(`${opt.flag} ${flagValues[opt.flag]}`);
      } else if (!opt.hasValue) {
        parts.push(opt.flag);
      }
    });
    if (args.trim()) parts.push(args.trim());
    return parts.join(" ");
  }, [cmd, activeFlags, flagValues, args]);

  const handleCommandChange = (val: string) => {
    setSelected(val);
    setActiveFlags({});
    setFlagValues({});
    setArgs("");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Git Command Builder" description="Build Git commands interactively" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Command</label>
          <Select value={selected} onValueChange={handleCommandChange}>
            <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(commands).map(([k, v]) => (
                <SelectItem key={k} value={k}>{k} — {v.description}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Options</label>
          <div className="space-y-2">
            {cmd.options.map(opt => (
              <div key={opt.flag} className="flex items-center gap-3">
                <Checkbox checked={!!activeFlags[opt.flag]} onCheckedChange={() => toggleFlag(opt.flag)} />
                <span className="text-sm text-foreground min-w-[160px]">{opt.label}</span>
                <code className="text-xs font-mono text-muted-foreground min-w-[80px]">{opt.flag}</code>
                {opt.hasValue && activeFlags[opt.flag] && (
                  <Input
                    value={flagValues[opt.flag] || ""}
                    onChange={e => setFlagValues(prev => ({ ...prev, [opt.flag]: e.target.value }))}
                    className="bg-card text-sm h-8 flex-1"
                    placeholder={opt.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Additional Arguments</label>
          <Input value={args} onChange={e => setArgs(e.target.value)} className="bg-card text-sm font-mono" placeholder="e.g. origin main, HEAD~3, file.txt" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Generated Command</label>
            <CopyButton text={result} />
          </div>
          <pre className="text-sm font-mono bg-card border border-border rounded p-4 overflow-x-auto text-primary">{result}</pre>
        </div>
      </div>
    </div>
  );
}
