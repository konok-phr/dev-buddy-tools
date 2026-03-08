import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const KEYWORDS = new Set([
  "SELECT","FROM","WHERE","AND","OR","NOT","IN","EXISTS","BETWEEN","LIKE","IS","NULL",
  "JOIN","INNER","LEFT","RIGHT","OUTER","FULL","CROSS","ON","AS","ORDER","BY","GROUP",
  "HAVING","LIMIT","OFFSET","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE",
  "TABLE","ALTER","DROP","INDEX","VIEW","UNION","ALL","DISTINCT","CASE","WHEN","THEN",
  "ELSE","END","ASC","DESC","COUNT","SUM","AVG","MIN","MAX","WITH","RECURSIVE","IF",
]);

function formatSQL(sql: string, indent: string): string {
  let formatted = sql.replace(/\s+/g, " ").trim();
  const newlineBefore = ["SELECT","FROM","WHERE","AND","OR","JOIN","INNER JOIN","LEFT JOIN",
    "RIGHT JOIN","FULL JOIN","CROSS JOIN","ORDER BY","GROUP BY","HAVING","LIMIT","OFFSET",
    "UNION","UNION ALL","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","CREATE TABLE",
    "ALTER TABLE","DROP TABLE"];
  
  newlineBefore.forEach(kw => {
    const re = new RegExp(`\\b(${kw})\\b`, "gi");
    formatted = formatted.replace(re, `\n${kw.toUpperCase()}`);
  });

  // Indent after SELECT, SET
  const lines = formatted.split("\n").filter(l => l.trim());
  const result: string[] = [];
  let depth = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    const upper = trimmed.toUpperCase();
    if (upper.startsWith(")")) depth = Math.max(0, depth - 1);
    result.push(indent.repeat(depth) + trimmed);
    if (upper.startsWith("(") || upper.endsWith("(")) depth++;
  }

  return result.join("\n");
}

export default function SqlFormatter() {
  const [input, setInput] = useState(
    `SELECT u.id, u.name, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.total > 100 AND u.active = 1 ORDER BY o.total DESC LIMIT 10;`
  );
  const [indentStyle, setIndentStyle] = useState("  ");

  const formatted = formatSQL(input, indentStyle);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="SQL Formatter" description="Format and beautify SQL queries" />
      <div className="space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Indent Style</label>
            <Select value={indentStyle} onValueChange={setIndentStyle}>
              <SelectTrigger className="bg-card w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="  ">2 Spaces</SelectItem>
                <SelectItem value="    ">4 Spaces</SelectItem>
                <SelectItem value={"\t"}>Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input SQL</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="font-mono text-xs bg-card min-h-[120px]" placeholder="Paste your SQL query..." />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Formatted SQL</label>
            <CopyButton text={formatted} />
          </div>
          <pre className="text-xs font-mono bg-card border border-border rounded p-3 overflow-x-auto whitespace-pre min-h-[120px]">{formatted}</pre>
        </div>
      </div>
    </div>
  );
}
