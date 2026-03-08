import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

function tsInterfaceToJson(ts: string, useMockData: boolean): string {
  try {
    const lines = ts.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("//") && !l.startsWith("/*") && !l.startsWith("*"));
    const obj: Record<string, any> = {};

    for (const line of lines) {
      // Skip interface/type/export declarations and closing braces
      if (/^(export\s+)?(interface|type)\s+/.test(line)) continue;
      if (line === "{" || line === "}" || line === "};") continue;

      // Match property: type patterns
      const match = line.match(/^(\w+)(\??)\s*:\s*(.+?)\s*[;,]?\s*$/);
      if (!match) continue;

      const [, name, optional, typeStr] = match;
      obj[name] = mockValue(typeStr.trim(), useMockData, name);
    }

    return JSON.stringify(obj, null, 2);
  } catch {
    return "// Could not parse TypeScript interface";
  }
}

function mockValue(typeStr: string, mock: boolean, name: string): any {
  const t = typeStr.replace(/\s/g, "").toLowerCase();

  if (t === "string") return mock ? getMockString(name) : "";
  if (t === "number") return mock ? getMockNumber(name) : 0;
  if (t === "boolean") return mock ? true : false;
  if (t === "null") return null;
  if (t === "undefined") return null;
  if (t === "date") return mock ? "2024-01-15T10:30:00Z" : "";
  if (t === "any" || t === "unknown") return mock ? "value" : null;

  // Array types
  if (t.endsWith("[]")) {
    const inner = typeStr.slice(0, -2).trim();
    return [mockValue(inner, mock, name)];
  }
  if (t.startsWith("array<")) {
    const inner = typeStr.match(/Array<(.+)>/i)?.[1] || "any";
    return [mockValue(inner.trim(), mock, name)];
  }

  // Union types - pick first
  if (t.includes("|")) {
    const first = typeStr.split("|")[0].trim();
    // String literal
    if (first.startsWith('"') || first.startsWith("'")) return first.replace(/['"]/g, "");
    return mockValue(first, mock, name);
  }

  // Record type
  if (t.startsWith("record<")) return {};

  // Object / nested
  return {};
}

function getMockString(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("email")) return "user@example.com";
  if (n.includes("name") && n.includes("first")) return "John";
  if (n.includes("name") && n.includes("last")) return "Doe";
  if (n.includes("name")) return "John Doe";
  if (n.includes("url") || n.includes("link")) return "https://example.com";
  if (n.includes("phone")) return "+1-555-0123";
  if (n.includes("address")) return "123 Main St";
  if (n.includes("city")) return "New York";
  if (n.includes("country")) return "US";
  if (n.includes("id")) return "abc-123-def";
  if (n.includes("title")) return "Sample Title";
  if (n.includes("description") || n.includes("desc")) return "A brief description";
  if (n.includes("image") || n.includes("avatar") || n.includes("photo")) return "https://example.com/image.jpg";
  if (n.includes("password")) return "••••••••";
  if (n.includes("token")) return "eyJhbGciOiJIUzI1NiJ9...";
  if (n.includes("date") || n.includes("created") || n.includes("updated")) return "2024-01-15";
  return "sample string";
}

function getMockNumber(name: string): number {
  const n = name.toLowerCase();
  if (n.includes("age")) return 28;
  if (n.includes("price") || n.includes("amount")) return 29.99;
  if (n.includes("count") || n.includes("total")) return 42;
  if (n.includes("id")) return 1;
  if (n.includes("year")) return 2024;
  if (n.includes("rating") || n.includes("score")) return 4.5;
  return 0;
}

const EXAMPLE = `interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  isActive: boolean;
  role: "admin" | "user" | "moderator";
  tags: string[];
  address?: {
    street: string;
    city: string;
    country: string;
  };
  createdAt: Date;
}`;

export default function TsToJson() {
  const [input, setInput] = useState(EXAMPLE);
  const [mockData, setMockData] = useState(true);

  const output = useMemo(() => tsInterfaceToJson(input, mockData), [input, mockData]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="TypeScript to JSON" description="Convert TypeScript interfaces to JSON with smart mock data" />

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Generate mock data</span>
          <Switch checked={mockData} onCheckedChange={setMockData} />
        </div>
        <Badge variant="outline" className="text-xs">{mockData ? "Smart mock values" : "Default values"}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">TypeScript Interface</label>
          </div>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm min-h-[350px]" placeholder="Paste TypeScript interface..." />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">JSON Output</label>
            <CopyButton text={output} />
          </div>
          <Textarea value={output} readOnly className="font-mono text-sm min-h-[350px] bg-muted" />
        </div>
      </div>
    </div>
  );
}
