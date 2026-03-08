import { useState, useRef, useCallback, useEffect } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Trash2, Plus, Database, Download, Upload } from "lucide-react";
import { toast } from "sonner";
// sql.js loaded dynamically

const SAMPLE_SETUP = `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  age INTEGER,
  city TEXT
);

INSERT INTO users VALUES (1, 'Alice', 'alice@example.com', 28, 'New York');
INSERT INTO users VALUES (2, 'Bob', 'bob@test.com', 34, 'London');
INSERT INTO users VALUES (3, 'Charlie', 'charlie@dev.io', 22, 'Tokyo');
INSERT INTO users VALUES (4, 'Diana', 'diana@mail.com', 31, 'Paris');
INSERT INTO users VALUES (5, 'Eve', 'eve@corp.net', 27, 'Berlin');

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product TEXT,
  amount REAL,
  date TEXT
);

INSERT INTO orders VALUES (1, 1, 'Laptop', 999.99, '2024-01-15');
INSERT INTO orders VALUES (2, 2, 'Phone', 699.00, '2024-02-20');
INSERT INTO orders VALUES (3, 1, 'Tablet', 449.50, '2024-03-10');
INSERT INTO orders VALUES (4, 3, 'Monitor', 329.00, '2024-03-22');
INSERT INTO orders VALUES (5, 4, 'Keyboard', 89.99, '2024-04-01');`;

const SAMPLE_QUERY = `SELECT u.name, u.city, COUNT(o.id) AS total_orders, SUM(o.amount) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
ORDER BY total_spent DESC;`;

interface QueryResult {
  columns: string[];
  values: any[][];
  rowsAffected?: number;
  time: number;
}

export default function SqlPlayground() {
  const [db, setDb] = useState<SqlDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupSql, setSetupSql] = useState(SAMPLE_SETUP);
  const [query, setQuery] = useState(SAMPLE_QUERY);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [dbReady, setDbReady] = useState(false);

  // Init sql.js
  useEffect(() => {
    const init = async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
        });
        const database = new SQL.Database();
        setDb(database);
        setLoading(false);
      } catch (err) {
        console.error("Failed to init SQL.js:", err);
        toast.error("Failed to initialize SQLite engine");
        setLoading(false);
      }
    };
    init();
    return () => { db?.close(); };
  }, []);

  const runSetup = useCallback(() => {
    if (!db) return;
    try {
      // Reset DB
      db.run("SELECT 1"); // test
      // Drop all tables first
      const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
      if (tables.length > 0) {
        tables[0].values.forEach(([name]) => {
          if (name !== "sqlite_sequence") db.run(`DROP TABLE IF EXISTS "${name}"`);
        });
      }
      db.exec(setupSql);
      setDbReady(true);
      setError("");
      setResults([]);
      toast.success("Database schema created successfully");
    } catch (err: any) {
      setError(err.message);
      toast.error("Setup failed");
    }
  }, [db, setupSql]);

  const runQuery = useCallback(() => {
    if (!db) return;
    setError("");
    const start = performance.now();
    try {
      const res = db.exec(query);
      const time = performance.now() - start;
      if (res.length === 0) {
        setResults([{ columns: [], values: [], rowsAffected: db.getRowsModified(), time }]);
      } else {
        setResults(res.map(r => ({ columns: r.columns, values: r.values, time })));
      }
      setHistory(prev => [query, ...prev.slice(0, 19)]);
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    }
  }, [db, query]);

  const exportDb = () => {
    if (!db) return;
    const data = db.export();
    const blob = new Blob([data], { type: "application/x-sqlite3" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "playground.db";
    a.click();
    toast.success("Database exported");
  };

  const resultsToCsv = (r: QueryResult) => {
    const header = r.columns.join(",");
    const rows = r.values.map(row => row.map(v => {
      const s = String(v ?? "NULL");
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(","));
    return [header, ...rows].join("\n");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <ToolHeader title="SQL Playground" description="Run SQL queries in-browser with SQLite" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          <span className="ml-3 text-muted-foreground">Loading SQLite engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ToolHeader title="SQL Playground" description="Run SQL queries in-browser with SQLite — no server needed" />

      <div className="space-y-4">
        {/* Setup Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" /> Schema Setup (CREATE / INSERT)
            </label>
            <div className="flex gap-2">
              <Button size="sm" onClick={runSetup}>
                <Play className="h-3 w-3 mr-1" /> Run Setup
              </Button>
            </div>
          </div>
          <Textarea
            value={setupSql}
            onChange={e => setSetupSql(e.target.value)}
            className="font-mono text-sm bg-card min-h-[150px] resize-y"
            placeholder="CREATE TABLE ...; INSERT INTO ...;"
          />
        </div>

        {/* Query Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Query</label>
            <div className="flex gap-2">
              {dbReady && (
                <Button variant="outline" size="sm" onClick={exportDb}>
                  <Download className="h-3 w-3 mr-1" /> Export DB
                </Button>
              )}
              <Button size="sm" onClick={runQuery} disabled={!dbReady}>
                <Play className="h-3 w-3 mr-1" /> Run Query
              </Button>
            </div>
          </div>
          <Textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runQuery(); } }}
            className="font-mono text-sm bg-card min-h-[100px] resize-y"
            placeholder="SELECT * FROM users;"
          />
          <p className="text-xs text-muted-foreground">Ctrl+Enter to run</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive font-mono">
            {error}
          </div>
        )}

        {/* Results */}
        {results.map((result, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {result.columns.length > 0
                  ? `${result.values.length} row(s) in ${result.time.toFixed(1)}ms`
                  : `Query executed — ${result.rowsAffected ?? 0} row(s) affected (${result.time.toFixed(1)}ms)`}
              </span>
              {result.columns.length > 0 && <CopyButton text={resultsToCsv(result)} />}
            </div>
            {result.columns.length > 0 && (
              <div className="overflow-auto border rounded-md max-h-[400px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      {result.columns.map((col, ci) => (
                        <th key={ci} className="text-left px-3 py-2 text-xs font-semibold border-b border-border">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.values.map((row, ri) => (
                      <tr key={ri} className="border-t border-border hover:bg-muted/30">
                        {row.map((val, ci) => (
                          <td key={ci} className="px-3 py-1.5 text-xs font-mono">
                            {val === null ? <span className="text-muted-foreground italic">NULL</span> : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">Query History</label>
              <Button variant="ghost" size="sm" onClick={() => setHistory([])}>
                <Trash2 className="h-3 w-3 mr-1" /> Clear
              </Button>
            </div>
            <div className="space-y-1 max-h-[200px] overflow-auto">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(h)}
                  className="block w-full text-left text-xs font-mono p-2 rounded bg-card border border-border hover:border-primary/50 transition-colors truncate"
                >
                  {h.replace(/\n/g, " ").slice(0, 120)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
