import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Check } from "lucide-react";

const EXAMPLE_QUERIES = [
  { label: "Introspection", query: `{\n  __schema {\n    types {\n      name\n    }\n  }\n}` },
  { label: "SpaceX Launches", query: `{\n  launchesPast(limit: 5) {\n    mission_name\n    launch_date_local\n    rocket {\n      rocket_name\n    }\n  }\n}` },
  { label: "Countries", query: `{\n  countries {\n    name\n    capital\n    currency\n  }\n}` },
];

const ENDPOINTS = [
  { label: "Countries API", url: "https://countries.trevorblades.com/graphql" },
  { label: "Custom", url: "" },
];

export default function GraphqlPlayground() {
  const [endpoint, setEndpoint] = useState(ENDPOINTS[0].url);
  const [query, setQuery] = useState(EXAMPLE_QUERIES[2].query);
  const [variables, setVariables] = useState("{}");
  const [headers, setHeaders] = useState("{}");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setLoading(true);
    setResponse("");
    setTime(null);
    const t0 = performance.now();
    try {
      let hdrs: Record<string, string> = {};
      try { hdrs = JSON.parse(headers); } catch {}
      let vars: Record<string, unknown> = {};
      try { vars = JSON.parse(variables); } catch {}

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...hdrs },
        body: JSON.stringify({ query, variables: vars }),
      });
      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
      setTime(Math.round(performance.now() - t0));
    } catch (e: any) {
      setResponse(`Error: ${e.message}`);
      setTime(Math.round(performance.now() - t0));
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolPage
      toolId="graphql-playground"
      title="GraphQL Playground"
      description="Send GraphQL queries to any endpoint and view responses"
    >
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {ENDPOINTS.map((ep) => (
            <Badge
              key={ep.label}
              variant={endpoint === ep.url ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => ep.url && setEndpoint(ep.url)}
            >
              {ep.label}
            </Badge>
          ))}
        </div>

        <Input
          placeholder="https://api.example.com/graphql"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          {EXAMPLE_QUERIES.map((eq) => (
            <Badge
              key={eq.label}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setQuery(eq.query)}
            >
              {eq.label}
            </Badge>
          ))}
        </div>

        <Textarea
          className="font-mono text-sm min-h-[160px]"
          placeholder="{ query }"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Variables (JSON)</label>
            <Textarea className="font-mono text-xs min-h-[60px]" value={variables} onChange={(e) => setVariables(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Headers (JSON)</label>
            <Textarea className="font-mono text-xs min-h-[60px]" value={headers} onChange={(e) => setHeaders(e.target.value)} />
          </div>
        </div>

        <Button onClick={run} disabled={loading || !endpoint || !query.trim()}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Run Query
        </Button>

        {response && (
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2">
                {time !== null && <Badge variant="outline">{time}ms</Badge>}
              </div>
              <Button size="sm" variant="ghost" onClick={copy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <pre className="bg-muted rounded-lg p-4 overflow-auto max-h-[400px] text-xs font-mono whitespace-pre-wrap">
              {response}
            </pre>
          </div>
        )}
      </div>
    </ToolPage>
  );
}
