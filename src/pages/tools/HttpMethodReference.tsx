import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const METHODS = [
  { method: "GET", safe: true, idempotent: true, body: false, desc: "Retrieve a resource. Should not modify state." },
  { method: "POST", safe: false, idempotent: false, body: true, desc: "Create a new resource or trigger an action." },
  { method: "PUT", safe: false, idempotent: true, body: true, desc: "Replace a resource entirely." },
  { method: "PATCH", safe: false, idempotent: false, body: true, desc: "Partially update a resource." },
  { method: "DELETE", safe: false, idempotent: true, body: false, desc: "Delete a resource." },
  { method: "HEAD", safe: true, idempotent: true, body: false, desc: "Same as GET but returns headers only." },
  { method: "OPTIONS", safe: true, idempotent: true, body: false, desc: "Describe communication options for a resource." },
  { method: "TRACE", safe: true, idempotent: true, body: false, desc: "Perform a message loop-back test." },
  { method: "CONNECT", safe: false, idempotent: false, body: false, desc: "Establish a tunnel to the server." },
];

export default function HttpMethodReference() {
  const [search, setSearch] = useState("");
  const filtered = METHODS.filter(m => m.method.toLowerCase().includes(search.toLowerCase()) || m.desc.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="HTTP Methods Reference" description="Quick reference for all HTTP request methods" />
      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="mb-4" />
      <div className="space-y-3">
        {filtered.map(m => (
          <div key={m.method} className="border rounded-md p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-primary">{m.method}</span>
              {m.safe && <Badge variant="secondary" className="text-xs">Safe</Badge>}
              {m.idempotent && <Badge variant="outline" className="text-xs">Idempotent</Badge>}
              {m.body && <Badge variant="outline" className="text-xs">Has Body</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
