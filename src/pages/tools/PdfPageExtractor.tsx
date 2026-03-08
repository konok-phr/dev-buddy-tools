import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download } from "lucide-react";

export default function PdfPageExtractor() {
  const [file, setFile] = useState<{ name: string; data: ArrayBuffer; pageCount: number } | null>(null);
  const [pages, setPages] = useState("1");
  const [working, setWorking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const data = await f.arrayBuffer();
    const doc = await PDFDocument.load(data);
    setFile({ name: f.name, data, pageCount: doc.getPageCount() });
  };

  const extract = async () => {
    if (!file) return;
    setWorking(true);
    try {
      const src = await PDFDocument.load(file.data);
      const newDoc = await PDFDocument.create();
      const indices = parsePageRange(pages, file.pageCount);
      const copied = await newDoc.copyPages(src, indices);
      copied.forEach(p => newDoc.addPage(p));
      const bytes = await newDoc.save();
      const blob = new Blob([bytes as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `extracted-${pages.replace(/[^0-9,-]/g, "")}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } finally { setWorking(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="PDF Page Extractor" description="Extract specific pages from a PDF file" />
      {!file ? (
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Click to select a PDF file</p>
          <input ref={inputRef} type="file" accept=".pdf" onChange={loadFile} className="hidden" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-foreground font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">{file.pageCount} pages</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Pages to extract (e.g. 1,3,5-8)</label>
            <Input value={pages} onChange={e => setPages(e.target.value)} className="font-mono bg-card" placeholder="1,3,5-8" />
          </div>
          <div className="flex gap-2">
            <Button onClick={extract} disabled={working}>
              <Download className="h-4 w-4 mr-2" />{working ? "Extracting..." : "Extract Pages"}
            </Button>
            <Button variant="secondary" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }}>
              Change File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function parsePageRange(input: string, max: number): number[] {
  const indices: number[] = [];
  for (const part of input.split(",")) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [a, b] = trimmed.split("-").map(Number);
      for (let i = a; i <= Math.min(b, max); i++) if (i >= 1) indices.push(i - 1);
    } else {
      const n = parseInt(trimmed);
      if (n >= 1 && n <= max) indices.push(n - 1);
    }
  }
  return [...new Set(indices)].sort((a, b) => a - b);
}
