import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Package, Download, FileCode } from "lucide-react";

interface PkgInfo {
  name: string;
  version: string;
  gzip: number;
  size: number;
  description: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function NpmPackageSize() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PkgInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    const pkg = query.trim();
    if (!pkg) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`https://bundlephobia.com/api/size?package=${encodeURIComponent(pkg)}`);
      if (!res.ok) throw new Error(`Package "${pkg}" not found or bundlephobia error`);
      const data = await res.json();
      const info: PkgInfo = {
        name: data.name,
        version: data.version,
        gzip: data.gzip,
        size: data.size,
        description: data.description || "",
      };
      setResults(prev => [info, ...prev.filter(p => p.name !== info.name)]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="NPM Package Size Checker" description="Check the bundle size of any npm package using Bundlephobia" />

      <div className="flex gap-2 mb-6">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="lodash, react, axios..."
          className="font-mono text-sm"
          onKeyDown={e => e.key === "Enter" && check()}
        />
        <Button onClick={check} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="space-y-3">
        {results.map(pkg => (
          <div key={pkg.name} className="border rounded-md bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-mono font-semibold text-foreground">{pkg.name}</span>
              <span className="text-xs text-muted-foreground">@{pkg.version}</span>
            </div>
            {pkg.description && <p className="text-xs text-muted-foreground mb-3">{pkg.description}</p>}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-lg font-bold text-foreground">{formatBytes(pkg.gzip)}</p>
                  <p className="text-[10px] text-muted-foreground">Minified + Gzipped</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-lg font-bold text-foreground">{formatBytes(pkg.size)}</p>
                  <p className="text-[10px] text-muted-foreground">Minified</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !error && (
        <p className="text-sm text-muted-foreground text-center py-8">Enter a package name to check its bundle size</p>
      )}
    </div>
  );
}
