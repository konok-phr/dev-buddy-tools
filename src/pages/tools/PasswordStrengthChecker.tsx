import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, ShieldAlert, Shield, ShieldX, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

function analyzePassword(pw: string) {
  const checks = {
    length8: pw.length >= 8,
    length12: pw.length >= 12,
    length16: pw.length >= 16,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
    noRepeats: !/(.)\1{2,}/.test(pw),
    noSequential: !/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(pw),
    noCommon: !["password", "123456", "qwerty", "abc123", "admin", "letmein", "welcome", "monkey"].includes(pw.toLowerCase()),
  };

  let score = 0;
  if (checks.length8) score += 10;
  if (checks.length12) score += 15;
  if (checks.length16) score += 10;
  if (checks.upper) score += 15;
  if (checks.lower) score += 10;
  if (checks.digit) score += 15;
  if (checks.special) score += 15;
  if (checks.noRepeats) score += 5;
  if (checks.noSequential) score += 5;
  if (!checks.noCommon) score = Math.min(score, 10);

  const uniqueChars = new Set(pw).size;
  if (uniqueChars >= pw.length * 0.7) score = Math.min(100, score + 5);

  let entropy = 0;
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/\d/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 33;
  if (pool > 0) entropy = Math.round(pw.length * Math.log2(pool));

  let crackTime = "";
  const guesses = Math.pow(2, entropy);
  const rate = 1e10;
  const seconds = guesses / rate;
  if (seconds < 1) crackTime = "Instant";
  else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
  else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
  else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
  else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
  else if (seconds < 31536000 * 1000) crackTime = `${Math.round(seconds / 31536000)} years`;
  else crackTime = "Millions of years";

  let label = "Very Weak";
  let color = "text-destructive";
  if (score >= 80) { label = "Very Strong"; color = "text-primary"; }
  else if (score >= 60) { label = "Strong"; color = "text-primary"; }
  else if (score >= 40) { label = "Moderate"; color = "text-accent-foreground"; }
  else if (score >= 20) { label = "Weak"; color = "text-destructive"; }

  return { checks, score: Math.min(100, score), label, color, entropy, crackTime };
}

export default function PasswordStrengthChecker() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const analysis = pw ? analyzePassword(pw) : null;

  const criteria = analysis ? [
    { label: "At least 8 characters", pass: analysis.checks.length8 },
    { label: "At least 12 characters", pass: analysis.checks.length12 },
    { label: "Uppercase letter (A-Z)", pass: analysis.checks.upper },
    { label: "Lowercase letter (a-z)", pass: analysis.checks.lower },
    { label: "Number (0-9)", pass: analysis.checks.digit },
    { label: "Special character (!@#$...)", pass: analysis.checks.special },
    { label: "No repeated characters (aaa)", pass: analysis.checks.noRepeats },
    { label: "No sequential patterns (abc, 123)", pass: analysis.checks.noSequential },
    { label: "Not a common password", pass: analysis.checks.noCommon },
  ] : [];

  return (
    <div className="max-w-xl mx-auto">
      <ToolHeader title="Password Strength Checker" description="Analyze password strength, entropy and estimated crack time" />
      <div className="relative mb-4">
        <Input value={pw} onChange={e => setPw(e.target.value)} type={show ? "text" : "password"} placeholder="Enter password to check..." className="font-mono text-sm pr-10" />
        <Button variant="ghost" size="sm" onClick={() => setShow(!show)} className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {analysis && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {analysis.score >= 80 ? <ShieldCheck className="h-6 w-6 text-primary" /> :
             analysis.score >= 60 ? <Shield className="h-6 w-6 text-primary" /> :
             analysis.score >= 40 ? <ShieldAlert className="h-6 w-6 text-accent-foreground" /> :
             <ShieldX className="h-6 w-6 text-destructive" />}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-semibold ${analysis.color}`}>{analysis.label}</span>
                <span className="text-xs text-muted-foreground">{analysis.score}/100</span>
              </div>
              <Progress value={analysis.score} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Entropy</p>
              <p className="text-lg font-semibold text-foreground">{analysis.entropy} bits</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Crack Time (10B/s)</p>
              <p className="text-lg font-semibold text-foreground">{analysis.crackTime}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">Criteria</h3>
            {criteria.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <Badge variant={c.pass ? "default" : "outline"} className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {c.pass ? "✓" : "✗"}
                </Badge>
                <span className={`text-sm ${c.pass ? "text-foreground" : "text-muted-foreground"}`}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
