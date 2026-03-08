import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface GitignoreTemplate {
  name: string;
  category: string;
  rules: string[];
}

const TEMPLATES: GitignoreTemplate[] = [
  { name: "Node.js", category: "Language", rules: ["node_modules/", "npm-debug.log*", "yarn-debug.log*", "yarn-error.log*", ".npm", ".yarn-integrity", "dist/", "build/"] },
  { name: "Python", category: "Language", rules: ["__pycache__/", "*.py[cod]", "*$py.class", "*.egg-info/", "dist/", "build/", ".eggs/", "*.egg", "venv/", ".env/", ".venv/"] },
  { name: "Java", category: "Language", rules: ["*.class", "*.jar", "*.war", "*.ear", "target/", ".gradle/", "build/", "out/"] },
  { name: "Go", category: "Language", rules: ["*.exe", "*.exe~", "*.dll", "*.so", "*.dylib", "vendor/", "bin/"] },
  { name: "Rust", category: "Language", rules: ["target/", "Cargo.lock", "**/*.rs.bk"] },
  { name: "Ruby", category: "Language", rules: ["*.gem", "*.rbc", ".bundle/", "vendor/bundle/", "log/", "tmp/", ".byebug_history"] },
  { name: "React / Vite", category: "Framework", rules: ["node_modules/", "dist/", "build/", ".env.local", ".env.*.local", "*.tsbuildinfo"] },
  { name: "Next.js", category: "Framework", rules: [".next/", "out/", "node_modules/", ".env*.local", "*.tsbuildinfo", "next-env.d.ts"] },
  { name: "Django", category: "Framework", rules: ["*.pyc", "db.sqlite3", "media/", "staticfiles/", "__pycache__/", ".env"] },
  { name: "Laravel", category: "Framework", rules: ["vendor/", "node_modules/", ".env", "storage/*.key", "public/hot", "public/storage"] },
  { name: "VS Code", category: "IDE", rules: [".vscode/*", "!.vscode/settings.json", "!.vscode/tasks.json", "!.vscode/launch.json", "!.vscode/extensions.json", "*.code-workspace"] },
  { name: "JetBrains", category: "IDE", rules: [".idea/", "*.iml", "*.iws", "*.ipr", "out/", ".idea_modules/"] },
  { name: "Vim", category: "IDE", rules: ["[._]*.s[a-v][a-z]", "[._]*.sw[a-p]", "[._]s[a-rt-v][a-z]", "[._]ss[a-gi-z]", "[._]sw[a-p]", "Session.vim", "Sessionx.vim", ".netrwhist", "*~", "tags"] },
  { name: "macOS", category: "OS", rules: [".DS_Store", ".AppleDouble", ".LSOverride", "._*", ".Spotlight-V100", ".Trashes"] },
  { name: "Windows", category: "OS", rules: ["Thumbs.db", "Thumbs.db:encryptable", "ehthumbs.db", "*.lnk", "desktop.ini"] },
  { name: "Linux", category: "OS", rules: ["*~", ".fuse_hidden*", ".directory", ".Trash-*", ".nfs*"] },
  { name: "Environment", category: "Common", rules: [".env", ".env.local", ".env.*.local", ".env.production", ".env.development"] },
  { name: "Logs", category: "Common", rules: ["logs/", "*.log", "npm-debug.log*", "pids/", "*.pid", "*.seed"] },
  { name: "Docker", category: "Tool", rules: [".docker/", "docker-compose.override.yml"] },
  { name: "Terraform", category: "Tool", rules: [".terraform/", "*.tfstate", "*.tfstate.*", "crash.log", "*.tfvars"] },
];

export default function GitignoreGenerator() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["Node.js", "macOS", "Environment", "VS Code"]));
  const [customRules, setCustomRules] = useState("");
  const [search, setSearch] = useState("");

  const toggle = (name: string) => {
    const next = new Set(selected);
    if (next.has(name)) next.delete(name); else next.add(name);
    setSelected(next);
  };

  const categories = [...new Set(TEMPLATES.map(t => t.category))];

  const output = useMemo(() => {
    const sections: string[] = [];
    for (const t of TEMPLATES) {
      if (!selected.has(t.name)) continue;
      sections.push(`# ${t.name}`, ...t.rules, "");
    }
    if (customRules.trim()) {
      sections.push("# Custom rules", ...customRules.split("\n").filter(Boolean), "");
    }
    return sections.join("\n");
  }, [selected, customRules]);

  const filtered = TEMPLATES.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title=".gitignore Generator" description="Select languages, frameworks & IDEs to generate .gitignore" />

      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..." className="mb-4 text-sm" />

      {categories.map(cat => {
        const items = filtered.filter(t => t.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{cat}</p>
            <div className="flex flex-wrap gap-2">
              {items.map(t => (
                <Badge
                  key={t.name}
                  variant={selected.has(t.name) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggle(t.name)}
                >
                  {t.name}
                </Badge>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mb-4">
        <label className="text-xs text-muted-foreground mb-1 block">Custom rules (one per line)</label>
        <Input value={customRules} onChange={e => setCustomRules(e.target.value)} placeholder="*.tmp, .secret/" className="font-mono text-sm" />
      </div>

      {output.trim() && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">.gitignore</h3>
            <CopyButton text={output} />
          </div>
          <pre className="text-sm font-mono text-foreground bg-muted p-3 rounded overflow-x-auto whitespace-pre max-h-[400px] overflow-y-auto">{output}</pre>
        </div>
      )}
    </div>
  );
}
