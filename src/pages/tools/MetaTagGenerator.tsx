import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("My Awesome Website");
  const [description, setDescription] = useState("A brief description of your website for search engines.");
  const [keywords, setKeywords] = useState("web, tools, developer");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("https://example.com");
  const [image, setImage] = useState("https://example.com/og-image.png");
  const [twitterHandle, setTwitterHandle] = useState("");

  const output = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
${keywords ? `<meta name="keywords" content="${keywords}">` : ""}
${author ? `<meta name="author" content="${author}">` : ""}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${image}">
${twitterHandle ? `<meta property="twitter:creator" content="${twitterHandle}">` : ""}`.replace(/\n{2,}/g, "\n\n");

  const fields = [
    { label: "Title", value: title, set: setTitle, hint: `${title.length}/60 chars` },
    { label: "Description", value: description, set: setDescription, hint: `${description.length}/160 chars`, textarea: true },
    { label: "Keywords", value: keywords, set: setKeywords },
    { label: "Author", value: author, set: setAuthor },
    { label: "URL", value: url, set: setUrl },
    { label: "OG Image URL", value: image, set: setImage },
    { label: "Twitter Handle", value: twitterHandle, set: setTwitterHandle, placeholder: "@handle" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Meta Tag Generator" description="Generate SEO-friendly meta tags for your website" />
      <div className="space-y-4">
        <div className="grid gap-3">
          {fields.map(f => (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-muted-foreground">{f.label}</label>
                {f.hint && <span className="text-xs text-muted-foreground">{f.hint}</span>}
              </div>
              {f.textarea ? (
                <Textarea value={f.value} onChange={e => f.set(e.target.value)} className="bg-card text-sm" />
              ) : (
                <Input value={f.value} onChange={e => f.set(e.target.value)} className="bg-card text-sm" placeholder={f.placeholder} />
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Generated Meta Tags</label>
            <CopyButton text={output} />
          </div>
          <pre className="text-xs font-mono bg-card border border-border rounded p-3 overflow-x-auto whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
