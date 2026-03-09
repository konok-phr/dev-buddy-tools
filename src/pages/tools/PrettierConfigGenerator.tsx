import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function PrettierConfigGenerator() {
  const [semi, setSemi] = useState(true);
  const [singleQuote, setSingleQuote] = useState(false);
  const [tabWidth, setTabWidth] = useState("2");
  const [trailingComma, setTrailingComma] = useState("all");
  const [printWidth, setPrintWidth] = useState("80");
  const [bracketSpacing, setBracketSpacing] = useState(true);
  const [arrowParens, setArrowParens] = useState("always");
  const [endOfLine, setEndOfLine] = useState("lf");

  const config = JSON.stringify({
    semi, singleQuote, tabWidth: +tabWidth, trailingComma,
    printWidth: +printWidth, bracketSpacing, arrowParens, endOfLine,
  }, null, 2);

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Prettier Config Generator" description="Generate .prettierrc configuration interactively" />
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div className="flex items-center gap-2"><Switch checked={semi} onCheckedChange={setSemi} /><Label>Semicolons</Label></div>
        <div className="flex items-center gap-2"><Switch checked={singleQuote} onCheckedChange={setSingleQuote} /><Label>Single Quotes</Label></div>
        <div className="flex items-center gap-2"><Switch checked={bracketSpacing} onCheckedChange={setBracketSpacing} /><Label>Bracket Spacing</Label></div>
        <div><Label className="text-sm">Tab Width</Label>
          <Select value={tabWidth} onValueChange={setTabWidth}><SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>{["2","4"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select></div>
        <div><Label className="text-sm">Print Width</Label><Input type="number" value={printWidth} onChange={e => setPrintWidth(e.target.value)} className="w-20" /></div>
        <div><Label className="text-sm">Trailing Comma</Label>
          <Select value={trailingComma} onValueChange={setTrailingComma}><SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>{["all","es5","none"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select></div>
        <div><Label className="text-sm">Arrow Parens</Label>
          <Select value={arrowParens} onValueChange={setArrowParens}><SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>{["always","avoid"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select></div>
      </div>
      <div className="flex justify-end mb-1"><CopyButton text={config} /></div>
      <Textarea value={config} readOnly className="font-mono text-sm h-48" />
    </div>
  );
}
