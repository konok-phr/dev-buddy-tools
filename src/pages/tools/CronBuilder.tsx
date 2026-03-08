import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const PRESETS = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every 5 minutes", cron: "*/5 * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at midnight", cron: "0 0 * * *" },
  { label: "Every Monday at 9 AM", cron: "0 9 * * 1" },
  { label: "Every 1st of month", cron: "0 0 1 * *" },
  { label: "Every weekday at 8 AM", cron: "0 8 * * 1-5" },
  { label: "Every Sunday at noon", cron: "0 12 * * 0" },
];

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function describeCron(parts: string[]): string {
  if (parts.length !== 5) return "Invalid cron expression";
  const [min, hour, dom, mon, dow] = parts;
  const pieces: string[] = [];

  if (min === "*" && hour === "*") pieces.push("Every minute");
  else if (min.startsWith("*/")) pieces.push(`Every ${min.slice(2)} minutes`);
  else if (hour === "*") pieces.push(`At minute ${min} of every hour`);
  else if (min === "0" && hour === "*") pieces.push("Every hour");
  else if (hour.startsWith("*/")) pieces.push(`Every ${hour.slice(2)} hours at minute ${min}`);
  else pieces.push(`At ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`);

  if (dom !== "*") pieces.push(`on day ${dom} of the month`);
  if (mon !== "*") {
    const mIdx = parseInt(mon) - 1;
    pieces.push(`in ${MONTHS[mIdx] || mon}`);
  }
  if (dow !== "*") {
    if (dow === "1-5") pieces.push("on weekdays");
    else if (dow === "0,6") pieces.push("on weekends");
    else {
      const dIdx = parseInt(dow);
      pieces.push(`on ${DAYS_OF_WEEK[dIdx] || dow}`);
    }
  }
  return pieces.join(" ");
}

function getNextRuns(parts: string[], count = 5): string[] {
  if (parts.length !== 5) return [];
  const runs: string[] = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);

  const match = (val: string, num: number): boolean => {
    if (val === "*") return true;
    if (val.startsWith("*/")) return num % parseInt(val.slice(2)) === 0;
    if (val.includes(",")) return val.split(",").map(Number).includes(num);
    if (val.includes("-")) { const [a, b] = val.split("-").map(Number); return num >= a && num <= b; }
    return parseInt(val) === num;
  };

  let safety = 0;
  while (runs.length < count && safety < 525600) {
    const [min, hour, dom, mon, dow] = parts;
    if (match(min, d.getMinutes()) && match(hour, d.getHours()) && match(dom, d.getDate()) && match(mon, d.getMonth() + 1) && match(dow, d.getDay())) {
      runs.push(d.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", weekday: "short" }));
    }
    d.setMinutes(d.getMinutes() + 1);
    safety++;
  }
  return runs;
}

export default function CronBuilder() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");

  const cron = `${minute} ${hour} ${dom} ${month} ${dow}`;
  const parts = cron.split(" ");
  const description = useMemo(() => describeCron(parts), [cron]);
  const nextRuns = useMemo(() => getNextRuns(parts), [cron]);

  const applyPreset = (preset: string) => {
    const p = preset.split(" ");
    setMinute(p[0]); setHour(p[1]); setDom(p[2]); setMonth(p[3]); setDow(p[4]);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Cron Expression Builder" description="Build cron schedules visually with presets and next run preview" />

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Quick Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <Badge key={p.cron} variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => applyPreset(p.cron)}>
              {p.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-4">
        {[
          { label: "Minute", value: minute, set: setMinute, placeholder: "0-59, */5" },
          { label: "Hour", value: hour, set: setHour, placeholder: "0-23, */2" },
          { label: "Day (month)", value: dom, set: setDom, placeholder: "1-31" },
          { label: "Month", value: month, set: setMonth, placeholder: "1-12" },
          { label: "Day (week)", value: dow, set: setDow, placeholder: "0-6, 1-5" },
        ].map(f => (
          <div key={f.label}>
            <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
            <Input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className="font-mono text-sm text-center" />
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-4 mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <code className="text-lg font-mono font-bold text-primary">{cron}</code>
          <CopyButton text={cron} />
        </div>
        <p className="text-sm text-foreground">{description}</p>
      </div>

      {nextRuns.length > 0 && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold text-muted-foreground">Next {nextRuns.length} Runs</h3>
          </div>
          <div className="space-y-1">
            {nextRuns.map((r, i) => (
              <p key={i} className="text-sm font-mono text-foreground">{r}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
