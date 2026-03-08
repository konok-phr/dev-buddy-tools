import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function genWords(n: number) {
  const r: string[] = [];
  for (let i = 0; i < n; i++) r.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  r[0] = r[0].charAt(0).toUpperCase() + r[0].slice(1);
  return r.join(" ") + ".";
}

function genSentences(n: number) {
  return Array.from({ length: n }, () => genWords(8 + Math.floor(Math.random() * 12))).join(" ");
}

function genParagraphs(n: number) {
  return Array.from({ length: n }, () => genSentences(4 + Math.floor(Math.random() * 4))).join("\n\n");
}

export default function LoremIpsum() {
  const [count, setCount] = useState("3");
  const [type, setType] = useState("paragraphs");
  const [output, setOutput] = useState("");

  const generate = () => {
    const n = Math.max(parseInt(count) || 1, 1);
    switch (type) {
      case "words": setOutput(genWords(n)); break;
      case "sentences": setOutput(genSentences(n)); break;
      case "paragraphs": setOutput(genParagraphs(n)); break;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Lorem Ipsum Generator" description="Generate placeholder text" />
      <div className="flex gap-2 mb-4">
        <Input type="number" value={count} onChange={e => setCount(e.target.value)} className="w-20 bg-card" />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[140px] bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraphs">Paragraphs</SelectItem>
            <SelectItem value="sentences">Sentences</SelectItem>
            <SelectItem value="words">Words</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={generate}>Generate</Button>
      </div>
      {output && (
        <div>
          <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
          <div className="bg-card border border-border rounded-md p-4 text-sm text-foreground whitespace-pre-wrap">{output}</div>
        </div>
      )}
    </div>
  );
}
