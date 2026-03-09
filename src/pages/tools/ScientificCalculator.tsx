import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";

const BUTTONS = [
  ["C","(",")","⌫"],
  ["sin","cos","tan","÷"],
  ["7","8","9","×"],
  ["4","5","6","-"],
  ["1","2","3","+"],
  ["0",".","π","="],
  ["√","x²","log","ln"],
];

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");

  const handleClick = (btn: string) => {
    if (btn === "C") { setDisplay("0"); setExpr(""); return; }
    if (btn === "⌫") { setExpr(e => e.slice(0, -1) || ""); setDisplay(d => d.slice(0, -1) || "0"); return; }
    if (btn === "=") {
      try {
        const sanitized = expr
          .replace(/×/g, "*").replace(/÷/g, "/").replace(/π/g, String(Math.PI))
          .replace(/sin\(/g, "Math.sin(").replace(/cos\(/g, "Math.cos(").replace(/tan\(/g, "Math.tan(")
          .replace(/√\(/g, "Math.sqrt(").replace(/log\(/g, "Math.log10(").replace(/ln\(/g, "Math.log(");
        const result = new Function(`return ${sanitized}`)();
        setDisplay(String(+parseFloat(result).toFixed(10)));
        setExpr(String(result));
      } catch { setDisplay("Error"); }
      return;
    }
    if (btn === "x²") { setExpr(e => `(${e})**2`); setDisplay(d => `${d}²`); return; }
    if (["sin","cos","tan","√","log","ln"].includes(btn)) { setExpr(e => e + `${btn}(`); setDisplay(d => (d === "0" ? "" : d) + `${btn}(`); return; }
    if (btn === "π") { setExpr(e => e + "π"); setDisplay(d => (d === "0" ? "" : d) + "π"); return; }
    setExpr(e => e + btn);
    setDisplay(d => d === "0" && btn !== "." ? btn : d + btn);
  };

  return (
    <div className="max-w-xs mx-auto">
      <ToolHeader title="Scientific Calculator" description="Calculator with sin, cos, tan, log, sqrt and more" />
      <div className="border rounded-md p-3 mb-3 text-right">
        <p className="text-xs text-muted-foreground h-4 overflow-hidden">{expr}</p>
        <p className="text-2xl font-mono font-bold text-foreground">{display}</p>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {BUTTONS.flat().map((btn, i) => (
          <Button key={i} variant={btn === "=" ? "default" : ["+","-","×","÷"].includes(btn) ? "secondary" : "outline"} 
            className="h-12 text-base font-mono" onClick={() => handleClick(btn)}>{btn}</Button>
        ))}
      </div>
    </div>
  );
}
