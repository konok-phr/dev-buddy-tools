import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRESETS: Record<string, { scripts: Record<string, string>; deps: string[]; devDeps: string[] }> = {
  "React + Vite": {
    scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
    deps: ["react", "react-dom"],
    devDeps: ["vite", "@vitejs/plugin-react", "typescript"],
  },
  "Express API": {
    scripts: { start: "node dist/index.js", dev: "ts-node-dev src/index.ts", build: "tsc" },
    deps: ["express", "cors", "dotenv"],
    devDeps: ["typescript", "@types/express", "@types/node", "ts-node-dev"],
  },
  "CLI Tool": {
    scripts: { build: "tsc", start: "node dist/index.js" },
    deps: ["commander", "chalk"],
    devDeps: ["typescript", "@types/node"],
  },
};

export default function PackageJsonGenerator() {
  const [name, setName] = useState("my-project");
  const [version, setVersion] = useState("1.0.0");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [license, setLicense] = useState("MIT");
  const [isModule, setIsModule] = useState(true);
  const [scripts, setScripts] = useState<[string, string][]>([["dev", ""], ["build", ""], ["start", ""]]);
  const [deps, setDeps] = useState<string[]>([]);
  const [devDeps, setDevDeps] = useState<string[]>([]);
  const [newDep, setNewDep] = useState("");
  const [newDevDep, setNewDevDep] = useState("");
  const [copied, setCopied] = useState(false);

  const applyPreset = (key: string) => {
    const p = PRESETS[key];
    setScripts(Object.entries(p.scripts));
    setDeps(p.deps);
    setDevDeps(p.devDeps);
  };

  const output = useMemo(() => {
    const pkg: Record<string, unknown> = {
      name: name || "my-project",
      version,
      description: description || undefined,
      ...(isModule ? { type: "module" } : {}),
      ...(author ? { author } : {}),
      license,
      scripts: Object.fromEntries(scripts.filter(([k, v]) => k && v)),
    };
    if (deps.length) pkg.dependencies = Object.fromEntries(deps.map((d) => [d, "latest"]));
    if (devDeps.length) pkg.devDependencies = Object.fromEntries(devDeps.map((d) => [d, "latest"]));
    return JSON.stringify(pkg, null, 2);
  }, [name, version, description, author, license, isModule, scripts, deps, devDeps]);

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const addDep = () => { if (newDep.trim() && !deps.includes(newDep.trim())) { setDeps([...deps, newDep.trim()]); setNewDep(""); } };
  const addDevDep = () => { if (newDevDep.trim() && !devDeps.includes(newDevDep.trim())) { setDevDeps([...devDeps, newDevDep.trim()]); setNewDevDep(""); } };

  return (
    <ToolPage toolId="package-json" title="package.json Generator" description="Build package.json interactively with presets">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {Object.keys(PRESETS).map((k) => (
              <Badge key={k} variant="secondary" className="cursor-pointer" onClick={() => applyPreset(k)}>{k}</Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="version" value={version} onChange={(e) => setVersion(e.target.value)} />
            <Input placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-2" />
            <Input placeholder="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
            <Select value={license} onValueChange={setLicense}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["MIT", "ISC", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "UNLICENSED"].map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isModule} onChange={(e) => setIsModule(e.target.checked)} />
            ES Module (<code>"type": "module"</code>)
          </label>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Scripts</h4>
            {scripts.map(([k, v], i) => (
              <div key={i} className="flex gap-2">
                <Input className="w-28" value={k} onChange={(e) => { const s = [...scripts]; s[i] = [e.target.value, v]; setScripts(s); }} placeholder="key" />
                <Input className="flex-1" value={v} onChange={(e) => { const s = [...scripts]; s[i] = [k, e.target.value]; setScripts(s); }} placeholder="command" />
                <Button size="icon" variant="ghost" onClick={() => setScripts(scripts.filter((_, j) => j !== i))}><X className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => setScripts([...scripts, ["", ""]])}><Plus className="w-3 h-3 mr-1" />Add script</Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Dependencies</h4>
            <div className="flex gap-1 flex-wrap">{deps.map((d) => <Badge key={d} variant="outline" className="cursor-pointer" onClick={() => setDeps(deps.filter((x) => x !== d))}>{d} ×</Badge>)}</div>
            <div className="flex gap-2"><Input placeholder="package name" value={newDep} onChange={(e) => setNewDep(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addDep()} /><Button size="sm" onClick={addDep}><Plus className="w-3 h-3" /></Button></div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Dev Dependencies</h4>
            <div className="flex gap-1 flex-wrap">{devDeps.map((d) => <Badge key={d} variant="outline" className="cursor-pointer" onClick={() => setDevDeps(devDeps.filter((x) => x !== d))}>{d} ×</Badge>)}</div>
            <div className="flex gap-2"><Input placeholder="package name" value={newDevDep} onChange={(e) => setNewDevDep(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addDevDep()} /><Button size="sm" onClick={addDevDep}><Plus className="w-3 h-3" /></Button></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge variant="secondary">package.json</Badge>
            <Button size="sm" variant="ghost" onClick={copy}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</Button>
          </div>
          <pre className="bg-muted rounded-lg p-4 overflow-auto min-h-[400px] text-xs font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </ToolPage>
  );
}
