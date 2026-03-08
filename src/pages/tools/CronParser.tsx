import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";

const FIELDS = [
  { label: "Minute", range: "0-59", special: ", - * /" },
  { label: "Hour", range: "0-23", special: ", - * /" },
  { label: "Day of Month", range: "1-31", special: ", - * / L W" },
  { label: "Month", range: "1-12", special: ", - * /" },
  { label: "Day of Week", range: "0-6 (Sun=0)", special: ", - * / L #" },
];

const PRESETS = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at midnight", cron: "0 0 * * *" },
  { label: "Every Monday at 9am", cron: "0 9 * * 1" },
  { label: "Every 5 minutes", cron: "*/5 * * * *" },
  { label: "Every day at noon", cron: "0 12 * * *" },
  { label: "First of every month", cron: "0 0 1 * *" },
  { label: "Every weekday at 8am", cron: "0 8 * * 1-5" },
];

function describeCronPart(value: string, field: string): string {
  if (value === "*") return `every ${field.toLowerCase()}`;
  if (value.startsWith("*/")) return `every ${value.slice(2)} ${field.toLowerCase()}(s)`;
  if (value.includes(",")) return `${field} ${value}`;
  if (value.includes("-")) return `${field} ${value.split("-")[0]} through ${value.split("-")[1]}`;
  return `${field} ${value}`;
}

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression (need 5 fields)";
  const [min, hour, dom, month, dow] = parts;
  const descs: string[] = [];

  if (min === "0" && hour === "0" && dom === "*" && month === "*" && dow === "*") return "Every day at midnight";
  if (min === "0" && hour === "*" && dom === "*" && month === "*" && dow === "*") return "Every hour at minute 0";
  if (min === "*" && hour === "*" && dom === "*" && month === "*" && dow === "*") return "Every minute";

  descs.push(describeCronPart(min, "Minute"));
  descs.push(describeCronPart(hour, "Hour"));
  if (dom !== "*") descs.push(describeCronPart(dom, "Day"));
  if (month !== "*") descs.push(describeCronPart(month, "Month"));
  if (dow !== "*") descs.push(describeCronPart(dow, "Day of week"));

  return descs.join(", ");
}

function getNextRuns(expr: string, count: number = 5): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const runs: string[] = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0);
  d.setMilliseconds(0);

  const match = (val: string, num: number): boolean => {
    if (val === "*") return true;
    if (val.startsWith("*/")) return num % parseInt(val.slice(2)) === 0;
    if (val.includes(",")) return val.split(",").map(Number).includes(num);
    if (val.includes("-")) {
      const [a, b] = val.split("-").map(Number);
      return num >= a && num <= b;
    }
    return parseInt(val) === num;
  };

  for (let i = 0; i < 525600 && runs.length < count; i++) {
    d.setMinutes(d.getMinutes() + 1);
    if (
      match(parts[0], d.getMinutes()) &&
      match(parts[1], d.getHours()) &&
      match(parts[2], d.getDate()) &&
      match(parts[3], d.getMonth() + 1) &&
      match(parts[4], d.getDay())
    ) {
      runs.push(d.toISOString().replace("T", " ").slice(0, 16));
    }
  }
  return runs;
}

export default function CronParser() {
  const [cron, setCron] = useState("*/5 * * * *");

  const description = useMemo(() => describeCron(cron), [cron]);
  const nextRuns = useMemo(() => getNextRuns(cron), [cron]);

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Cron Expression Parser" description="Parse and understand cron expressions" />
      <Input value={cron} onChange={e => setCron(e.target.value)} className="font-mono text-lg bg-card mb-4 text-center" placeholder="* * * * *" />

      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <p className="text-xs text-muted-foreground mb-1">Description</p>
        <p className="text-foreground font-medium">{description}</p>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {cron.trim().split(/\s+/).map((val, i) => FIELDS[i] && (
          <div key={i} className="bg-card border border-border rounded-md p-2 text-center">
            <p className="font-mono text-primary text-lg">{val}</p>
            <p className="text-xs text-muted-foreground">{FIELDS[i].label}</p>
            <p className="text-[10px] text-muted-foreground">{FIELDS[i].range}</p>
          </div>
        ))}
      </div>

      {nextRuns.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-foreground">Next 5 Runs</h3>
          <div className="space-y-1">
            {nextRuns.map((r, i) => (
              <div key={i} className="bg-card border border-border rounded-md px-3 py-1.5 font-mono text-sm text-foreground">{r}</div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold mb-2 text-foreground">Common Presets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESETS.map(p => (
            <button key={p.cron} onClick={() => setCron(p.cron)}
              className="text-left bg-card border border-border rounded-md px-3 py-2 hover:border-primary/50 transition-colors">
              <span className="font-mono text-xs text-primary">{p.cron}</span>
              <span className="text-xs text-muted-foreground ml-2">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
