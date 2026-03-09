import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TYPES = ["WebSite", "Article", "Product", "Organization", "Person", "FAQPage", "BreadcrumbList"];

export default function StructuredDataGenerator() {
  const [type, setType] = useState("WebSite");
  const [name, setName] = useState("My Website");
  const [url, setUrl] = useState("https://example.com");
  const [desc, setDesc] = useState("A description of the website.");
  const [output, setOutput] = useState("");

  const generate = () => {
    const base: any = { "@context": "https://schema.org", "@type": type, name, url, description: desc };
    if (type === "Article") { base.headline = name; base.datePublished = new Date().toISOString().split("T")[0]; }
    if (type === "Product") { base.offers = { "@type": "Offer", price: "0", priceCurrency: "USD" }; }
    if (type === "Organization") { base.logo = `${url}/logo.png`; }
    if (type === "Person") { base.jobTitle = "Developer"; }
    setOutput(JSON.stringify(base, null, 2));
  };

  const scriptTag = output ? `<script type="application/ld+json">\n${output}\n</script>` : "";

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="JSON-LD Generator" description="Generate structured data markup for SEO" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div><Label className="text-sm">Type</Label>
          <Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select></div>
        <div><Label className="text-sm">Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
        <div><Label className="text-sm">URL</Label><Input value={url} onChange={e => setUrl(e.target.value)} /></div>
        <div><Label className="text-sm">Description</Label><Input value={desc} onChange={e => setDesc(e.target.value)} /></div>
      </div>
      <Button onClick={generate} className="mb-3">Generate</Button>
      {output && (
        <>
          <div className="flex justify-end mb-1"><CopyButton text={scriptTag} /></div>
          <Textarea value={scriptTag} readOnly className="font-mono text-sm h-48" />
        </>
      )}
    </div>
  );
}
