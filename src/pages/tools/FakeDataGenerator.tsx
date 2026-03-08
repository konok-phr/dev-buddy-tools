import { useState, useCallback } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";

const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen", "Daniel", "Lisa", "Matthew", "Nancy", "Anthony", "Betty", "Mark", "Margaret", "Alex", "Sandra", "Emily", "Oliver", "Emma", "Liam", "Sophia", "Noah", "Ava", "Isabella", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn", "Luna", "Ella", "Aiden", "Lucas", "Mason", "Ethan", "Logan"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"];
const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "protonmail.com", "icloud.com", "mail.com", "fastmail.com", "zoho.com", "aol.com"];
const streets = ["Main St", "Oak Ave", "Maple Dr", "Cedar Ln", "Pine Rd", "Elm St", "Washington Blvd", "Park Ave", "Broadway", "Highland Dr", "Sunset Blvd", "Lake St", "Hill Rd", "River Rd", "Forest Ave", "Spring St", "Valley Dr", "Church St"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "San Antonio", "San Diego", "Dallas", "Austin", "Jacksonville", "San Francisco", "Seattle", "Denver", "Boston", "Nashville", "Portland", "Las Vegas", "Miami", "Atlanta", "Minneapolis"];
const states = ["CA", "TX", "NY", "FL", "IL", "PA", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MO", "MD", "WI"];
const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan", "Brazil", "India", "Mexico"];
const companies = ["Acme Corp", "Globex", "Initech", "Umbrella Corp", "Stark Industries", "Wayne Enterprises", "Cyberdyne", "Weyland-Yutani", "Soylent Corp", "Tyrell Corp", "Aperture Science", "Massive Dynamic", "Oscorp", "LexCorp", "Wonka Industries"];
const jobTitles = ["Software Engineer", "Product Manager", "Designer", "Data Analyst", "Marketing Manager", "DevOps Engineer", "QA Engineer", "CTO", "CEO", "Frontend Developer", "Backend Developer", "Full Stack Developer", "UX Researcher", "Project Manager", "Sales Executive"];

const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randPhone = () => `+1 (${randInt(200, 999)}) ${randInt(200, 999)}-${String(randInt(0, 9999)).padStart(4, "0")}`;
const randDate = (start: number, end: number) => new Date(start + Math.random() * (end - start)).toISOString().split("T")[0];
const randIP = () => `${randInt(1, 255)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
const randUUID = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); });
const randColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
const randUrl = () => `https://${rand(["www.", "app.", "api.", "docs."])}${rand(lastNames).toLowerCase()}.${rand(["com", "io", "dev", "org", "net"])}`;
const randCreditCard = () => `${randInt(4000, 4999)}-${randInt(1000, 9999)}-${randInt(1000, 9999)}-${randInt(1000, 9999)}`;

type FieldType = "name" | "email" | "phone" | "address" | "company" | "job" | "date" | "ip" | "uuid" | "color" | "url" | "creditcard" | "number" | "boolean";

const allFields: { id: FieldType; label: string }[] = [
  { id: "name", label: "Full Name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "address", label: "Address" },
  { id: "company", label: "Company" },
  { id: "job", label: "Job Title" },
  { id: "date", label: "Date" },
  { id: "ip", label: "IP Address" },
  { id: "uuid", label: "UUID" },
  { id: "color", label: "Color (Hex)" },
  { id: "url", label: "URL" },
  { id: "creditcard", label: "Credit Card" },
  { id: "number", label: "Number" },
  { id: "boolean", label: "Boolean" },
];

function generateField(type: FieldType): string {
  const fn = rand(firstNames), ln = rand(lastNames);
  switch (type) {
    case "name": return `${fn} ${ln}`;
    case "email": return `${fn.toLowerCase()}.${ln.toLowerCase()}@${rand(domains)}`;
    case "phone": return randPhone();
    case "address": return `${randInt(1, 9999)} ${rand(streets)}, ${rand(cities)}, ${rand(states)} ${randInt(10000, 99999)}`;
    case "company": return rand(companies);
    case "job": return rand(jobTitles);
    case "date": return randDate(new Date("1970-01-01").getTime(), Date.now());
    case "ip": return randIP();
    case "uuid": return randUUID();
    case "color": return randColor();
    case "url": return randUrl();
    case "creditcard": return randCreditCard();
    case "number": return String(randInt(1, 10000));
    case "boolean": return Math.random() > 0.5 ? "true" : "false";
    default: return "";
  }
}

export default function FakeDataGenerator() {
  const [count, setCount] = useState(10);
  const [selectedFields, setSelectedFields] = useState<FieldType[]>(["name", "email", "phone", "address", "company"]);
  const [format, setFormat] = useState<"json" | "csv" | "tsv">("json");
  const [data, setData] = useState<Record<string, string>[]>([]);

  const toggleField = (field: FieldType) => {
    setSelectedFields(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]);
  };

  const generate = useCallback(() => {
    const rows: Record<string, string>[] = [];
    for (let i = 0; i < count; i++) {
      const row: Record<string, string> = {};
      selectedFields.forEach(f => { row[f] = generateField(f); });
      rows.push(row);
    }
    setData(rows);
    toast.success(`Generated ${count} records!`);
  }, [count, selectedFields]);

  const formatOutput = () => {
    if (data.length === 0) return "";
    if (format === "json") return JSON.stringify(data, null, 2);
    const sep = format === "csv" ? "," : "\t";
    const header = selectedFields.join(sep);
    const rows = data.map(row => selectedFields.map(f => {
      const val = row[f] || "";
      return val.includes(sep) || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(sep));
    return [header, ...rows].join("\n");
  };

  const output = formatOutput();

  const copyOutput = () => {
    if (!output) { toast.error("Generate data first!"); return; }
    navigator.clipboard.writeText(output);
    toast.success("Copied!");
  };

  const downloadOutput = () => {
    if (!output) { toast.error("Generate data first!"); return; }
    const ext = format === "json" ? "json" : format === "csv" ? "csv" : "tsv";
    const mime = format === "json" ? "application/json" : "text/plain";
    const blob = new Blob([output], { type: mime });
    const link = document.createElement("a");
    link.download = `fake-data.${ext}`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Downloaded!");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader title="Fake Data Generator" description="Generate realistic fake data for testing and development" />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Settings */}
        <div className="space-y-4 p-4 rounded-lg border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground">Settings</h3>

          <div>
            <Label className="text-xs text-muted-foreground">Number of Records</Label>
            <Input type="number" value={count} onChange={e => setCount(Math.min(1000, Math.max(1, +e.target.value)))} className="mt-1 h-8 text-xs" min={1} max={1000} />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Output Format</Label>
            <Select value={format} onValueChange={v => setFormat(v as any)}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="tsv">TSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Fields</Label>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {allFields.map(f => (
                <div key={f.id} className="flex items-center gap-2">
                  <Checkbox checked={selectedFields.includes(f.id)} onCheckedChange={() => toggleField(f.id)} id={`field-${f.id}`} />
                  <label htmlFor={`field-${f.id}`} className="text-xs text-foreground">{f.label}</label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={generate} size="sm" className="w-full text-xs">
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Generate Data
          </Button>

          <div className="flex gap-2">
            <Button onClick={copyOutput} size="sm" variant="outline" className="flex-1 text-xs">
              <Copy className="h-3.5 w-3.5 mr-1" /> Copy
            </Button>
            <Button onClick={downloadOutput} size="sm" variant="outline" className="flex-1 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" /> Download
            </Button>
          </div>
        </div>

        {/* Output */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="p-2 border-b border-border bg-muted/50 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {data.length > 0 ? `${data.length} records · ${selectedFields.length} fields · ${format.toUpperCase()}` : "Output"}
            </span>
            {data.length > 0 && (
              <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={copyOutput}>
                <Copy className="h-3 w-3 mr-1" />Copy
              </Button>
            )}
          </div>
          {data.length > 0 ? (
            <pre className="p-4 overflow-auto text-xs font-mono bg-muted/20 text-foreground max-h-[75vh] leading-relaxed whitespace-pre">
              {output}
            </pre>
          ) : (
            <div className="p-12 flex items-center justify-center text-muted-foreground text-sm">
              Select fields and click "Generate Data" to create fake records
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
