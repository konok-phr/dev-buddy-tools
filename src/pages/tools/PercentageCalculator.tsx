import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function PercentageCalculator() {
  const [a1, setA1] = useState("25");
  const [a2, setA2] = useState("200");
  const [b1, setB1] = useState("50");
  const [b2, setB2] = useState("200");
  const [c1, setC1] = useState("100");
  const [c2, setC2] = useState("150");
  const [d1, setD1] = useState("200");
  const [d2, setD2] = useState("15");

  const r1 = (parseFloat(a1) / 100) * parseFloat(a2);
  const r2 = (parseFloat(b1) / parseFloat(b2)) * 100;
  const r3 = ((parseFloat(c2) - parseFloat(c1)) / parseFloat(c1)) * 100;
  const r4 = parseFloat(d1) + (parseFloat(d1) * parseFloat(d2)) / 100;
  const r4b = parseFloat(d1) - (parseFloat(d1) * parseFloat(d2)) / 100;

  return (
    <div className="max-w-xl mx-auto">
      <ToolHeader title="Percentage Calculator" description="Calculate percentages, percentage of, change, increase and decrease" />
      <div className="space-y-6">
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">What is X% of Y?</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">What is</span>
            <Input value={a1} onChange={e => setA1(e.target.value)} type="number" className="w-20 font-mono" />
            <span className="text-sm text-muted-foreground">% of</span>
            <Input value={a2} onChange={e => setA2(e.target.value)} type="number" className="w-24 font-mono" />
            <span className="text-sm text-muted-foreground">=</span>
            <Badge variant="secondary" className="text-sm font-mono">{isNaN(r1) ? "—" : r1.toFixed(2)}</Badge>
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">X is what % of Y?</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Input value={b1} onChange={e => setB1(e.target.value)} type="number" className="w-24 font-mono" />
            <span className="text-sm text-muted-foreground">is what % of</span>
            <Input value={b2} onChange={e => setB2(e.target.value)} type="number" className="w-24 font-mono" />
            <span className="text-sm text-muted-foreground">=</span>
            <Badge variant="secondary" className="text-sm font-mono">{isNaN(r2) ? "—" : r2.toFixed(2)}%</Badge>
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Percentage Change</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">From</span>
            <Input value={c1} onChange={e => setC1(e.target.value)} type="number" className="w-24 font-mono" />
            <span className="text-sm text-muted-foreground">to</span>
            <Input value={c2} onChange={e => setC2(e.target.value)} type="number" className="w-24 font-mono" />
            <span className="text-sm text-muted-foreground">=</span>
            <Badge variant={r3 >= 0 ? "default" : "destructive"} className="text-sm font-mono">{isNaN(r3) ? "—" : (r3 > 0 ? "+" : "") + r3.toFixed(2)}%</Badge>
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Increase / Decrease by %</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Input value={d1} onChange={e => setD1(e.target.value)} type="number" className="w-24 font-mono" />
            <span className="text-sm text-muted-foreground">±</span>
            <Input value={d2} onChange={e => setD2(e.target.value)} type="number" className="w-20 font-mono" />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
          <div className="flex gap-3">
            <Badge variant="default" className="text-sm font-mono">↑ {isNaN(r4) ? "—" : r4.toFixed(2)}</Badge>
            <Badge variant="secondary" className="text-sm font-mono">↓ {isNaN(r4b) ? "—" : r4b.toFixed(2)}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
