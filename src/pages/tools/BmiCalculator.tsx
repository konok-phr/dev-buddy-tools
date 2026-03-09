import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BmiCalculator() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h || h <= 0) return null;
    const bmi = w / (h * h);
    let category = "Obese";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    const idealMin = (18.5 * h * h).toFixed(1);
    const idealMax = (24.9 * h * h).toFixed(1);
    return { bmi: bmi.toFixed(1), category, idealMin, idealMax };
  }, [weight, height]);

  const getColor = (cat: string) => {
    if (cat === "Normal weight") return "text-green-500";
    if (cat === "Underweight") return "text-yellow-500";
    return "text-destructive";
  };

  return (
    <div className="max-w-md mx-auto">
      <ToolHeader title="BMI Calculator" description="Calculate Body Mass Index from weight and height" />
      <div className="space-y-3 mb-6">
        <div><Label className="text-sm">Weight (kg)</Label><Input type="number" value={weight} onChange={e => setWeight(e.target.value)} /></div>
        <div><Label className="text-sm">Height (cm)</Label><Input type="number" value={height} onChange={e => setHeight(e.target.value)} /></div>
      </div>
      {result && (
        <div className="border rounded-md p-4 space-y-3">
          <div className="text-center">
            <p className="text-4xl font-bold text-foreground">{result.bmi}</p>
            <p className={`text-lg font-semibold ${getColor(result.category)}`}>{result.category}</p>
          </div>
          <p className="text-sm text-muted-foreground text-center">Ideal weight range: {result.idealMin} – {result.idealMax} kg</p>
        </div>
      )}
    </div>
  );
}
