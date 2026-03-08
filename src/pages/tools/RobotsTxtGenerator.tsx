import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

interface Rule { userAgent: string; allow: string[]; disallow: string[]; }

export default function RobotsTxtGenerator() {
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");
  const [rules, setRules] = useState<Rule[]>([{ userAgent: "*", allow: ["/"], disallow: ["/admin/", "/private/"] }]);
  const [crawlDelay, setCrawlDelay] = useState("");
  const [noIndex, setNoIndex] = useState(false);

  const addRule = () => setRules([...rules, { userAgent: "*", allow: [], disallow: [] }]);
  const removeRule = (i: number) => setRules(rules.filter((_, idx) => idx !== i));
  const updateRule = (i: number, field: keyof Rule, value: any) => {
    const copy = [...rules];
    copy[i] = { ...copy[i], [field]: value };
    setRules(copy);
  };

  const output = rules.map(r => {
    let lines = [`User-agent: ${r.userAgent}`];
    if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`);
    r.disallow.filter(Boolean).forEach(d => lines.push(`Disallow: ${d}`));
    r.allow.filter(Boolean).forEach(a => lines.push(`Allow: ${a}`));
    if (noIndex) lines.push("Noindex: /");
    return lines.join("\n");
  }).join("\n\n") + (sitemapUrl ? `\n\nSitemap: ${sitemapUrl}` : "");

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Robots.txt Generator" description="Generate robots.txt files for search engine crawlers" />
      <div className="space-y-4">
        <div>
          <Label>Sitemap URL</Label>
          <Input value={sitemapUrl} onChange={e => setSitemapUrl(e.target.value)} className="mt-1" />
        </div>
        <div className="flex items-center gap-4">
          <div>
            <Label>Crawl Delay (seconds)</Label>
            <Input value={crawlDelay} onChange={e => setCrawlDelay(e.target.value)} placeholder="e.g. 10" className="mt-1 w-32" />
          </div>
          <div className="flex items-center gap-2 mt-5">
            <Checkbox checked={noIndex} onCheckedChange={v => setNoIndex(!!v)} id="noindex" />
            <Label htmlFor="noindex">Add Noindex</Label>
          </div>
        </div>

        {rules.map((rule, i) => (
          <div key={i} className="border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Label>User-agent</Label>
              {rules.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeRule(i)}><Trash2 className="h-3 w-3" /></Button>}
            </div>
            <Input value={rule.userAgent} onChange={e => updateRule(i, "userAgent", e.target.value)} />
            <Label>Disallow paths (comma-separated)</Label>
            <Input value={rule.disallow.join(", ")} onChange={e => updateRule(i, "disallow", e.target.value.split(",").map(s => s.trim()))} />
            <Label>Allow paths (comma-separated)</Label>
            <Input value={rule.allow.join(", ")} onChange={e => updateRule(i, "allow", e.target.value.split(",").map(s => s.trim()))} />
          </div>
        ))}
        <Button variant="outline" onClick={addRule}>+ Add Rule</Button>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Label>Generated robots.txt</Label>
            <CopyButton text={output} />
          </div>
          <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">{output}</pre>
        </div>
      </div>
    </div>
  );
}
