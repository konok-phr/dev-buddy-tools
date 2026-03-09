import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const firstNames = ["Alice","Bob","Charlie","Diana","Eve","Frank","Grace","Henry","Iris","Jack"];
const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Moore"];
const cities = ["New York","London","Tokyo","Paris","Berlin","Sydney","Toronto","Dubai","Singapore","Mumbai"];
const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function genItem() {
  return {
    id: crypto.randomUUID().slice(0, 8),
    name: `${rand(firstNames)} ${rand(lastNames)}`,
    email: `${rand(firstNames).toLowerCase()}${randInt(1,99)}@example.com`,
    age: randInt(18, 65),
    city: rand(cities),
    active: Math.random() > 0.3,
  };
}

export default function LoremJson() {
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");

  const generate = () => {
    const items = Array.from({ length: count }, genItem);
    setOutput(JSON.stringify(count === 1 ? items[0] : items, null, 2));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Lorem JSON Generator" description="Generate random JSON data for testing and prototyping" />
      <div className="flex gap-3 items-end mb-4">
        <div>
          <Label className="text-sm">Number of items</Label>
          <Input type="number" min={1} max={100} value={count} onChange={e => setCount(+e.target.value)} className="w-24" />
        </div>
        <Button onClick={generate}>Generate</Button>
      </div>
      <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
      <Textarea value={output} readOnly className="font-mono text-sm h-80" placeholder="Click Generate..." />
    </div>
  );
}
