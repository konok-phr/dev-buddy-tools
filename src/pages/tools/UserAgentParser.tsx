import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function parseUA(ua: string) {
  const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera|MSIE|Trident)[\s/]?([\d.]+)?/i);
  const os = ua.match(/(Windows NT [\d.]+|Mac OS X [\d._]+|Linux|Android [\d.]+|iPhone OS [\d_]+|iPad)/i);
  const mobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  const bot = /bot|crawl|spider|slurp|googlebot|bingbot/i.test(ua);
  return {
    browser: browser ? `${browser[1]} ${browser[2] || ""}`.trim() : "Unknown",
    os: os ? os[1].replace(/_/g, ".") : "Unknown",
    mobile, bot,
    engine: ua.match(/AppleWebKit|Gecko|Trident|Blink/i)?.[0] || "Unknown",
  };
}

export default function UserAgentParser() {
  const [ua, setUa] = useState(navigator.userAgent);
  const parsed = useMemo(() => parseUA(ua), [ua]);

  const items = [
    ["Browser", parsed.browser],
    ["Operating System", parsed.os],
    ["Engine", parsed.engine],
    ["Mobile", parsed.mobile ? "Yes" : "No"],
    ["Bot", parsed.bot ? "Yes" : "No"],
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="User Agent Parser" description="Parse and analyze browser user agent strings" />
      <Textarea value={ua} onChange={e => setUa(e.target.value)} className="font-mono text-sm h-20 mb-2" />
      <Button variant="outline" size="sm" onClick={() => setUa(navigator.userAgent)} className="mb-4">Use Current Browser</Button>
      <div className="space-y-2">
        {items.map(([label, val]) => (
          <div key={String(label)} className="border rounded-md p-3 flex justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-semibold text-foreground">{val}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-end"><CopyButton text={JSON.stringify(parsed, null, 2)} /></div>
    </div>
  );
}
