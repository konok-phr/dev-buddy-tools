import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DiscountCalculator() {
  const [price, setPrice] = useState("100");
  const [discount, setDiscount] = useState("20");

  const result = useMemo(() => {
    const p = parseFloat(price), d = parseFloat(discount);
    if (!p || isNaN(d)) return null;
    const saved = p * (d / 100);
    const final_ = p - saved;
    return { saved: saved.toFixed(2), final: final_.toFixed(2) };
  }, [price, discount]);

  return (
    <div className="max-w-md mx-auto">
      <ToolHeader title="Discount Calculator" description="Calculate discounted price and savings" />
      <div className="space-y-3 mb-6">
        <div><Label className="text-sm">Original Price ($)</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} /></div>
        <div><Label className="text-sm">Discount (%)</Label><Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
      </div>
      {result && (
        <div className="border rounded-md p-4 space-y-2">
          <div className="flex justify-between"><span className="text-sm text-muted-foreground">You Save</span><span className="font-semibold text-green-500">${result.saved}</span></div>
          <div className="flex justify-between"><span className="text-sm text-muted-foreground">Final Price</span><span className="text-2xl font-bold text-foreground">${result.final}</span></div>
        </div>
      )}
    </div>
  );
}
