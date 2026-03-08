import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

export default function HtmlPreview() {
  const [html, setHtml] = useState(`<div style="font-family: sans-serif; padding: 20px;">
  <h1 style="color: #4f46e5;">Hello World</h1>
  <p>This is a <strong>live HTML preview</strong>.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
  <button style="background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
    Click Me
  </button>
</div>`);

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="HTML Preview" description="Write HTML and see it rendered live" />
      <div className="grid grid-cols-2 gap-4" style={{ minHeight: 400 }}>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">HTML Code</label>
          <Textarea
            value={html}
            onChange={e => setHtml(e.target.value)}
            className="font-mono text-xs bg-card h-[400px] resize-none"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Preview</label>
          <div className="border border-border rounded-lg bg-white h-[400px] overflow-auto">
            <iframe
              srcDoc={html}
              className="w-full h-full border-0 rounded-lg"
              sandbox="allow-scripts"
              title="HTML Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
