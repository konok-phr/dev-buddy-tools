import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Lang = "json" | "css" | "html" | "sql" | "xml";

function beautifyJson(s: string): string {
  return JSON.stringify(JSON.parse(s), null, 2);
}

function beautifyCss(s: string): string {
  let indent = 0;
  return s
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;])\s*/g, "$1")
    .replace(/}/g, "\n}\n")
    .replace(/{/g, " {\n")
    .replace(/;/g, ";\n")
    .split("\n")
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed === "}") indent--;
      const result = "  ".repeat(Math.max(0, indent)) + trimmed;
      if (trimmed.endsWith("{")) indent++;
      return result;
    })
    .filter(Boolean)
    .join("\n");
}

function beautifyHtml(s: string): string {
  let indent = 0;
  const selfClosing = /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i;
  return s
    .replace(/>\s+</g, ">\n<")
    .split("\n")
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("</")) indent--;
      const result = "  ".repeat(Math.max(0, indent)) + trimmed;
      if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>") && !selfClosing.test(trimmed)) indent++;
      return result;
    })
    .filter(Boolean)
    .join("\n");
}

function beautifySql(s: string): string {
  const kw = /\b(SELECT|FROM|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ON|INSERT INTO|VALUES|UPDATE|SET|DELETE FROM|CREATE TABLE|ALTER TABLE|DROP TABLE|LIMIT|OFFSET|UNION|AS)\b/gi;
  return s.replace(kw, m => `\n${m.toUpperCase()}`).replace(/,/g, ",\n  ").trim();
}

function beautifyXml(s: string): string {
  let indent = 0;
  return s
    .replace(/>\s*</g, ">\n<")
    .split("\n")
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("</")) indent--;
      const result = "  ".repeat(Math.max(0, indent)) + trimmed;
      if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>") && !trimmed.startsWith("<?")) indent++;
      return result;
    })
    .filter(Boolean)
    .join("\n");
}

const beautifiers: Record<Lang, (s: string) => string> = { json: beautifyJson, css: beautifyCss, html: beautifyHtml, sql: beautifySql, xml: beautifyXml };

export default function CodeBeautifier() {
  const [lang, setLang] = useState<Lang>("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const beautify = () => {
    try {
      setOutput(beautifiers[lang](input));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="Code Beautifier" description="Format and beautify JSON, CSS, HTML, SQL and XML code" />

      <div className="flex gap-2 mb-4">
        {(["json", "css", "html", "sql", "xml"] as Lang[]).map(l => (
          <Button key={l} variant={lang === l ? "default" : "outline"} size="sm" onClick={() => { setLang(l); setOutput(""); setError(""); }}>
            {l.toUpperCase()}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-sm bg-card min-h-[300px]" placeholder={`Paste ${lang.toUpperCase()} here...`} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Beautified</label>
            {output && <CopyButton text={output} />}
          </div>
          <Textarea value={output} readOnly className="font-mono text-sm bg-card min-h-[300px]" />
        </div>
      </div>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      <div className="mt-4">
        <Button onClick={beautify}>Beautify</Button>
      </div>
    </div>
  );
}
