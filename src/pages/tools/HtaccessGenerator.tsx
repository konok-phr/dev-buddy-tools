import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function HtaccessGenerator() {
  const [forceHttps, setForceHttps] = useState(true);
  const [wwwRedirect, setWwwRedirect] = useState<"none" | "add" | "remove">("remove");
  const [gzip, setGzip] = useState(true);
  const [caching, setCaching] = useState(true);
  const [blockHotlinking, setBlockHotlinking] = useState(false);
  const [customErrors, setCustomErrors] = useState([{ code: "404", page: "/404.html" }]);
  const [redirects, setRedirects] = useState([{ from: "/old-page", to: "/new-page", status: "301" }]);

  const addError = () => setCustomErrors([...customErrors, { code: "", page: "" }]);
  const addRedirect = () => setRedirects([...redirects, { from: "", to: "", status: "301" }]);

  let lines: string[] = [];

  if (forceHttps) {
    lines.push("# Force HTTPS", "RewriteEngine On", "RewriteCond %{HTTPS} off", "RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]", "");
  }

  if (wwwRedirect === "remove") {
    lines.push("# Remove www", "RewriteEngine On", "RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]", "RewriteRule ^(.*)$ https://%1/$1 [R=301,L]", "");
  } else if (wwwRedirect === "add") {
    lines.push("# Add www", "RewriteEngine On", "RewriteCond %{HTTP_HOST} !^www\\. [NC]", "RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]", "");
  }

  if (gzip) {
    lines.push("# Enable Gzip Compression", "<IfModule mod_deflate.c>", "  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml", "</IfModule>", "");
  }

  if (caching) {
    lines.push("# Browser Caching", "<IfModule mod_expires.c>", "  ExpiresActive On", "  ExpiresByType image/jpeg \"access plus 1 year\"", "  ExpiresByType image/png \"access plus 1 year\"", "  ExpiresByType text/css \"access plus 1 month\"", "  ExpiresByType application/javascript \"access plus 1 month\"", "</IfModule>", "");
  }

  if (blockHotlinking) {
    lines.push("# Block Hotlinking", "RewriteEngine On", "RewriteCond %{HTTP_REFERER} !^$", "RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?yourdomain\\.com [NC]", "RewriteRule \\.(jpg|jpeg|png|gif|svg)$ - [F]", "");
  }

  customErrors.filter(e => e.code && e.page).forEach(e => {
    lines.push(`ErrorDocument ${e.code} ${e.page}`);
  });
  if (customErrors.some(e => e.code)) lines.push("");

  redirects.filter(r => r.from && r.to).forEach(r => {
    lines.push(`Redirect ${r.status} ${r.from} ${r.to}`);
  });

  const output = lines.join("\n");

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title=".htaccess Generator" description="Generate Apache .htaccess configuration files" />
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2"><Checkbox checked={forceHttps} onCheckedChange={v => setForceHttps(!!v)} id="https" /><Label htmlFor="https">Force HTTPS</Label></div>
          <div className="flex items-center gap-2"><Checkbox checked={gzip} onCheckedChange={v => setGzip(!!v)} id="gzip" /><Label htmlFor="gzip">Gzip Compression</Label></div>
          <div className="flex items-center gap-2"><Checkbox checked={caching} onCheckedChange={v => setCaching(!!v)} id="cache" /><Label htmlFor="cache">Browser Caching</Label></div>
          <div className="flex items-center gap-2"><Checkbox checked={blockHotlinking} onCheckedChange={v => setBlockHotlinking(!!v)} id="hotlink" /><Label htmlFor="hotlink">Block Hotlinking</Label></div>
        </div>

        <div>
          <Label>WWW Redirect</Label>
          <div className="flex gap-2 mt-1">
            {(["none", "add", "remove"] as const).map(v => (
              <button key={v} onClick={() => setWwwRedirect(v)} className={`px-3 py-1 rounded text-sm border ${wwwRedirect === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {v === "none" ? "None" : v === "add" ? "Add www" : "Remove www"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Custom Error Pages</Label>
          {customErrors.map((e, i) => (
            <div key={i} className="flex gap-2 mt-1">
              <Input value={e.code} onChange={ev => { const c = [...customErrors]; c[i].code = ev.target.value; setCustomErrors(c); }} placeholder="404" className="w-20" />
              <Input value={e.page} onChange={ev => { const c = [...customErrors]; c[i].page = ev.target.value; setCustomErrors(c); }} placeholder="/404.html" className="flex-1" />
              <Button variant="ghost" size="sm" onClick={() => setCustomErrors(customErrors.filter((_, idx) => idx !== i))}><Trash2 className="h-3 w-3" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addError} className="mt-1">+ Error Page</Button>
        </div>

        <div>
          <Label>Redirects</Label>
          {redirects.map((r, i) => (
            <div key={i} className="flex gap-2 mt-1">
              <Input value={r.status} onChange={ev => { const c = [...redirects]; c[i].status = ev.target.value; setRedirects(c); }} placeholder="301" className="w-16" />
              <Input value={r.from} onChange={ev => { const c = [...redirects]; c[i].from = ev.target.value; setRedirects(c); }} placeholder="/old" className="flex-1" />
              <Input value={r.to} onChange={ev => { const c = [...redirects]; c[i].to = ev.target.value; setRedirects(c); }} placeholder="/new" className="flex-1" />
              <Button variant="ghost" size="sm" onClick={() => setRedirects(redirects.filter((_, idx) => idx !== i))}><Trash2 className="h-3 w-3" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addRedirect} className="mt-1">+ Redirect</Button>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Label>Generated .htaccess</Label>
            <CopyButton text={output} />
          </div>
          <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">{output}</pre>
        </div>
      </div>
    </div>
  );
}
