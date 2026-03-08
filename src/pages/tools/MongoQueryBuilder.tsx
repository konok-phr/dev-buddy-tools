import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Copy, Braces } from "lucide-react";
import { toast } from "sonner";

type Operator = "$eq" | "$ne" | "$gt" | "$gte" | "$lt" | "$lte" | "$in" | "$regex" | "$exists";
type LogicalOp = "$and" | "$or";

interface FilterRow {
  id: string;
  field: string;
  operator: Operator;
  value: string;
}

interface SortRow {
  id: string;
  field: string;
  order: 1 | -1;
}

interface ProjectionRow {
  id: string;
  field: string;
  include: boolean;
}

interface AggStage {
  id: string;
  type: string;
  value: string;
}

const OPERATORS: { value: Operator; label: string }[] = [
  { value: "$eq", label: "= (equals)" },
  { value: "$ne", label: "≠ (not equal)" },
  { value: "$gt", label: "> (greater)" },
  { value: "$gte", label: "≥ (greater or eq)" },
  { value: "$lt", label: "< (less)" },
  { value: "$lte", label: "≤ (less or eq)" },
  { value: "$in", label: "$in (array)" },
  { value: "$regex", label: "$regex (pattern)" },
  { value: "$exists", label: "$exists" },
];

const AGG_STAGES = ["$match", "$group", "$sort", "$project", "$limit", "$skip", "$unwind", "$lookup", "$addFields"];

const uid = () => Math.random().toString(36).slice(2, 8);

function parseValue(val: string): any {
  const trimmed = val.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try { return JSON.parse(trimmed); } catch { return trimmed; }
  }
  return trimmed;
}

