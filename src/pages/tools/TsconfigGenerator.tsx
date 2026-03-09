import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function TsconfigGenerator() {
  const [target, setTarget] = useState("ES2022");
  const [module_, setModule] = useState("ESNext");
  const [strict, setStrict] = useState(true);
  const [jsx, setJsx] = useState(true);
  const [dom, setDom] = useState(true);
  const [output, setOutput] = useState("");

  const generate = () => {
    const lib = ["ESNext"];
    if (dom) lib.push("DOM", "DOM.Iterable");
    const config: any = {
      compilerOptions: {
        target, module: module_, lib, strict,
        esModuleInterop: true, skipLibCheck: true, forceConsistentCasingInFileNames: true,
        resolveJsonModule: true, isolatedModules: true, noEmit: true,
        ...(jsx ? { jsx: "react-jsx" } : {}),
      },
      include: ["src"],
      exclude: ["node_modules"],
    };
    setOutput(JSON.stringify(config, null, 2));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="tsconfig.json Generator" description="Generate TypeScript configuration interactively" />
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div><Label className="text-sm">Target</Label>
          <Select value={target} onValueChange={setTarget}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{["ES2015","ES2018","ES2020","ES2022","ESNext"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select></div>
        <div><Label className="text-sm">Module</Label>
          <Select value={module_} onValueChange={setModule}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{["CommonJS","ESNext","NodeNext"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select></div>
        <div className="flex items-center gap-2"><Switch checked={strict} onCheckedChange={setStrict} /><Label>Strict</Label></div>
        <div className="flex items-center gap-2"><Switch checked={jsx} onCheckedChange={setJsx} /><Label>JSX</Label></div>
        <div className="flex items-center gap-2"><Switch checked={dom} onCheckedChange={setDom} /><Label>DOM</Label></div>
      </div>
      <Button onClick={generate} className="mb-3">Generate</Button>
      <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
      <Textarea value={output} readOnly className="font-mono text-sm h-64" />
    </div>
  );
}
