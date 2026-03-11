import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Globe, CheckCircle2, XCircle, Info } from "lucide-react";

interface CmsResult {
  cms: string;
  confidence: "high" | "medium" | "low";
  evidence: string[];
  icon?: string;
}

const CMS_SIGNATURES: { name: string; patterns: { regex: RegExp; weight: number; label: string }[] }[] = [
  {
    name: "WordPress",
    patterns: [
      { regex: /wp-content\//i, weight: 3, label: "wp-content directory" },
      { regex: /wp-includes\//i, weight: 3, label: "wp-includes directory" },
      { regex: /wp-json/i, weight: 2, label: "WP REST API" },
      { regex: /<meta name="generator" content="WordPress/i, weight: 4, label: "Generator meta tag" },
      { regex: /xmlrpc\.php/i, weight: 2, label: "XML-RPC endpoint" },
      { regex: /wp-emoji/i, weight: 1, label: "WP Emoji script" },
    ],
  },
  {
    name: "Shopify",
    patterns: [
      { regex: /cdn\.shopify\.com/i, weight: 4, label: "Shopify CDN" },
      { regex: /Shopify\.theme/i, weight: 3, label: "Shopify.theme object" },
      { regex: /<meta name="shopify/i, weight: 3, label: "Shopify meta tag" },
      { regex: /myshopify\.com/i, weight: 3, label: "myshopify.com reference" },
    ],
  },
  {
    name: "Wix",
    patterns: [
      { regex: /wix\.com/i, weight: 3, label: "wix.com reference" },
      { regex: /X-Wix/i, weight: 4, label: "X-Wix header" },
      { regex: /wixstatic\.com/i, weight: 3, label: "Wix static CDN" },
      { regex: /wix-code/i, weight: 2, label: "Wix code reference" },
    ],
  },
  {
    name: "Squarespace",
    patterns: [
      { regex: /squarespace\.com/i, weight: 3, label: "squarespace.com reference" },
      { regex: /sqsp\.net/i, weight: 3, label: "Squarespace CDN" },
      { regex: /<meta.*Squarespace/i, weight: 4, label: "Squarespace meta tag" },
    ],
  },
  {
    name: "Joomla",
    patterns: [
      { regex: /<meta name="generator" content="Joomla/i, weight: 4, label: "Generator meta tag" },
      { regex: /\/media\/jui\//i, weight: 3, label: "Joomla UI library" },
      { regex: /\/components\/com_/i, weight: 2, label: "Joomla components path" },
      { regex: /option=com_/i, weight: 2, label: "Joomla component URL param" },
    ],
  },
  {
    name: "Drupal",
    patterns: [
      { regex: /<meta name="generator" content="Drupal/i, weight: 4, label: "Generator meta tag" },
      { regex: /\/sites\/default\/files/i, weight: 3, label: "Drupal files path" },
      { regex: /Drupal\.settings/i, weight: 3, label: "Drupal.settings object" },
      { regex: /\/misc\/drupal\.js/i, weight: 3, label: "drupal.js script" },
    ],
  },
  {
    name: "Ghost",
    patterns: [
      { regex: /<meta name="generator" content="Ghost/i, weight: 4, label: "Generator meta tag" },
      { regex: /ghost-url/i, weight: 2, label: "Ghost URL reference" },
      { regex: /\/ghost\/api/i, weight: 3, label: "Ghost API endpoint" },
    ],
  },
  {
    name: "Webflow",
    patterns: [
      { regex: /webflow\.com/i, weight: 3, label: "webflow.com reference" },
      { regex: /<meta.*generator.*Webflow/i, weight: 4, label: "Generator meta tag" },
      { regex: /assets\.website-files\.com/i, weight: 3, label: "Webflow assets CDN" },
    ],
  },
  {
    name: "Hugo",
    patterns: [
      { regex: /<meta name="generator" content="Hugo/i, weight: 4, label: "Generator meta tag" },
    ],
  },
  {
    name: "Next.js",
    patterns: [
      { regex: /__next/i, weight: 3, label: "__next container" },
      { regex: /_next\/static/i, weight: 3, label: "_next/static assets" },
      { regex: /__NEXT_DATA__/i, weight: 4, label: "__NEXT_DATA__ script" },
    ],
  },
  {
    name: "Gatsby",
    patterns: [
      { regex: /<meta name="generator" content="Gatsby/i, weight: 4, label: "Generator meta tag" },
      { regex: /___gatsby/i, weight: 3, label: "___gatsby container" },
      { regex: /gatsby-image/i, weight: 2, label: "Gatsby image component" },
    ],
  },
  {
    name: "Laravel",
    patterns: [
      { regex: /laravel_session/i, weight: 3, label: "Laravel session cookie" },
      { regex: /csrf-token/i, weight: 1, label: "CSRF token meta" },
    ],
  },
  {
    name: "Magento",
    patterns: [
      { regex: /Magento/i, weight: 2, label: "Magento reference" },
      { regex: /\/static\/frontend/i, weight: 3, label: "Magento frontend assets" },
      { regex: /mage\/cookies/i, weight: 3, label: "Mage cookies script" },
    ],
  },
  {
    name: "PrestaShop",
    patterns: [
      { regex: /prestashop/i, weight: 3, label: "PrestaShop reference" },
      { regex: /<meta name="generator" content="PrestaShop/i, weight: 4, label: "Generator meta tag" },
    ],
  },
];

function detectCms(html: string): CmsResult[] {
  const results: CmsResult[] = [];

  for (const cms of CMS_SIGNATURES) {
    let score = 0;
    const evidence: string[] = [];

    for (const pattern of cms.patterns) {
      if (pattern.regex.test(html)) {
        score += pattern.weight;
        evidence.push(pattern.label);
      }
    }

    if (score > 0) {
      const confidence: "high" | "medium" | "low" =
        score >= 6 ? "high" : score >= 3 ? "medium" : "low";
      results.push({ cms: cms.name, confidence, evidence });
    }
  }

  results.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.confidence] - order[b.confidence];
  });

  return results;
}

const confidenceColor = {
  high: "bg-green-500/10 text-green-600 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  low: "bg-muted text-muted-foreground border-border",
};

export default function CmsChecker() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<CmsResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  const check = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    setChecked(false);

    const target = url.startsWith("http") ? url : `https://${url}`;

    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(target)}`);
      const data = await res.json();

      if (!data.contents) {
        setError("Could not fetch the website content.");
        return;
      }

      const detected = detectCms(data.contents);
      setResults(detected);
      setChecked(true);
    } catch (e: any) {
      setError(`Failed to check: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="CMS Checker" description="Detect what CMS or framework a website is built with" />

      <div className="flex gap-2 mb-6">
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="font-mono text-sm flex-1"
          onKeyDown={e => e.key === "Enter" && check()}
        />
        <Button onClick={check} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Globe className="h-4 w-4 mr-2" />Detect</>}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {checked && results.length === 0 && (
        <div className="border rounded-lg p-6 text-center space-y-2">
          <XCircle className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-medium text-foreground">No CMS detected</p>
          <p className="text-xs text-muted-foreground">
            This website might use a custom-built solution or a CMS not in our database.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-semibold text-foreground">
              {results.length} CMS/Framework detected
            </span>
          </div>

          {results.map((r, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">{r.cms}</h3>
                <Badge variant="outline" className={confidenceColor[r.confidence]}>
                  {r.confidence} confidence
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.evidence.map((e, j) => (
                  <Badge key={j} variant="secondary" className="text-xs font-mono">
                    {e}
                  </Badge>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 mt-4">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Detection is based on HTML pattern matching via a CORS proxy. Results may vary — some sites actively hide their CMS or use heavy customization.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
