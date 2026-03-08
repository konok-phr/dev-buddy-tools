import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, RotateCcw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Step {
  name: string;
  uses?: string;
  run?: string;
  with?: Record<string, string>;
}

const templates: Record<string, { name: string; triggers: string[]; nodeVersion: string; steps: Step[] }> = {
  "node-ci": {
    name: "Node.js CI",
    triggers: ["push", "pull_request"],
    nodeVersion: "20",
    steps: [
      { name: "Checkout", uses: "actions/checkout@v4" },
      { name: "Setup Node.js", uses: "actions/setup-node@v4", with: { "node-version": "20" } },
      { name: "Install dependencies", run: "npm ci" },
      { name: "Run tests", run: "npm test" },
      { name: "Build", run: "npm run build" },
    ],
  },
  "docker-build": {
    name: "Docker Build & Push",
    triggers: ["push"],
    nodeVersion: "",
    steps: [
      { name: "Checkout", uses: "actions/checkout@v4" },
      { name: "Login to Docker Hub", uses: "docker/login-action@v3", with: { username: "${{ secrets.DOCKER_USERNAME }}", password: "${{ secrets.DOCKER_PASSWORD }}" } },
      { name: "Build and push", uses: "docker/build-push-action@v5", with: { push: "true", tags: "${{ github.repository }}:latest" } },
    ],
  },
  "deploy-vercel": {
    name: "Deploy to Vercel",
    triggers: ["push"],
    nodeVersion: "20",
    steps: [
      { name: "Checkout", uses: "actions/checkout@v4" },
      { name: "Setup Node.js", uses: "actions/setup-node@v4", with: { "node-version": "20" } },
      { name: "Install Vercel CLI", run: "npm i -g vercel" },
      { name: "Deploy", run: "vercel --prod --token=${{ secrets.VERCEL_TOKEN }}" },
    ],
  },
  "python-ci": {
    name: "Python CI",
    triggers: ["push", "pull_request"],
    nodeVersion: "",
    steps: [
      { name: "Checkout", uses: "actions/checkout@v4" },
      { name: "Setup Python", uses: "actions/setup-python@v5", with: { "python-version": "3.12" } },
      { name: "Install dependencies", run: "pip install -r requirements.txt" },
      { name: "Run tests", run: "pytest" },
    ],
  },
  blank: {
    name: "Custom Workflow",
    triggers: ["push"],
    nodeVersion: "",
    steps: [{ name: "Checkout", uses: "actions/checkout@v4" }],
  },
};

const allTriggers = ["push", "pull_request", "schedule", "workflow_dispatch", "release"];

