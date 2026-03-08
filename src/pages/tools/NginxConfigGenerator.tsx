import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RotateCcw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UpstreamServer {
  address: string;
  weight: number;
}

interface LocationBlock {
  path: string;
  proxyPass: string;
  customDirectives: string;
}

export default function NginxConfigGenerator() {
  const [serverName, setServerName] = useState("example.com");
  const [listenPort, setListenPort] = useState("80");
  const [enableSSL, setEnableSSL] = useState(false);
  const [sslCert, setSslCert] = useState("/etc/letsencrypt/live/example.com/fullchain.pem");
  const [sslKey, setSslKey] = useState("/etc/letsencrypt/live/example.com/privkey.pem");
  const [enableGzip, setEnableGzip] = useState(true);
  const [enableRateLimit, setEnableRateLimit] = useState(false);
  const [rateLimitReqs, setRateLimitReqs] = useState("10");
  const [enableCors, setEnableCors] = useState(false);
  const [corsOrigin, setCorsOrigin] = useState("*");
  const [enableCaching, setEnableCaching] = useState(false);
  const [cacheExpiry, setCacheExpiry] = useState("1d");
  const [enableWwwRedirect, setEnableWwwRedirect] = useState(false);
  const [redirectDirection, setRedirectDirection] = useState<"www-to-non" | "non-to-www">("www-to-non");
  const [enableLoadBalancing, setEnableLoadBalancing] = useState(false);
  const [lbMethod, setLbMethod] = useState("round_robin");
  const [upstreamServers, setUpstreamServers] = useState<UpstreamServer[]>([
    { address: "127.0.0.1:3000", weight: 1 },
    { address: "127.0.0.1:3001", weight: 1 },
  ]);
  const [locations, setLocations] = useState<LocationBlock[]>([
    { path: "/", proxyPass: "http://localhost:3000", customDirectives: "" },
  ]);
  const [rootDir, setRootDir] = useState("/var/www/html");
  const [serverType, setServerType] = useState<"reverse-proxy" | "static">("reverse-proxy");
  const [enableSecurityHeaders, setEnableSecurityHeaders] = useState(true);
  const [enableLogging, setEnableLogging] = useState(true);
  const [clientMaxBody, setClientMaxBody] = useState("10m");

  const generateConfig = () => {
    const lines: string[] = [];

    // Rate limiting zone
    if (enableRateLimit) {
      lines.push(`limit_req_zone $binary_remote_addr zone=ratelimit:10m rate=${rateLimitReqs}r/s;`);
      lines.push("");
    }

    // Upstream block for load balancing
    if (enableLoadBalancing) {
      lines.push("upstream backend {");
      if (lbMethod === "least_conn") lines.push("    least_conn;");
      if (lbMethod === "ip_hash") lines.push("    ip_hash;");
      upstreamServers.forEach(s => {
        lines.push(`    server ${s.address}${s.weight !== 1 ? ` weight=${s.weight}` : ""};`);
      });
      lines.push("}");
      lines.push("");
    }

    // WWW redirect server block
    if (enableWwwRedirect) {
      lines.push("server {");
      lines.push(`    listen ${enableSSL ? "443 ssl" : "80"};`);
      if (redirectDirection === "www-to-non") {
        lines.push(`    server_name www.${serverName};`);
        lines.push(`    return 301 $scheme://${serverName}$request_uri;`);
      } else {
        lines.push(`    server_name ${serverName};`);
        lines.push(`    return 301 $scheme://www.${serverName}$request_uri;`);
      }
      lines.push("}");
      lines.push("");
    }

    // HTTP to HTTPS redirect
    if (enableSSL) {
      lines.push("server {");
      lines.push("    listen 80;");
      lines.push(`    server_name ${serverName};`);
      lines.push(`    return 301 https://$host$request_uri;`);
      lines.push("}");
      lines.push("");
    }

    // Main server block
    lines.push("server {");
    if (enableSSL) {
      lines.push("    listen 443 ssl http2;");
      lines.push(`    server_name ${serverName};`);
      lines.push("");
      lines.push(`    ssl_certificate ${sslCert};`);
      lines.push(`    ssl_certificate_key ${sslKey};`);
      lines.push("    ssl_protocols TLSv1.2 TLSv1.3;");
      lines.push("    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;");
      lines.push("    ssl_prefer_server_ciphers off;");
      lines.push("    ssl_session_cache shared:SSL:10m;");
      lines.push("    ssl_session_timeout 1d;");
    } else {
      lines.push(`    listen ${listenPort};`);
      lines.push(`    server_name ${serverName};`);
    }
    lines.push("");

    // Client body size
    lines.push(`    client_max_body_size ${clientMaxBody};`);
    lines.push("");

    // Security headers
    if (enableSecurityHeaders) {
      lines.push("    # Security Headers");
      lines.push("    add_header X-Frame-Options \"SAMEORIGIN\" always;");
      lines.push("    add_header X-Content-Type-Options \"nosniff\" always;");
      lines.push("    add_header X-XSS-Protection \"1; mode=block\" always;");
      lines.push("    add_header Referrer-Policy \"no-referrer-when-downgrade\" always;");
      if (enableSSL) {
        lines.push("    add_header Strict-Transport-Security \"max-age=63072000; includeSubDomains; preload\" always;");
      }
      lines.push("");
    }

    // CORS
    if (enableCors) {
      lines.push("    # CORS");
      lines.push(`    add_header Access-Control-Allow-Origin "${corsOrigin}" always;`);
      lines.push("    add_header Access-Control-Allow-Methods \"GET, POST, PUT, DELETE, OPTIONS\" always;");
      lines.push("    add_header Access-Control-Allow-Headers \"Authorization, Content-Type, Accept\" always;");
      lines.push("");
    }

    // Gzip
    if (enableGzip) {
      lines.push("    # Gzip Compression");
      lines.push("    gzip on;");
      lines.push("    gzip_vary on;");
      lines.push("    gzip_proxied any;");
      lines.push("    gzip_comp_level 6;");
      lines.push("    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;");
      lines.push("");
    }

    // Logging
    if (enableLogging) {
      lines.push("    access_log /var/log/nginx/access.log;");
      lines.push("    error_log /var/log/nginx/error.log;");
      lines.push("");
    }

    // Rate limiting
    if (enableRateLimit) {
      lines.push("    limit_req zone=ratelimit burst=20 nodelay;");
      lines.push("");
    }

    // Static site
    if (serverType === "static") {
      lines.push(`    root ${rootDir};`);
      lines.push("    index index.html index.htm;");
      lines.push("");
      lines.push("    location / {");
      lines.push("        try_files $uri $uri/ /index.html;");
      lines.push("    }");
      lines.push("");
      if (enableCaching) {
        lines.push("    # Static Asset Caching");
        lines.push("    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {");
        lines.push(`        expires ${cacheExpiry};`);
        lines.push("        add_header Cache-Control \"public, immutable\";");
        lines.push("    }");
        lines.push("");
      }
    }

    // Reverse proxy locations
    if (serverType === "reverse-proxy") {
      locations.forEach(loc => {
        lines.push(`    location ${loc.path} {`);
        const target = enableLoadBalancing ? "http://backend" : loc.proxyPass;
        lines.push(`        proxy_pass ${target};`);
        lines.push("        proxy_http_version 1.1;");
        lines.push("        proxy_set_header Upgrade $http_upgrade;");
        lines.push("        proxy_set_header Connection \"upgrade\";");
        lines.push("        proxy_set_header Host $host;");
        lines.push("        proxy_set_header X-Real-IP $remote_addr;");
        lines.push("        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;");
        lines.push("        proxy_set_header X-Forwarded-Proto $scheme;");
        if (loc.customDirectives.trim()) {
          loc.customDirectives.split("\n").forEach(d => {
            if (d.trim()) lines.push(`        ${d.trim()}`);
          });
        }
        lines.push("    }");
        lines.push("");
      });

      if (enableCaching) {
        lines.push("    # Static Asset Caching");
        lines.push("    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {");
        lines.push(`        expires ${cacheExpiry};`);
        lines.push("        add_header Cache-Control \"public, immutable\";");
        lines.push("    }");
        lines.push("");
      }
    }

    lines.push("}");
    return lines.join("\n");
  };

  const config = generateConfig();

  const addLocation = () => setLocations([...locations, { path: "/api", proxyPass: "http://localhost:3001", customDirectives: "" }]);
  const removeLocation = (i: number) => setLocations(locations.filter((_, idx) => idx !== i));
  const updateLocation = (i: number, field: keyof LocationBlock, val: string) => {
    const updated = [...locations];
    updated[i] = { ...updated[i], [field]: val };
    setLocations(updated);
  };

  const addUpstream = () => setUpstreamServers([...upstreamServers, { address: "127.0.0.1:3002", weight: 1 }]);
  const removeUpstream = (i: number) => setUpstreamServers(upstreamServers.filter((_, idx) => idx !== i));

  const resetAll = () => {
    setServerName("example.com"); setListenPort("80"); setEnableSSL(false);
    setEnableGzip(true); setEnableRateLimit(false); setEnableCors(false);
    setEnableCaching(false); setEnableWwwRedirect(false); setEnableLoadBalancing(false);
    setEnableSecurityHeaders(true); setEnableLogging(true); setClientMaxBody("10m");
    setServerType("reverse-proxy"); setLocations([{ path: "/", proxyPass: "http://localhost:3000", customDirectives: "" }]);
    setUpstreamServers([{ address: "127.0.0.1:3000", weight: 1 }, { address: "127.0.0.1:3001", weight: 1 }]);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader title="Nginx Config Generator" description="Build production-ready Nginx configurations visually" />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Settings */}
        <div className="space-y-4 p-4 rounded-lg border border-border bg-card overflow-y-auto max-h-[80vh]">
          <h3 className="text-sm font-semibold text-foreground">Server Settings</h3>

          <div>
            <Label className="text-xs text-muted-foreground">Server Type</Label>
            <Select value={serverType} onValueChange={v => setServerType(v as any)}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="reverse-proxy">Reverse Proxy</SelectItem>
                <SelectItem value="static">Static Site</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Server Name</Label>
            <Input value={serverName} onChange={e => setServerName(e.target.value)} className="mt-1 h-8 text-xs" />
          </div>

          {!enableSSL && (
            <div>
              <Label className="text-xs text-muted-foreground">Listen Port</Label>
              <Input value={listenPort} onChange={e => setListenPort(e.target.value)} className="mt-1 h-8 text-xs" />
            </div>
          )}

          <div>
            <Label className="text-xs text-muted-foreground">Client Max Body Size</Label>
            <Input value={clientMaxBody} onChange={e => setClientMaxBody(e.target.value)} className="mt-1 h-8 text-xs" />
          </div>

          {serverType === "static" && (
            <div>
              <Label className="text-xs text-muted-foreground">Root Directory</Label>
              <Input value={rootDir} onChange={e => setRootDir(e.target.value)} className="mt-1 h-8 text-xs" />
            </div>
          )}

          {/* Toggles */}
          <div className="pt-2 border-t border-border space-y-3">
            <h4 className="text-xs font-semibold text-foreground">Features</h4>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">SSL / HTTPS</Label>
              <Switch checked={enableSSL} onCheckedChange={setEnableSSL} />
            </div>

            {enableSSL && (
              <div className="space-y-2 pl-2 border-l-2 border-primary/20">
                <Input value={sslCert} onChange={e => setSslCert(e.target.value)} className="h-7 text-xs" placeholder="SSL Certificate path" />
                <Input value={sslKey} onChange={e => setSslKey(e.target.value)} className="h-7 text-xs" placeholder="SSL Key path" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Gzip Compression</Label>
              <Switch checked={enableGzip} onCheckedChange={setEnableGzip} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Security Headers</Label>
              <Switch checked={enableSecurityHeaders} onCheckedChange={setEnableSecurityHeaders} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Access Logging</Label>
              <Switch checked={enableLogging} onCheckedChange={setEnableLogging} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Rate Limiting</Label>
              <Switch checked={enableRateLimit} onCheckedChange={setEnableRateLimit} />
            </div>
            {enableRateLimit && (
              <Input value={rateLimitReqs} onChange={e => setRateLimitReqs(e.target.value)} className="h-7 text-xs pl-2" placeholder="Requests/sec" />
            )}

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">CORS Headers</Label>
              <Switch checked={enableCors} onCheckedChange={setEnableCors} />
            </div>
            {enableCors && (
              <Input value={corsOrigin} onChange={e => setCorsOrigin(e.target.value)} className="h-7 text-xs" placeholder="Allow Origin" />
            )}

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Static Caching</Label>
              <Switch checked={enableCaching} onCheckedChange={setEnableCaching} />
            </div>
            {enableCaching && (
              <Select value={cacheExpiry} onValueChange={setCacheExpiry}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">WWW Redirect</Label>
              <Switch checked={enableWwwRedirect} onCheckedChange={setEnableWwwRedirect} />
            </div>
            {enableWwwRedirect && (
              <Select value={redirectDirection} onValueChange={v => setRedirectDirection(v as any)}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="www-to-non">www → non-www</SelectItem>
                  <SelectItem value="non-to-www">non-www → www</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Load Balancing */}
          {serverType === "reverse-proxy" && (
            <div className="pt-2 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Load Balancing</Label>
                <Switch checked={enableLoadBalancing} onCheckedChange={setEnableLoadBalancing} />
              </div>
              {enableLoadBalancing && (
                <>
                  <Select value={lbMethod} onValueChange={setLbMethod}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round_robin">Round Robin</SelectItem>
                      <SelectItem value="least_conn">Least Connections</SelectItem>
                      <SelectItem value="ip_hash">IP Hash</SelectItem>
                    </SelectContent>
                  </Select>
                  {upstreamServers.map((s, i) => (
                    <div key={i} className="flex gap-1 items-center">
                      <Input value={s.address} onChange={e => { const u = [...upstreamServers]; u[i] = { ...u[i], address: e.target.value }; setUpstreamServers(u); }} className="h-7 text-xs flex-1" />
                      <Input type="number" value={s.weight} onChange={e => { const u = [...upstreamServers]; u[i] = { ...u[i], weight: +e.target.value }; setUpstreamServers(u); }} className="h-7 text-xs w-14" />
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => removeUpstream(i)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="text-xs w-full h-7" onClick={addUpstream}><Plus className="h-3 w-3 mr-1" />Add Server</Button>
                </>
              )}
            </div>
          )}

          {/* Location blocks */}
          {serverType === "reverse-proxy" && (
            <div className="pt-2 border-t border-border space-y-3">
              <h4 className="text-xs font-semibold text-foreground">Location Blocks</h4>
              {locations.map((loc, i) => (
                <div key={i} className="space-y-1 p-2 rounded border border-border bg-muted/30">
                  <div className="flex gap-1">
                    <Input value={loc.path} onChange={e => updateLocation(i, "path", e.target.value)} className="h-7 text-xs" placeholder="Path" />
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => removeLocation(i)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                  {!enableLoadBalancing && (
                    <Input value={loc.proxyPass} onChange={e => updateLocation(i, "proxyPass", e.target.value)} className="h-7 text-xs" placeholder="proxy_pass" />
                  )}
                </div>
              ))}
              <Button size="sm" variant="outline" className="text-xs w-full h-7" onClick={addLocation}><Plus className="h-3 w-3 mr-1" />Add Location</Button>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={() => { navigator.clipboard.writeText(config); toast.success("Copied!"); }} size="sm" className="flex-1 text-xs">
              <Copy className="h-3.5 w-3.5 mr-1" /> Copy Config
            </Button>
            <Button onClick={resetAll} size="sm" variant="ghost" className="text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="p-2 border-b border-border bg-muted/50 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">nginx.conf</span>
            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => { navigator.clipboard.writeText(config); toast.success("Copied!"); }}>
              <Copy className="h-3 w-3 mr-1" />Copy
            </Button>
          </div>
          <pre className="p-4 overflow-auto text-xs font-mono bg-muted/20 text-foreground max-h-[75vh] leading-relaxed whitespace-pre">
            {config}
          </pre>
        </div>
      </div>
    </div>
  );
}
