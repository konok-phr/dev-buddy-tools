import { useState, useMemo } from "react";
import ToolPage from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "tags": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "NYC",
    "zip": "10001"
  }
}`;

function jsonToZod(obj: unknown, name = "schema", depth = 0): string {
  const indent = "  ".repeat(depth);
  if (obj === null) return "z.null()";
  if (typeof obj === "string") return "z.string()";
  if (typeof obj === "number") return Number.isInteger(obj) ? "z.number().int()" : "z.number()";
  if (typeof obj === "boolean") return "z.boolean()";

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "z.array(z.unknown())";
    return `z.array(${jsonToZod(obj[0], name, depth)})`;
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "z.object({})";
    const fields = entries
      .map(([key, val]) => `${indent}  ${key}: ${jsonToZod(val, key, depth + 1)}`)
      .join(",\n");
    return `z.object({\n${fields},\n${indent}})`;
  }

  return "z.unknown()";
}

export default function JsonToZod() {
  const [input, setInput] = useState(SAMPLE);
  const [schemaName, setSchemaName] = useState("mySchema");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return `import { z } from "zod";\n\nexport const ${schemaName} = ${jsonToZod(parsed, schemaName)};\n\nexport type ${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)} = z.infer<typeof ${schemaName}>;`;
    } catch {
      return "// Invalid JSON";
    }
  }, [input, schemaName]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolPage toolId="json-to-zod" title="JSON to Zod Schema" description="Generate Zod validation schemas from JSON data">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Schema Name:</label>
            <input
              className="bg-muted px-2 py-1 rounded text-sm font-mono border border-border"
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
            />
          </div>
          <Textarea
            className="font-mono text-sm min-h-[350px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here..."
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge variant="secondary">Zod Output</Badge>
            <Button size="sm" variant="ghost" onClick={copy}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <pre className="bg-muted rounded-lg p-4 overflow-auto min-h-[350px] text-xs font-mono whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      </div>
    </ToolPage>
  );
}