export default function GithubActionsBuilder() {
  const [template, setTemplate] = useState("node-ci");
  const [workflowName, setWorkflowName] = useState("CI");
  const [triggers, setTriggers] = useState<string[]>(["push", "pull_request"]);
  const [branches, setBranches] = useState("main");
  const [schedCron, setSchedCron] = useState("0 0 * * *");
  const [steps, setSteps] = useState<Step[]>(templates["node-ci"].steps);
  const [enableMatrix, setEnableMatrix] = useState(false);
  const [matrixValues, setMatrixValues] = useState("18, 20, 22");
  const [matrixKey, setMatrixKey] = useState("node-version");
  const [runsOn, setRunsOn] = useState("ubuntu-latest");
  const [enableEnv, setEnableEnv] = useState(false);
  const [envVars, setEnvVars] = useState("NODE_ENV: production");
  const [enableConcurrency, setEnableConcurrency] = useState(false);
  const [concurrencyGroup, setConcurrencyGroup] = useState("${{ github.workflow }}-${{ github.ref }}");
  const [enableCache, setEnableCache] = useState(false);
  const [cachePackageManager, setCachePackageManager] = useState("npm");

  const applyTemplate = (id: string) => {
    const t = templates[id];
    if (!t) return;
    setTemplate(id);
    setWorkflowName(t.name);
    setTriggers(t.triggers);
    setSteps([...t.steps]);
  };

  const toggleTrigger = (t: string) => {
    setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const addStep = () => setSteps([...steps, { name: "New step", run: "echo 'Hello'" }]);
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, field: string, val: string) => {
    const s = [...steps];
    if (field === "name") s[i] = { ...s[i], name: val };
    else if (field === "uses") s[i] = { ...s[i], uses: val, run: undefined };
    else if (field === "run") s[i] = { ...s[i], run: val, uses: undefined };
    setSteps(s);
  };

  const generateYaml = () => {
    const lines: string[] = [];
    lines.push(`name: ${workflowName}`);
    lines.push("");
    lines.push("on:");
    triggers.forEach(t => {
      if (t === "push" || t === "pull_request") {
        lines.push(`  ${t}:`);
        lines.push(`    branches: [${branches}]`);
      } else if (t === "schedule") {
        lines.push("  schedule:");
        lines.push(`    - cron: '${schedCron}'`);
      } else if (t === "workflow_dispatch") {
        lines.push("  workflow_dispatch:");
      } else if (t === "release") {
        lines.push("  release:");
        lines.push("    types: [published]");
      }
    });

    if (enableConcurrency) {
      lines.push("");
      lines.push("concurrency:");
      lines.push(`  group: ${concurrencyGroup}`);
      lines.push("  cancel-in-progress: true");
    }

    if (enableEnv) {
      lines.push("");
      lines.push("env:");
      envVars.split("\n").forEach(l => {
        if (l.trim()) lines.push(`  ${l.trim()}`);
      });
    }

    lines.push("");
    lines.push("jobs:");
    lines.push("  build:");
    lines.push(`    runs-on: ${runsOn}`);

    if (enableMatrix) {
      lines.push("    strategy:");
      lines.push("      matrix:");
      lines.push(`        ${matrixKey}: [${matrixValues}]`);
    }

    lines.push("    steps:");

    steps.forEach(step => {
      lines.push(`      - name: ${step.name}`);
      if (step.uses) {
        lines.push(`        uses: ${step.uses}`);
        if (step.with) {
          lines.push("        with:");
          Object.entries(step.with).forEach(([k, v]) => {
            if (enableMatrix && k === matrixKey) {
              lines.push(`          ${k}: \${{ matrix.${matrixKey} }}`);
            } else {
              lines.push(`          ${k}: ${v}`);
            }
          });
        }
      }
      if (step.run) {
        if (step.run.includes("\n")) {
          lines.push("        run: |");
          step.run.split("\n").forEach(l => lines.push(`          ${l}`));
        } else {
          lines.push(`        run: ${step.run}`);
        }
      }
    });

    if (enableCache) {
      // Insert cache step after checkout
      const cacheYaml = [
        "",
        `      - name: Cache ${cachePackageManager} dependencies`,
        `        uses: actions/cache@v4`,
        "        with:",
        `          path: ${cachePackageManager === "npm" ? "~/.npm" : cachePackageManager === "yarn" ? "~/.cache/yarn" : "~/.pnpm-store"}`,
        `          key: \${{ runner.os }}-${cachePackageManager}-\${{ hashFiles('**/package-lock.json') }}`,
        `          restore-keys: |`,
        `            \${{ runner.os }}-${cachePackageManager}-`,
      ];
      // Insert after line 2 of steps (after checkout)
      const stepsStart = lines.findIndex(l => l.trim() === "steps:");
      if (stepsStart >= 0) {
        const insertIdx = stepsStart + 3; // after first step
        lines.splice(insertIdx, 0, ...cacheYaml);
      }
    }

    return lines.join("\n");
  };

  const yaml = generateYaml();

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader title="GitHub Actions Builder" description="Build CI/CD workflow YAML files visually with templates" />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Settings */}
        <div className="space-y-4 p-4 rounded-lg border border-border bg-card overflow-y-auto max-h-[80vh]">
          <h3 className="text-sm font-semibold text-foreground">Workflow Settings</h3>

          <div>
            <Label className="text-xs text-muted-foreground">Template</Label>
            <Select value={template} onValueChange={applyTemplate}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(templates).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Workflow Name</Label>
            <Input value={workflowName} onChange={e => setWorkflowName(e.target.value)} className="mt-1 h-8 text-xs" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Runs On</Label>
            <Select value={runsOn} onValueChange={setRunsOn}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ubuntu-latest">ubuntu-latest</SelectItem>
                <SelectItem value="ubuntu-22.04">ubuntu-22.04</SelectItem>
                <SelectItem value="macos-latest">macos-latest</SelectItem>
                <SelectItem value="windows-latest">windows-latest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Triggers</Label>
            <div className="space-y-1.5">
              {allTriggers.map(t => (
                <div key={t} className="flex items-center gap-2">
                  <Checkbox checked={triggers.includes(t)} onCheckedChange={() => toggleTrigger(t)} id={`trigger-${t}`} />
                  <label htmlFor={`trigger-${t}`} className="text-xs text-foreground">{t}</label>
                </div>
              ))}
            </div>
          </div>

          {(triggers.includes("push") || triggers.includes("pull_request")) && (
            <div>
              <Label className="text-xs text-muted-foreground">Branches</Label>
              <Input value={branches} onChange={e => setBranches(e.target.value)} className="mt-1 h-8 text-xs" placeholder="main, develop" />
            </div>
          )}

          {triggers.includes("schedule") && (
            <div>
              <Label className="text-xs text-muted-foreground">Cron Schedule</Label>
              <Input value={schedCron} onChange={e => setSchedCron(e.target.value)} className="mt-1 h-8 text-xs" />
            </div>
          )}

          {/* Options */}
          <div className="pt-2 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Matrix Strategy</Label>
              <Switch checked={enableMatrix} onCheckedChange={setEnableMatrix} />
            </div>
            {enableMatrix && (
              <div className="space-y-1">
                <Input value={matrixKey} onChange={e => setMatrixKey(e.target.value)} className="h-7 text-xs" placeholder="Key (e.g. node-version)" />
                <Input value={matrixValues} onChange={e => setMatrixValues(e.target.value)} className="h-7 text-xs" placeholder="18, 20, 22" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Dependency Cache</Label>
              <Switch checked={enableCache} onCheckedChange={setEnableCache} />
            </div>
            {enableCache && (
              <Select value={cachePackageManager} onValueChange={setCachePackageManager}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="npm">npm</SelectItem>
                  <SelectItem value="yarn">yarn</SelectItem>
                  <SelectItem value="pnpm">pnpm</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Env Variables</Label>
              <Switch checked={enableEnv} onCheckedChange={setEnableEnv} />
            </div>
            {enableEnv && (
              <Input value={envVars} onChange={e => setEnvVars(e.target.value)} className="h-7 text-xs" placeholder="KEY: value" />
            )}

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Concurrency</Label>
              <Switch checked={enableConcurrency} onCheckedChange={setEnableConcurrency} />
            </div>
          </div>

          {/* Steps */}
          <div className="pt-2 border-t border-border space-y-3">
            <h4 className="text-xs font-semibold text-foreground">Steps</h4>
            {steps.map((step, i) => (
              <div key={i} className="p-2 rounded border border-border bg-muted/30 space-y-1">
                <div className="flex gap-1">
                  <Input value={step.name} onChange={e => updateStep(i, "name", e.target.value)} className="h-7 text-xs flex-1" placeholder="Step name" />
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => removeStep(i)}><Trash2 className="h-3 w-3" /></Button>
                </div>
                {step.uses !== undefined ? (
                  <Input value={step.uses || ""} onChange={e => updateStep(i, "uses", e.target.value)} className="h-7 text-xs" placeholder="uses: action@version" />
                ) : (
                  <Input value={step.run || ""} onChange={e => updateStep(i, "run", e.target.value)} className="h-7 text-xs" placeholder="run: command" />
                )}
              </div>
            ))}
            <Button size="sm" variant="outline" className="text-xs w-full h-7" onClick={addStep}>
              <Plus className="h-3 w-3 mr-1" />Add Step
            </Button>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={() => { navigator.clipboard.writeText(yaml); toast.success("Copied!"); }} size="sm" className="flex-1 text-xs">
              <Copy className="h-3.5 w-3.5 mr-1" /> Copy YAML
            </Button>
            <Button onClick={() => applyTemplate("node-ci")} size="sm" variant="ghost" className="text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="p-2 border-b border-border bg-muted/50 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">.github/workflows/ci.yml</span>
            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => { navigator.clipboard.writeText(yaml); toast.success("Copied!"); }}>
              <Copy className="h-3 w-3 mr-1" />Copy
            </Button>
          </div>
          <pre className="p-4 overflow-auto text-xs font-mono bg-muted/20 text-foreground max-h-[75vh] leading-relaxed whitespace-pre">
            {yaml}
          </pre>
        </div>
      </div>
    </div>
  );
}
