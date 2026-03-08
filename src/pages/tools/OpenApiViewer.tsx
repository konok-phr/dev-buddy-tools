import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SAMPLE = `{
  "openapi": "3.0.0",
  "info": { "title": "Pet Store", "version": "1.0.0" },
  "paths": {
    "/pets": {
      "get": { "summary": "List pets", "parameters": [{ "name": "limit", "in": "query", "schema": { "type": "integer" } }], "responses": { "200": { "description": "OK" } } },
      "post": { "summary": "Create pet", "requestBody": { "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Pet" } } } }, "responses": { "201": { "description": "Created" } } }
    },
    "/pets/{id}": {
      "get": { "summary": "Get pet by ID", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "OK" } } },
      "delete": { "summary": "Delete pet", "responses": { "204": { "description": "Deleted" } } }
    }
  },
  "components": { "schemas": { "Pet": { "type": "object", "properties": { "id": { "type": "string" }, "name": { "type": "string" }, "tag": { "type": "string" } } } } }
}`;

const METHOD_COLORS: Record<string, string> = {
  get: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  post: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  put: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  patch: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  delete: "bg-red-500/15 text-red-700 dark:text-red-400",
};

export default function OpenApiViewer() {
  const [raw, setRaw] = useState(SAMPLE);
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState("");

  const fetchSpec = async () => {
    if (!url) return;
    setFetching(true);
    try {
      const res = await fetch(url);
      const text = await res.text();
      setRaw(text);
    } catch {
      setRaw(`// Failed to fetch spec from ${url}`);
    } finally {
      setFetching(false);
    }
  };

  const spec = useMemo(() => {
    try { return JSON.parse(raw); } catch { return null; }
  }, [raw]);

  const endpoints = useMemo(() => {
    if (!spec?.paths) return [];
    const list: { method: string; path: string; summary: string; params: any[]; responses: Record<string, any> }[] = [];
    for (const [path, methods] of Object.entries(spec.paths as Record<string, any>)) {
      for (const [method, details] of Object.entries(methods as Record<string, any>)) {
        if (["get", "post", "put", "patch", "delete", "options", "head"].includes(method)) {
          list.push({ method, path, summary: details.summary || "", params: details.parameters || [], responses: details.responses || {} });
        }
      }
    }
    return list;
  }, [spec]);

  const filtered = endpoints.filter(
    (e) => !search || e.path.toLowerCase().includes(search.toLowerCase()) || e.summary.toLowerCase().includes(search.toLowerCase())
  );

  const schemas = spec?.components?.schemas ? Object.entries(spec.components.schemas as Record<string, any>) : [];

  return (
    <ToolPage toolId="openapi-viewer" title="OpenAPI / Swagger Viewer" description="Paste or fetch an OpenAPI spec and browse endpoints visually">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="https://petstore.swagger.io/v2/swagger.json" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1" />
          <Button onClick={fetchSpec} disabled={fetching || !url}>
            {fetching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
          </Button>
        </div>

        <Textarea className="font-mono text-xs min-h-[120px]" value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="Paste OpenAPI JSON spec here..." />

        {spec && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-semibold text-lg">{spec.info?.title || "API"}</h3>
              <Badge variant="outline">{spec.info?.version}</Badge>
              <Badge variant="secondary">{endpoints.length} endpoints</Badge>
            </div>

            <Input placeholder="Search endpoints..." value={search} onChange={(e) => setSearch(e.target.value)} />

            <div className="space-y-2">
              {filtered.map((ep, i) => (
                <div key={i} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${METHOD_COLORS[ep.method] || "bg-muted"}`}>
                      {ep.method}
                    </span>
                    <code className="text-sm font-mono">{ep.path}</code>
                    {ep.summary && <span className="text-xs text-muted-foreground">— {ep.summary}</span>}
                  </div>
                  {ep.params.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {ep.params.map((p: any, j: number) => (
                        <Badge key={j} variant="outline" className="text-xs">
                          {p.name} <span className="text-muted-foreground ml-1">({p.in})</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-1 flex-wrap">
                    {Object.entries(ep.responses).map(([code, desc]: [string, any]) => (
                      <Badge key={code} variant="secondary" className="text-xs">
                        {code}: {typeof desc === "string" ? desc : desc.description || ""}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {schemas.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Schemas</h4>
                {schemas.map(([name, schema]: [string, any]) => (
                  <div key={name} className="border border-border rounded-lg p-3">
                    <div className="font-mono text-sm font-semibold mb-1">{name}</div>
                    {schema.properties && (
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(schema.properties).map(([prop, def]: [string, any]) => (
                          <Badge key={prop} variant="outline" className="text-xs">
                            {prop}: {def.type || "$ref"}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!spec && raw.trim() && <p className="text-sm text-destructive">Invalid JSON — paste a valid OpenAPI spec.</p>}
      </div>
    </ToolPage>
  );
}