export default function MongoQueryBuilder() {
  const [tab, setTab] = useState<"find" | "aggregate">("find");
  const [collection, setCollection] = useState("users");
  const [logicalOp, setLogicalOp] = useState<LogicalOp>("$and");
  const [filters, setFilters] = useState<FilterRow[]>([
    { id: uid(), field: "age", operator: "$gte", value: "18" },
    { id: uid(), field: "status", operator: "$eq", value: "active" },
  ]);
  const [sorts, setSorts] = useState<SortRow[]>([
    { id: uid(), field: "createdAt", order: -1 },
  ]);
  const [projections, setProjections] = useState<ProjectionRow[]>([
    { id: uid(), field: "name", include: true },
    { id: uid(), field: "email", include: true },
  ]);
  const [limit, setLimit] = useState("20");
  const [skip, setSkip] = useState("0");

  const [aggStages, setAggStages] = useState<AggStage[]>([
    { id: uid(), type: "$match", value: '{ "status": "active" }' },
    { id: uid(), type: "$group", value: '{ "_id": "$city", "count": { "$sum": 1 } }' },
    { id: uid(), type: "$sort", value: '{ "count": -1 }' },
  ]);

  // Build find query
  const findQuery = useMemo(() => {
    const filterObj: Record<string, any> = {};
    const conditions: any[] = [];

    for (const f of filters) {
      if (!f.field) continue;
      let val: any = parseValue(f.value);
      if (f.operator === "$exists") val = val === "false" ? false : true;
      if (f.operator === "$eq") {
        conditions.push({ [f.field]: val });
      } else {
        conditions.push({ [f.field]: { [f.operator]: val } });
      }
    }

    const query = conditions.length > 1
      ? { [logicalOp]: conditions }
      : conditions.length === 1 ? conditions[0] : {};

    const sortObj: Record<string, number> = {};
    for (const s of sorts) {
      if (s.field) sortObj[s.field] = s.order;
    }

    const projObj: Record<string, number> = {};
    for (const p of projections) {
      if (p.field) projObj[p.field] = p.include ? 1 : 0;
    }

    let code = `db.${collection}.find(\n  ${JSON.stringify(query, null, 2).replace(/\n/g, "\n  ")}`;
    if (Object.keys(projObj).length > 0) {
      code += `,\n  ${JSON.stringify(projObj, null, 2).replace(/\n/g, "\n  ")}`;
    }
    code += "\n)";
    if (Object.keys(sortObj).length > 0) code += `\n  .sort(${JSON.stringify(sortObj)})`;
    if (skip && skip !== "0") code += `\n  .skip(${skip})`;
    if (limit) code += `\n  .limit(${limit})`;
    code += ";";
    return code;
  }, [collection, filters, logicalOp, sorts, projections, limit, skip]);

  // Build aggregation pipeline
  const aggQuery = useMemo(() => {
    const stages: string[] = [];
    for (const s of aggStages) {
      try {
        const parsed = JSON.parse(s.value);
        stages.push(`  { "${s.type}": ${JSON.stringify(parsed, null, 4).replace(/\n/g, "\n  ")} }`);
      } catch {
        stages.push(`  { "${s.type}": ${s.value} }`);
      }
    }
    return `db.${collection}.aggregate([\n${stages.join(",\n")}\n]);`;
  }, [collection, aggStages]);

  const output = tab === "find" ? findQuery : aggQuery;

  const addFilter = () => setFilters([...filters, { id: uid(), field: "", operator: "$eq", value: "" }]);
  const removeFilter = (id: string) => setFilters(filters.filter(f => f.id !== id));
  const updateFilter = (id: string, key: keyof FilterRow, val: string) =>
    setFilters(filters.map(f => f.id === id ? { ...f, [key]: val } : f));

  const addSort = () => setSorts([...sorts, { id: uid(), field: "", order: 1 }]);
  const addProjection = () => setProjections([...projections, { id: uid(), field: "", include: true }]);
  const addAggStage = () => setAggStages([...aggStages, { id: uid(), type: "$match", value: "{}" }]);

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader title="MongoDB Query Builder" description="Visually build MongoDB find queries and aggregation pipelines" />

      <div className="space-y-4">
        {/* Collection + Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Collection:</label>
            <Input value={collection} onChange={e => setCollection(e.target.value)} className="w-40 h-8" />
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setTab("find")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${tab === "find" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              find()
            </button>
            <button
              onClick={() => setTab("aggregate")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${tab === "aggregate" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              aggregate()
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Builder */}
          <div className="space-y-4">
            {tab === "find" ? (
              <>
                {/* Filters */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Filters</label>
                    <div className="flex items-center gap-2">
                      <Select value={logicalOp} onValueChange={v => setLogicalOp(v as LogicalOp)}>
                        <SelectTrigger className="h-7 w-20 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$and">$and</SelectItem>
                          <SelectItem value="$or">$or</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={addFilter}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {filters.map(f => (
                    <div key={f.id} className="flex gap-1.5 items-center">
                      <Input value={f.field} onChange={e => updateFilter(f.id, "field", e.target.value)} placeholder="field" className="h-8 text-xs flex-1" />
                      <Select value={f.operator} onValueChange={v => updateFilter(f.id, "operator", v)}>
                        <SelectTrigger className="h-8 w-[130px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map(op => (
                            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input value={f.value} onChange={e => updateFilter(f.id, "value", e.target.value)} placeholder="value" className="h-8 text-xs flex-1" />
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeFilter(f.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Sort</label>
                    <Button variant="outline" size="sm" onClick={addSort}><Plus className="h-3 w-3" /></Button>
                  </div>
                  {sorts.map((s, i) => (
                    <div key={s.id} className="flex gap-1.5 items-center">
                      <Input value={s.field} onChange={e => setSorts(sorts.map(x => x.id === s.id ? { ...x, field: e.target.value } : x))} placeholder="field" className="h-8 text-xs flex-1" />
                      <Select value={String(s.order)} onValueChange={v => setSorts(sorts.map(x => x.id === s.id ? { ...x, order: Number(v) as 1 | -1 } : x))}>
                        <SelectTrigger className="h-8 w-24 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Asc (1)</SelectItem>
                          <SelectItem value="-1">Desc (-1)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSorts(sorts.filter(x => x.id !== s.id))}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Projection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Projection</label>
                    <Button variant="outline" size="sm" onClick={addProjection}><Plus className="h-3 w-3" /></Button>
                  </div>
                  {projections.map(p => (
                    <div key={p.id} className="flex gap-1.5 items-center">
                      <Input value={p.field} onChange={e => setProjections(projections.map(x => x.id === p.id ? { ...x, field: e.target.value } : x))} placeholder="field" className="h-8 text-xs flex-1" />
                      <Select value={p.include ? "1" : "0"} onValueChange={v => setProjections(projections.map(x => x.id === p.id ? { ...x, include: v === "1" } : x))}>
                        <SelectTrigger className="h-8 w-24 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Include</SelectItem>
                          <SelectItem value="0">Exclude</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setProjections(projections.filter(x => x.id !== p.id))}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Limit/Skip */}
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">Limit:</label>
                    <Input value={limit} onChange={e => setLimit(e.target.value)} className="h-8 w-20 text-xs" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">Skip:</label>
                    <Input value={skip} onChange={e => setSkip(e.target.value)} className="h-8 w-20 text-xs" />
                  </div>
                </div>
              </>
            ) : (
              /* Aggregation Pipeline */
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Pipeline Stages</label>
                  <Button variant="outline" size="sm" onClick={addAggStage}><Plus className="h-3 w-3 mr-1" /> Stage</Button>
                </div>
                {aggStages.map((s, i) => (
                  <div key={s.id} className="space-y-1 border border-border rounded-lg p-2 bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                        <Select value={s.type} onValueChange={v => setAggStages(aggStages.map(x => x.id === s.id ? { ...x, type: v } : x))}>
                          <SelectTrigger className="h-7 w-32 text-xs font-mono">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {AGG_STAGES.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAggStages(aggStages.filter(x => x.id !== s.id))}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      value={s.value}
                      onChange={e => setAggStages(aggStages.map(x => x.id === s.id ? { ...x, value: e.target.value } : x))}
                      className="h-8 text-xs font-mono"
                      placeholder='{ "field": "value" }'
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Braces className="h-4 w-4 text-primary" /> Generated Query
              </label>
              <CopyButton text={output} />
            </div>
            <pre className="bg-card border border-border rounded-lg p-4 text-sm font-mono overflow-auto max-h-[500px] whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
