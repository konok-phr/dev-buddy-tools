import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface Entry { loc: string; changefreq: string; priority: string; }

export default function SitemapGeneratorPage() {
  const [baseUrl, setBaseUrl] = useState("https://example.com");
  const [entries, setEntries] = useState<Entry[]>([
    { loc: "/", changefreq: "weekly", priority: "1.0" },
    { loc: "/about", changefreq: "monthly", priority: "0.8" },
  ]);

  const addEntry = () => setEntries([...entries, { loc: "/new-page", changefreq: "monthly", priority: "0.5" }]);
  const removeEntry = (i: number) => setEntries(entries.filter((_, idx) => idx !== i));
  const updateEntry = (i: number, field: keyof Entry, value: string) => {
    const copy = [...entries];
    copy[i] = { ...copy[i], [field]: value };
    setEntries(copy);
  };

  const bulkAdd = (text: string) => {
    const paths = text.split("\n").map(s => s.trim()).filter(Boolean);
    setEntries([...entries, ...paths.map(loc => ({ loc, changefreq: "monthly", priority: "0.5" }))]);
  };

  const [bulkText, setBulkText] = useState("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(e =>
    `  <url>\n    <loc>${baseUrl}${e.loc}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
  ).join("\n")}\n</urlset>`;

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Sitemap Generator" description="Generate XML sitemaps for SEO" />
      <div className="space-y-4">
        <div>
          <Label>Base URL</Label>
          <Input value={baseUrl} onChange={e => setBaseUrl(e.target.value)} className="mt-1" />
        </div>

        {entries.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input value={entry.loc} onChange={e => updateEntry(i, "loc", e.target.value)} className="flex-1" placeholder="/path" />
            <Select value={entry.changefreq} onValueChange={v => updateEntry(i, "changefreq", v)}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map(f => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input value={entry.priority} onChange={e => updateEntry(i, "priority", e.target.value)} className="w-20" />
            <Button variant="ghost" size="sm" onClick={() => removeEntry(i)}><Trash2 className="h-3 w-3" /></Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Button variant="outline" onClick={addEntry}>+ Add URL</Button>
        </div>

        <div>
          <Label>Bulk Add Paths (one per line)</Label>
          <div className="flex gap-2 mt-1">
            <Textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={3} placeholder="/page1&#10;/page2&#10;/page3" className="flex-1" />
            <Button variant="outline" onClick={() => { bulkAdd(bulkText); setBulkText(""); }}>Add</Button>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Label>Generated sitemap.xml</Label>
            <CopyButton text={xml} />
          </div>
          <pre className="text-xs text-foreground whitespace-pre-wrap font-mono max-h-80 overflow-auto">{xml}</pre>
        </div>
      </div>
    </div>
  );
}
