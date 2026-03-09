import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LENGTH = [
  { id: "mm", label: "Millimeter", factor: 0.001 },
  { id: "cm", label: "Centimeter", factor: 0.01 },
  { id: "m", label: "Meter", factor: 1 },
  { id: "km", label: "Kilometer", factor: 1000 },
  { id: "in", label: "Inch", factor: 0.0254 },
  { id: "ft", label: "Foot", factor: 0.3048 },
  { id: "yd", label: "Yard", factor: 0.9144 },
  { id: "mi", label: "Mile", factor: 1609.344 },
];

const WEIGHT = [
  { id: "mg", label: "Milligram", factor: 0.000001 },
  { id: "g", label: "Gram", factor: 0.001 },
  { id: "kg", label: "Kilogram", factor: 1 },
  { id: "t", label: "Metric Ton", factor: 1000 },
  { id: "oz", label: "Ounce", factor: 0.0283495 },
  { id: "lb", label: "Pound", factor: 0.453592 },
];

const TEMP_IDS = ["c", "f", "k"] as const;
function convertTemp(val: number, from: string, to: string): number {
  let celsius = from === "f" ? (val - 32) * 5/9 : from === "k" ? val - 273.15 : val;
  if (to === "f") return celsius * 9/5 + 32;
  if (to === "k") return celsius + 273.15;
  return celsius;
}

const SPEED = [
  { id: "mps", label: "m/s", factor: 1 },
  { id: "kph", label: "km/h", factor: 1/3.6 },
  { id: "mph", label: "mph", factor: 0.44704 },
  { id: "knot", label: "Knot", factor: 0.514444 },
];

const AREA = [
  { id: "sqm", label: "m²", factor: 1 },
  { id: "sqkm", label: "km²", factor: 1e6 },
  { id: "sqft", label: "ft²", factor: 0.092903 },
  { id: "acre", label: "Acre", factor: 4046.86 },
  { id: "ha", label: "Hectare", factor: 10000 },
];

function Converter({ units, label }: { units: { id: string; label: string; factor: number }[]; label: string }) {
  const [from, setFrom] = useState(units[0].id);
  const [to, setTo] = useState(units[2]?.id || units[1].id);
  const [val, setVal] = useState("1");

  const fromUnit = units.find(u => u.id === from)!;
  const toUnit = units.find(u => u.id === to)!;
  const result = (parseFloat(val || "0") * fromUnit.factor) / toUnit.factor;

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Value</label>
          <Input value={val} onChange={e => setVal(e.target.value)} type="number" className="font-mono" />
        </div>
        <Select value={from} onValueChange={setFrom}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>{units.map(u => <SelectItem key={u.id} value={u.id}>{u.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Result</label>
          <Input value={isNaN(result) ? "" : result.toPrecision(8).replace(/\.?0+$/, "")} readOnly className="font-mono bg-muted" />
        </div>
        <Select value={to} onValueChange={setTo}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>{units.map(u => <SelectItem key={u.id} value={u.id}>{u.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
}

function TempConverter() {
  const [from, setFrom] = useState("c");
  const [to, setTo] = useState("f");
  const [val, setVal] = useState("100");
  const result = convertTemp(parseFloat(val || "0"), from, to);
  const labels: Record<string, string> = { c: "Celsius (°C)", f: "Fahrenheit (°F)", k: "Kelvin (K)" };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Value</label>
          <Input value={val} onChange={e => setVal(e.target.value)} type="number" className="font-mono" />
        </div>
        <Select value={from} onValueChange={setFrom}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>{TEMP_IDS.map(id => <SelectItem key={id} value={id}>{labels[id]}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Result</label>
          <Input value={isNaN(result) ? "" : result.toFixed(2)} readOnly className="font-mono bg-muted" />
        </div>
        <Select value={to} onValueChange={setTo}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>{TEMP_IDS.map(id => <SelectItem key={id} value={id}>{labels[id]}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default function UnitConverter() {
  return (
    <div className="max-w-xl mx-auto">
      <ToolHeader title="Unit Converter" description="Convert between length, weight, temperature, speed and area units" />
      <Tabs defaultValue="length" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="length" className="flex-1">Length</TabsTrigger>
          <TabsTrigger value="weight" className="flex-1">Weight</TabsTrigger>
          <TabsTrigger value="temp" className="flex-1">Temp</TabsTrigger>
          <TabsTrigger value="speed" className="flex-1">Speed</TabsTrigger>
          <TabsTrigger value="area" className="flex-1">Area</TabsTrigger>
        </TabsList>
        <TabsContent value="length"><Converter units={LENGTH} label="Length" /></TabsContent>
        <TabsContent value="weight"><Converter units={WEIGHT} label="Weight" /></TabsContent>
        <TabsContent value="temp"><TempConverter /></TabsContent>
        <TabsContent value="speed"><Converter units={SPEED} label="Speed" /></TabsContent>
        <TabsContent value="area"><Converter units={AREA} label="Area" /></TabsContent>
      </Tabs>
    </div>
  );
}
