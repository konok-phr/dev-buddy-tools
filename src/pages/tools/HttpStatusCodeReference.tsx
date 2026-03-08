import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";

const codes: { code: number; text: string; desc: string; category: string }[] = [
  { code: 100, text: "Continue", desc: "Server received headers, client should proceed", category: "1xx Informational" },
  { code: 101, text: "Switching Protocols", desc: "Server is switching protocols as requested", category: "1xx Informational" },
  { code: 200, text: "OK", desc: "Request succeeded", category: "2xx Success" },
  { code: 201, text: "Created", desc: "Resource created successfully", category: "2xx Success" },
  { code: 204, text: "No Content", desc: "Success with no response body", category: "2xx Success" },
  { code: 206, text: "Partial Content", desc: "Partial resource returned (range request)", category: "2xx Success" },
  { code: 301, text: "Moved Permanently", desc: "Resource has a new permanent URI", category: "3xx Redirection" },
  { code: 302, text: "Found", desc: "Temporary redirect", category: "3xx Redirection" },
  { code: 304, text: "Not Modified", desc: "Cached version is still valid", category: "3xx Redirection" },
  { code: 307, text: "Temporary Redirect", desc: "Temporary redirect preserving method", category: "3xx Redirection" },
  { code: 308, text: "Permanent Redirect", desc: "Permanent redirect preserving method", category: "3xx Redirection" },
  { code: 400, text: "Bad Request", desc: "Malformed request syntax", category: "4xx Client Error" },
  { code: 401, text: "Unauthorized", desc: "Authentication required", category: "4xx Client Error" },
  { code: 403, text: "Forbidden", desc: "Server refuses to authorize", category: "4xx Client Error" },
  { code: 404, text: "Not Found", desc: "Resource not found", category: "4xx Client Error" },
  { code: 405, text: "Method Not Allowed", desc: "HTTP method not supported for this resource", category: "4xx Client Error" },
  { code: 408, text: "Request Timeout", desc: "Server timed out waiting for request", category: "4xx Client Error" },
  { code: 409, text: "Conflict", desc: "Request conflicts with current state", category: "4xx Client Error" },
  { code: 410, text: "Gone", desc: "Resource permanently removed", category: "4xx Client Error" },
  { code: 413, text: "Payload Too Large", desc: "Request body exceeds server limit", category: "4xx Client Error" },
  { code: 415, text: "Unsupported Media Type", desc: "Media type not supported", category: "4xx Client Error" },
  { code: 422, text: "Unprocessable Entity", desc: "Request well-formed but semantically invalid", category: "4xx Client Error" },
  { code: 429, text: "Too Many Requests", desc: "Rate limit exceeded", category: "4xx Client Error" },
  { code: 500, text: "Internal Server Error", desc: "Generic server error", category: "5xx Server Error" },
  { code: 502, text: "Bad Gateway", desc: "Invalid response from upstream server", category: "5xx Server Error" },
  { code: 503, text: "Service Unavailable", desc: "Server temporarily overloaded or down", category: "5xx Server Error" },
  { code: 504, text: "Gateway Timeout", desc: "Upstream server didn't respond in time", category: "5xx Server Error" },
];

const catColors: Record<string, string> = {
  "1xx Informational": "text-blue-400",
  "2xx Success": "text-green-400",
  "3xx Redirection": "text-yellow-400",
  "4xx Client Error": "text-orange-400",
  "5xx Server Error": "text-red-400",
};

export default function HttpStatusCodeReference() {
  const [search, setSearch] = useState("");
  const filtered = codes.filter(c =>
    c.code.toString().includes(search) || c.text.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
  );
  const groups = [...new Set(filtered.map(c => c.category))];

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="HTTP Status Code Reference" description="Quick reference for all common HTTP status codes" />
      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by code or description..." className="mb-4 bg-card" />
      <div className="space-y-6">
        {groups.map(group => (
          <div key={group}>
            <h2 className={`text-sm font-semibold mb-2 ${catColors[group] || "text-foreground"}`}>{group}</h2>
            <div className="space-y-1">
              {filtered.filter(c => c.category === group).map(c => (
                <div key={c.code} className="flex items-baseline gap-3 rounded-md border border-border bg-card px-3 py-2">
                  <code className="text-sm font-mono font-bold text-foreground w-10">{c.code}</code>
                  <span className="text-sm font-medium text-foreground w-48">{c.text}</span>
                  <span className="text-xs text-muted-foreground">{c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
