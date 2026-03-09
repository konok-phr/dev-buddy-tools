import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, Minus } from "lucide-react";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getWeekNumber(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}

export default function DateCalculator() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("30");
  const [unit, setUnit] = useState("days");
  const [date1, setDate1] = useState(new Date().toISOString().split("T")[0]);
  const [date2, setDate2] = useState(new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0]);

  const baseDate = new Date(date + "T00:00:00");
  const n = parseInt(amount) || 0;
  const addResult = unit === "days" ? addDays(baseDate, n) : unit === "months" ? addMonths(baseDate, n) : addYears(baseDate, n);
  const subResult = unit === "days" ? addDays(baseDate, -n) : unit === "months" ? addMonths(baseDate, -n) : addYears(baseDate, -n);

  const d1 = new Date(date1 + "T00:00:00");
  const d2 = new Date(date2 + "T00:00:00");
  const diff = daysBetween(d1, d2);
  const diffWeeks = Math.floor(Math.abs(diff) / 7);
  const diffMonths = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());

  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  const daysLeft = daysBetween(today, endOfYear);

  return (
    <div className="max-w-xl mx-auto">
      <ToolHeader title="Date Calculator" description="Add/subtract days, calculate date differences and more" />
      <div className="space-y-6">
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Add / Subtract from Date</h3>
          <div className="flex gap-2 items-end flex-wrap">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="font-mono w-[160px]" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
              <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="font-mono w-[80px]" />
            </div>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Plus className="h-3 w-3" />Added</p>
              <p className="text-sm font-medium text-foreground">{formatDate(addResult)}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Minus className="h-3 w-3" />Subtracted</p>
              <p className="text-sm font-medium text-foreground">{formatDate(subResult)}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Date Difference</h3>
          <div className="flex gap-2 items-end flex-wrap">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">From</label>
              <Input type="date" value={date1} onChange={e => setDate1(e.target.value)} className="font-mono w-[160px]" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">To</label>
              <Input type="date" value={date2} onChange={e => setDate2(e.target.value)} className="font-mono w-[160px]" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="font-mono">{Math.abs(diff)} days</Badge>
            <Badge variant="secondary" className="font-mono">{diffWeeks} weeks {Math.abs(diff) % 7} days</Badge>
            <Badge variant="secondary" className="font-mono">~{Math.abs(diffMonths)} months</Badge>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Quick Info</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="font-medium text-foreground">{formatDate(today)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Week Number</p>
              <p className="font-medium text-foreground">Week {getWeekNumber(today)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Day of Year</p>
              <p className="font-medium text-foreground">{daysBetween(new Date(today.getFullYear(), 0, 1), today) + 1} / {today.getFullYear() % 4 === 0 ? 366 : 365}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Days Left This Year</p>
              <p className="font-medium text-foreground">{daysLeft} days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
