import { ArrowLeft, Copy, Check } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { toolSEO } from "@/config/seo";
import { tools } from "@/config/tools";

export function ToolHeader({ title, description }: { title: string; description: string }) {
  const location = useLocation();
  const tool = tools.find(t => t.path === location.pathname);
  const seo = tool ? toolSEO[tool.id] : null;

  return (
    <div className="mb-6">
      {seo ? (
        <SEO title={seo.title} description={seo.description} path={location.pathname} keywords={seo.keywords} />
      ) : (
        <SEO title={title} description={description} path={location.pathname} />
      )}
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3">
        <ArrowLeft className="h-3 w-3" /> Back to tools
      </Link>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Button variant="ghost" size="sm" onClick={copy} className="h-7 px-2 text-xs">
      {copied ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
