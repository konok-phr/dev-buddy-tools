import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = (indent: number | null) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(indent === null ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="JSON Formatter" description="Prettify, minify & validate JSON data" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input JSON</label>
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="font-mono text-sm bg-card min-h-[300px]"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <Textarea
            value={output}
            readOnly
            className="font-mono text-sm bg-card min-h-[300px]"
            placeholder="Formatted output will appear here"
          />
        </div>
      </div>
      {error && <p className="text-destructive text-sm mt-2 font-mono">{error}</p>}
      <div className="flex gap-2 mt-4">
        <Button onClick={() => format(2)}>Prettify</Button>
        <Button variant="secondary" onClick={() => format(null)}>Minify</Button>
        <Button variant="secondary" onClick={() => { try { JSON.parse(input); setError(""); setOutput("✓ Valid JSON"); } catch (e: any) { setError(e.message); setOutput(""); } }}>
          Validate
        </Button>
      </div>
    </div>
  );
}
