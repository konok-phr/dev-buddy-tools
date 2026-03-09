import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditorconfigGenerator() {
  const [indentStyle, setIndentStyle] = useState("space");
  const [indentSize, setIndentSize] = useState("2");
  const [eol, setEol] = useState("lf");
  const [trimTrailing, setTrimTrailing] = useState(true);
  const [insertFinalNewline, setInsertFinalNewline] = useState(true);

  const output = `root = true

[*]
indent_style = ${indentStyle}
indent_size = ${indentSize}
end_of_line = ${eol}
charset = utf-8
trim_trailing_whitespace = ${trimTrailing}
insert_final_newline = ${insertFinalNewline}

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
`;

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="EditorConfig Generator" description="Generate .editorconfig files for consistent coding styles" />
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div><Label className="text-sm">Indent Style</Label>
          <Select value={indentStyle} onValueChange={setIndentStyle}><SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="space">Space</SelectItem><SelectItem value="tab">Tab</SelectItem></SelectContent>
          </Select></div>
        <div><Label className="text-sm">Indent Size</Label>
          <Select value={indentSize} onValueChange={setIndentSize}><SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>{["2","4","8"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select></div>
        <div><Label className="text-sm">Line Ending</Label>
          <Select value={eol} onValueChange={setEol}><SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="lf">LF</SelectItem><SelectItem value="crlf">CRLF</SelectItem></SelectContent>
          </Select></div>
        <div className="flex items-center gap-2"><Switch checked={trimTrailing} onCheckedChange={setTrimTrailing} /><Label className="text-sm">Trim Trailing</Label></div>
        <div className="flex items-center gap-2"><Switch checked={insertFinalNewline} onCheckedChange={setInsertFinalNewline} /><Label className="text-sm">Final Newline</Label></div>
      </div>
      <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
      <Textarea value={output} readOnly className="font-mono text-sm h-56" />
    </div>
  );
}
