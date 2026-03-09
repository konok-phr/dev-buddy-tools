import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";

export default function UrlParser() {
  const [url, setUrl] = useState("https://user:pass@example.com:8080/path/page?q=hello&lang=en#section");

  const parsed = useMemo(() => {
    try {
      const u = new URL(url);
      return [
        ["Protocol", u.protocol], ["Host", u.host], ["Hostname", u.hostname],
        ["Port", u.port || "(default)"], ["Pathname", u.pathname],
        ["Search", u.search], ["Hash", u.hash],
        ["Username", u.username || "(none)"], ["Password", u.password || "(none)"],
        ["Origin", u.origin],
        ...Array.from(u.searchParams.entries()).map(([k, v]) => [`Param: ${k}`, v]),
      ];
    } catch { return []; }
  }, [url]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="URL Parser" description="Parse and analyze URL components" />
      <Input value={url} onChange={e => setUrl(e.target.value)} className="font-mono text-sm mb-4" placeholder="https://example.com/path?key=value" />
      {parsed.length > 0 ? (
        <div className="space-y-1.5">
          {parsed.map(([label, val], i) => (
            <div key={i} className="border rounded-md p-2.5 flex justify-between items-center gap-2">
              <span className="text-xs text-muted-foreground shrink-0">{label}</span>
              <div className="flex items-center gap-1 min-w-0">
                <span className="font-mono text-sm text-foreground truncate">{val}</span>
                <CopyButton text={String(val)} />
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-sm text-destructive">Invalid URL</p>}
    </div>
  );
}
