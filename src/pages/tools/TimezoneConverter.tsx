import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Clock } from "lucide-react";

const TIMEZONES = [
  { id: "UTC", label: "UTC", offset: 0 },
  { id: "America/New_York", label: "New York (EST/EDT)", offset: -5 },
  { id: "America/Chicago", label: "Chicago (CST/CDT)", offset: -6 },
  { id: "America/Denver", label: "Denver (MST/MDT)", offset: -7 },
  { id: "America/Los_Angeles", label: "Los Angeles (PST/PDT)", offset: -8 },
  { id: "Europe/London", label: "London (GMT/BST)", offset: 0 },
  { id: "Europe/Paris", label: "Paris (CET/CEST)", offset: 1 },
  { id: "Europe/Berlin", label: "Berlin (CET/CEST)", offset: 1 },
  { id: "Europe/Moscow", label: "Moscow (MSK)", offset: 3 },
  { id: "Asia/Dubai", label: "Dubai (GST)", offset: 4 },
  { id: "Asia/Kolkata", label: "India (IST)", offset: 5.5 },
  { id: "Asia/Dhaka", label: "Dhaka (BST)", offset: 6 },
  { id: "Asia/Bangkok", label: "Bangkok (ICT)", offset: 7 },
  { id: "Asia/Shanghai", label: "China (CST)", offset: 8 },
  { id: "Asia/Tokyo", label: "Tokyo (JST)", offset: 9 },
  { id: "Australia/Sydney", label: "Sydney (AEST)", offset: 10 },
  { id: "Pacific/Auckland", label: "Auckland (NZST)", offset: 12 },
];

function formatInTimezone(date: Date, tz: string): string {
  try {
    return date.toLocaleString("en-US", { timeZone: tz, dateStyle: "full", timeStyle: "long" });
  } catch {
    return "Invalid timezone";
  }
}

export default function TimezoneConverter() {
  const [fromTz, setFromTz] = useState("UTC");
  const [toTz, setToTz] = useState("Asia/Dhaka");
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 16));

  const now = new Date();
  const inputDate = new Date(dateStr);

  const swap = () => { setFromTz(toTz); setToTz(fromTz); };

  return (
    <div className="max-w-xl mx-auto">
      <ToolHeader title="Timezone Converter" description="Convert time between different timezones worldwide" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Date & Time</label>
          <Input type="datetime-local" value={dateStr} onChange={e => setDateStr(e.target.value)} className="font-mono" />
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">From</label>
            <Select value={fromTz} onValueChange={setFromTz}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TIMEZONES.map(tz => <SelectItem key={tz.id} value={tz.id}>{tz.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="sm" onClick={swap} className="mb-0.5"><ArrowRightLeft className="h-4 w-4" /></Button>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">To</label>
            <Select value={toTz} onValueChange={setToTz}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TIMEZONES.map(tz => <SelectItem key={tz.id} value={tz.id}>{tz.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">From: {fromTz}</p>
            <p className="text-sm font-medium text-foreground">{formatInTimezone(inputDate, fromTz)}</p>
          </div>
          <div className="border rounded-lg p-4 bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">To: {toTz}</p>
            <p className="text-sm font-medium text-foreground">{formatInTimezone(inputDate, toTz)}</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Current Time Around the World</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TIMEZONES.filter((_, i) => i % 2 === 0).map(tz => (
              <div key={tz.id} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{tz.label}</span>
                <span className="text-xs font-mono text-foreground">
                  {now.toLocaleTimeString("en-US", { timeZone: tz.id, hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
