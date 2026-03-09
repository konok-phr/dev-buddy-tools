import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const p = parseFloat(principal), r = parseFloat(rate) / 100 / 12, n = parseFloat(years) * 12;
    if (!p || !r || !n) return null;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    return { emi: emi.toFixed(2), totalPayment: totalPayment.toFixed(2), totalInterest: totalInterest.toFixed(2) };
  }, [principal, rate, years]);

  return (
    <div className="max-w-md mx-auto">
      <ToolHeader title="Loan/EMI Calculator" description="Calculate monthly EMI, total payment and interest" />
      <div className="space-y-3 mb-6">
        <div><Label className="text-sm">Loan Amount</Label><Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} /></div>
        <div><Label className="text-sm">Annual Interest Rate (%)</Label><Input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} /></div>
        <div><Label className="text-sm">Loan Term (years)</Label><Input type="number" value={years} onChange={e => setYears(e.target.value)} /></div>
      </div>
      {result && (
        <div className="border rounded-md p-4 space-y-2">
          <div className="flex justify-between"><span className="text-sm text-muted-foreground">Monthly EMI</span><span className="font-semibold text-foreground">${result.emi}</span></div>
          <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Payment</span><span className="font-semibold text-foreground">${result.totalPayment}</span></div>
          <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Interest</span><span className="font-semibold text-destructive">${result.totalInterest}</span></div>
        </div>
      )}
    </div>
  );
}
