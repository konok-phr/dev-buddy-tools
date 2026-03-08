import { useState, useEffect } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TimestampConverter() {
  const [unix, setUnix] = useState("");
  const [human, setHuman] = useState("");
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const i = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(i);
  }, []);

  const toHuman = () => {
    const ts = parseInt(unix);
    if (isNaN(ts)) return;
    const d = new Date(ts > 1e12 ? ts : ts * 1000);
    setHuman(d.toISOString());
  };

  const toUnix = () => {
    const d = new Date(human);
    if (isNaN(d.getTime())) return;
    setUnix(Math.floor(d.getTime() / 1000).toString());
  };

  const formats = unix ? (() => {
    const ts = parseInt(unix);
    if (isNaN(ts)) return [];
    const d = new Date(ts > 1e12 ? ts : ts * 1000);
    return [
      { label: "ISO 8601", value: d.toISOString() },
      { label: "UTC String", value: d.toUTCString() },
      { label: "Local", value: d.toLocaleString() },
      { label: "Unix (s)", value: Math.floor(d.getTime() / 1000).toString() },
      { label: "Unix (ms)", value: d.getTime().toString() },
    ];
  })() : [];

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Timestamp Converter" description="Convert between Unix timestamps and human-readable dates" />
      <div className="bg-card border border-border rounded-lg p-4 mb-6 text-center">
        <p className="text-xs text-muted-foreground mb-1">Current Unix Timestamp</p>
        <p className="text-2xl font-mono text-primary">{now}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Unix Timestamp</label>
          <Input value={unix} onChange={e => setUnix(e.target.value)} placeholder="1700000000" className="font-mono bg-card" />
          <Button onClick={toHuman} size="sm" className="w-full">→ To Human</Button>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Date/Time</label>
          <Input value={human} onChange={e => setHuman(e.target.value)} placeholder="2024-01-01T00:00:00Z" className="font-mono bg-card" />
          <Button onClick={toUnix} size="sm" className="w-full">→ To Unix</Button>
        </div>
      </div>
      {formats.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">All Formats</h3>
          {formats.map(f => (
            <div key={f.label} className="flex items-center justify-between bg-card border border-border rounded-md px-3 py-2">
              <span className="text-xs text-muted-foreground">{f.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{f.value}</span>
                <CopyButton text={f.value} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
