import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

function htmlToJsx(html: string): string {
  let jsx = html;
  // Self-closing tags
  jsx = jsx.replace(/<(img|br|hr|input|meta|link)([^>]*?)(?<!\/)>/gi, "<$1$2 />");
  // class -> className
  jsx = jsx.replace(/\bclass=/g, "className=");
  // for -> htmlFor
  jsx = jsx.replace(/\bfor=/g, "htmlFor=");
  // tabindex -> tabIndex
  jsx = jsx.replace(/\btabindex=/g, "tabIndex=");
  // Style strings to objects
  jsx = jsx.replace(/style="([^"]*)"/g, (_, styles: string) => {
    const obj = styles.split(";").filter(Boolean).map(s => {
      const [prop, ...val] = s.split(":");
      const camel = prop.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return `${camel}: "${val.join(":").trim()}"`;
    }).join(", ");
    return `style={{${obj}}}`;
  });
  // onclick -> onClick etc
  jsx = jsx.replace(/\bon(click|change|submit|focus|blur|keydown|keyup|mouseenter|mouseleave)=/gi,
    (_, ev: string) => `on${ev.charAt(0).toUpperCase()}${ev.slice(1).toLowerCase()}=`);
  // <!-- --> to {/* */}
  jsx = jsx.replace(/<!--(.*?)-->/gs, "{/*$1*/}");
  return jsx;
}

export default function HtmlToJsx() {
  const [html, setHtml] = useState(`<div class="container">\n  <label for="name">Name:</label>\n  <input type="text" tabindex="1" />\n  <img src="logo.png" alt="Logo">\n  <p style="color: red; font-size: 16px;">Hello</p>\n  <!-- Comment -->\n  <button onclick="handleClick()">Click</button>\n</div>`);
  const jsx = htmlToJsx(html);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="HTML to JSX" description="Convert HTML markup to valid JSX syntax" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">HTML</h2>
          </div>
          <Textarea value={html} onChange={e => setHtml(e.target.value)} className="font-mono text-sm min-h-[300px]" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">JSX</h2>
            <CopyButton text={jsx} />
          </div>
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap min-h-[300px] text-foreground">{jsx}</pre>
        </div>
      </div>
    </div>
  );
}
