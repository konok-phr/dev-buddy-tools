import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function EslintConfigGenerator() {
  const [ts, setTs] = useState(true);
  const [react, setReact] = useState(true);
  const [prettier, setPrettier] = useState(true);
  const [node, setNode] = useState(false);
  const [output, setOutput] = useState("");

  const generate = () => {
    const ext = [ts ? "@typescript-eslint/recommended" : null, react ? "plugin:react/recommended" : null, react ? "plugin:react-hooks/recommended" : null, prettier ? "prettier" : null].filter(Boolean);
    const plugins = [ts ? "@typescript-eslint" : null, react ? "react" : null].filter(Boolean);
    const env: any = { browser: true, es2021: true };
    if (node) env.node = true;
    const config = {
      env,
      parser: ts ? "@typescript-eslint/parser" : undefined,
      parserOptions: { ecmaVersion: "latest", sourceType: "module", ...(react ? { ecmaFeatures: { jsx: true } } : {}) },
      plugins,
      extends: ext,
      rules: { "no-console": "warn", "no-unused-vars": ts ? "off" : "warn", ...(ts ? { "@typescript-eslint/no-unused-vars": "warn" } : {}) },
    };
    setOutput(JSON.stringify(config, null, 2));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="ESLint Config Generator" description="Generate .eslintrc.json configuration interactively" />
      <div className="flex flex-wrap gap-6 mb-4">
        <div className="flex items-center gap-2"><Switch checked={ts} onCheckedChange={setTs} /><Label>TypeScript</Label></div>
        <div className="flex items-center gap-2"><Switch checked={react} onCheckedChange={setReact} /><Label>React</Label></div>
        <div className="flex items-center gap-2"><Switch checked={prettier} onCheckedChange={setPrettier} /><Label>Prettier</Label></div>
        <div className="flex items-center gap-2"><Switch checked={node} onCheckedChange={setNode} /><Label>Node.js</Label></div>
      </div>
      <Button onClick={generate} className="mb-3">Generate Config</Button>
      <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
      <Textarea value={output} readOnly className="font-mono text-sm h-64" />
    </div>
  );
}
