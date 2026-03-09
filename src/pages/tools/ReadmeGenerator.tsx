import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ReadmeGenerator() {
  const [name, setName] = useState("My Project");
  const [desc, setDesc] = useState("A brief description of your project.");
  const [install, setInstall] = useState("npm install my-project");
  const [usage, setUsage] = useState("npx my-project");
  const [license, setLicense] = useState("MIT");
  const [author, setAuthor] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(`# ${name}

${desc}

## Installation

\`\`\`bash
${install}
\`\`\`

## Usage

\`\`\`bash
${usage}
\`\`\`

## License

${license}${author ? `\n\n## Author\n\n${author}` : ""}
`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="README Generator" description="Generate a README.md file for your project" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div><Label className="text-sm">Project Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
        <div><Label className="text-sm">License</Label><Input value={license} onChange={e => setLicense(e.target.value)} /></div>
        <div><Label className="text-sm">Author</Label><Input value={author} onChange={e => setAuthor(e.target.value)} /></div>
      </div>
      <div className="space-y-3 mb-4">
        <div><Label className="text-sm">Description</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} className="h-16" /></div>
        <div><Label className="text-sm">Install Command</Label><Input value={install} onChange={e => setInstall(e.target.value)} className="font-mono text-sm" /></div>
        <div><Label className="text-sm">Usage Command</Label><Input value={usage} onChange={e => setUsage(e.target.value)} className="font-mono text-sm" /></div>
      </div>
      <Button onClick={generate} className="mb-3">Generate README</Button>
      <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
      <Textarea value={output} readOnly className="font-mono text-sm h-64" />
    </div>
  );
}
