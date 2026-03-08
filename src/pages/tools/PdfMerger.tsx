import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Upload, Download, X } from "lucide-react";

export default function PdfMerger() {
  const [files, setFiles] = useState<{ name: string; data: ArrayBuffer }[]>([]);
  const [merging, setMerging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const loaded = await Promise.all(
      newFiles.map(async f => ({ name: f.name, data: await f.arrayBuffer() }))
    );
    setFiles(prev => [...prev, ...loaded]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const merge = async () => {
    if (files.length < 2) return;
    setMerging(true);
    try {
      const merged = await PDFDocument.create();
      for (const f of files) {
        const doc = await PDFDocument.load(f.data);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "merged.pdf"; a.click();
      URL.revokeObjectURL(url);
    } finally { setMerging(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="PDF Merger" description="Combine multiple PDF files into one" />
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Click to add PDF files</p>
        <input ref={inputRef} type="file" accept=".pdf" multiple onChange={addFiles} className="hidden" />
      </div>
      {files.length > 0 && (
        <div className="space-y-2 mb-4">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-card border border-border rounded-md px-3 py-2">
              <span className="text-sm text-foreground truncate">{f.name}</span>
              <Button variant="ghost" size="icon" onClick={() => removeFile(i)} className="h-6 w-6">
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <Button onClick={merge} disabled={files.length < 2 || merging} className="w-full">
        <Download className="h-4 w-4 mr-2" />
        {merging ? "Merging..." : `Merge ${files.length} PDFs`}
      </Button>
    </div>
  );
}
