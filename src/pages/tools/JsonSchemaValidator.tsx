import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

function validate(data: any, schema: any, path = ""): string[] {
  const errors: string[] = [];
  const at = path || "root";

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual = data === null ? "null" : Array.isArray(data) ? "array" : typeof data;
    if (!types.includes(actual)) errors.push(`${at}: expected ${types.join("|")}, got ${actual}`);
  }

  if (schema.type === "object" && typeof data === "object" && data !== null && !Array.isArray(data)) {
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in data)) errors.push(`${at}: missing required property "${key}"`);
      }
    }
    if (schema.properties) {
      for (const [key, subSchema] of Object.entries(schema.properties)) {
        if (key in data) errors.push(...validate(data[key], subSchema as any, `${at}.${key}`));
      }
    }
  }

  if (schema.type === "array" && Array.isArray(data)) {
    if (schema.minItems !== undefined && data.length < schema.minItems) errors.push(`${at}: min ${schema.minItems} items, got ${data.length}`);
    if (schema.maxItems !== undefined && data.length > schema.maxItems) errors.push(`${at}: max ${schema.maxItems} items, got ${data.length}`);
    if (schema.items) data.forEach((item: any, i: number) => errors.push(...validate(item, schema.items, `${at}[${i}]`)));
  }

  if (schema.type === "string" && typeof data === "string") {
    if (schema.minLength !== undefined && data.length < schema.minLength) errors.push(`${at}: minLength ${schema.minLength}`);
    if (schema.maxLength !== undefined && data.length > schema.maxLength) errors.push(`${at}: maxLength ${schema.maxLength}`);
    if (schema.pattern && !new RegExp(schema.pattern).test(data)) errors.push(`${at}: doesn't match pattern "${schema.pattern}"`);
    if (schema.enum && !schema.enum.includes(data)) errors.push(`${at}: must be one of ${schema.enum.join(", ")}`);
  }

  if ((schema.type === "number" || schema.type === "integer") && typeof data === "number") {
    if (schema.minimum !== undefined && data < schema.minimum) errors.push(`${at}: minimum ${schema.minimum}`);
    if (schema.maximum !== undefined && data > schema.maximum) errors.push(`${at}: maximum ${schema.maximum}`);
  }

  return errors;
}

export default function JsonSchemaValidator() {
  const [jsonInput, setJsonInput] = useState('{\n  "name": "John",\n  "age": 30\n}');
  const [schemaInput, setSchemaInput] = useState('{\n  "type": "object",\n  "required": ["name", "age"],\n  "properties": {\n    "name": { "type": "string" },\n    "age": { "type": "number", "minimum": 0 }\n  }\n}');
  const [results, setResults] = useState<string[] | null>(null);

  const run = () => {
    try {
      const data = JSON.parse(jsonInput);
      const schema = JSON.parse(schemaInput);
      setResults(validate(data, schema));
    } catch (e: any) {
      setResults([`Parse error: ${e.message}`]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="JSON Schema Validator" description="Validate JSON data against a JSON Schema" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">JSON Data</label>
          <Textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)} className="font-mono text-sm bg-card min-h-[250px]" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">JSON Schema</label>
          <Textarea value={schemaInput} onChange={e => setSchemaInput(e.target.value)} className="font-mono text-sm bg-card min-h-[250px]" />
        </div>
      </div>
      <Button onClick={run} className="mt-4">Validate</Button>
      {results !== null && (
        <div className="mt-4 rounded-md border border-border bg-card p-4">
          {results.length === 0 ? (
            <div className="flex items-center gap-2 text-accent">
              <CheckCircle2 className="h-5 w-5" /> <span className="font-medium">Valid — JSON matches the schema</span>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((err, i) => (
                <div key={i} className="flex items-start gap-2 text-destructive text-sm font-mono">
                  <XCircle className="h-4 w-4 mt-0.5 shrink-0" /> {err}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
