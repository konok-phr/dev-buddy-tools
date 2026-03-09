import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");

  const result = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    if (isNaN(birth.getTime())) return null;
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const daysUntilBday = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000);
    return { years, months, days, totalDays, totalWeeks, totalMonths, daysUntilBday };
  }, [dob]);

  const items = result ? [
    ["Age", `${result.years} years, ${result.months} months, ${result.days} days`],
    ["Total Days", result.totalDays.toLocaleString()],
    ["Total Weeks", result.totalWeeks.toLocaleString()],
    ["Total Months", result.totalMonths],
    ["Days Until Next Birthday", result.daysUntilBday],
  ] : [];

  return (
    <div className="max-w-xl mx-auto">
      <ToolHeader title="Age Calculator" description="Calculate exact age from date of birth" />
      <div className="mb-4"><Label className="text-sm">Date of Birth</Label><Input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-48" /></div>
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map(([label, val]) => (
            <div key={String(label)} className="border rounded-md p-3 flex justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-semibold text-foreground">{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
