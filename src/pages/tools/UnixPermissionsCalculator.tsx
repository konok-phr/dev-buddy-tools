import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const perms = ["Read", "Write", "Execute"] as const;
const bits = [4, 2, 1];
const roles = ["Owner", "Group", "Others"] as const;

export default function UnixPermissionsCalculator() {
  const [matrix, setMatrix] = useState([
    [true, true, false],
    [true, false, false],
    [true, false, false],
  ]);

  const toggle = (r: number, c: number) => {
    const next = matrix.map(row => [...row]);
    next[r][c] = !next[r][c];
    setMatrix(next);
  };

  const octal = matrix.map(row => row.reduce((s, v, i) => s + (v ? bits[i] : 0), 0)).join("");
  const symbolic = matrix.map(row => (row[0] ? "r" : "-") + (row[1] ? "w" : "-") + (row[2] ? "x" : "-")).join("");

  const fromOctal = (val: string) => {
    if (!/^[0-7]{3}$/.test(val)) return;
    setMatrix(val.split("").map(d => {
      const n = parseInt(d);
      return [!!(n & 4), !!(n & 2), !!(n & 1)];
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Unix Permissions Calculator" description="Calculate chmod values interactively" />
      <div className="space-y-6">
        <div className="rounded-md border border-border bg-card p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs text-muted-foreground pb-2"></th>
                {perms.map(p => <th key={p} className="text-center text-xs text-muted-foreground pb-2">{p}</th>)}
              </tr>
            </thead>
            <tbody>
              {roles.map((role, r) => (
                <tr key={role}>
                  <td className="text-sm text-foreground py-2">{role}</td>
                  {perms.map((_, c) => (
                    <td key={c} className="text-center py-2">
                      <Checkbox checked={matrix[r][c]} onCheckedChange={() => toggle(r, c)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md border border-border bg-card p-3">
            <span className="text-xs text-muted-foreground w-32">Octal</span>
            <code className="text-lg font-mono text-foreground flex-1">{octal}</code>
            <CopyButton text={octal} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-card p-3">
            <span className="text-xs text-muted-foreground w-32">Symbolic</span>
            <code className="text-lg font-mono text-foreground flex-1">-{symbolic}</code>
            <CopyButton text={`-${symbolic}`} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-card p-3">
            <span className="text-xs text-muted-foreground w-32">Command</span>
            <code className="text-sm font-mono text-foreground flex-1">chmod {octal} filename</code>
            <CopyButton text={`chmod ${octal} filename`} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Set from octal:</span>
          <Input className="w-24 font-mono bg-card" maxLength={3} placeholder="755" onChange={e => fromOctal(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
