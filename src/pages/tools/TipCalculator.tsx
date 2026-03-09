import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const TIP_PRESETS = [10, 15, 18, 20, 25];

export default function TipCalculator() {
  const [bill, setBill] = useState("50");
  const [tipPct, setTipPct] = useState(15);
  const [people, setPeople] = useState("1");

  const result = useMemo(() => {
    const b = parseFloat(bill), p = parseInt(people) || 1;
    if (!b) return null;
    const tip = b * (tipPct / 100);
    const total = b + tip;
    return { tip: tip.toFixed(2), total: total.toFixed(2), perPerson: (total / p).toFixed(2), tipPerPerson: (tip / p).toFixed(2) };
  }, [bill, tipPct, people]);

  return (
    <div className="max-w-md mx-auto">
      <ToolHeader title="Tip Calculator" description="Calculate tip amount and split between people" />
      <div className="space-y-3 mb-4">
        <div><Label className="text-sm">Bill Amount ($)</Label><Input type="number" value={bill} onChange={e => setBill(e.target.value)} /></div>
        <div>
          <Label className="text-sm">Tip: {tipPct}%</Label>
          <div className="flex gap-2 mt-1">{TIP_PRESETS.map(p => (
            <Button key={p} size="sm" variant={tipPct === p ? "default" : "outline"} onClick={() => setTipPct(p)}>{p}%</Button>
          ))}</div>
        </div>
        <div><Label className="text-sm">Split Between</Label><Input type="number" min={1} value={people} onChange={e => setPeople(e.target.value)} /></div>
      </div>
      {result && (
        <div className="border rounded-md p-4 space-y-2">
          <div className="flex justify-between"><span className="text-sm text-muted-foreground">Tip Amount</span><span className="font-semibold text-foreground">${result.tip}</span></div>
          <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total</span><span className="font-semibold text-foreground">${result.total}</span></div>
          <div className="flex justify-between"><span className="text-sm text-muted-foreground">Per Person</span><span className="font-bold text-primary">${result.perPerson}</span></div>
        </div>
      )}
    </div>
  );
}
