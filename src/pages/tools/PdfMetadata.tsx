import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function PdfMetadata() {
  const [meta, setMeta] = useState<Record<string, string> | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const data = await f.arrayBuffer();
    const doc = await PDFDocument.load(data, { ignoreEncryption: true });
    setMeta({
      "Title": doc.getTitle() || "N/A",
      "Author": doc.getAuthor() || "N/A",
      "Subject": doc.getSubject() || "N/A",
      "Creator": doc.getCreator() || "N/A",
      "Producer": doc.getProducer() || "N/A",
      "Creation Date": doc.getCreationDate()?.toISOString() || "N/A",
      "Modification Date": doc.getModificationDate()?.toISOString() || "N/A",
      "Page Count": doc.getPageCount().toString(),
      "PDF Version": doc.getForm ? "Has Form Fields" : "No Form Fields",
    });

    // Get page dimensions
    const firstPage = doc.getPage(0);
    const { width, height } = firstPage.getSize();
    setMeta(prev => prev ? { ...prev, "Page Size": `${Math.round(width)} × ${Math.round(height)} pts` } : null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="PDF Metadata Viewer" description="View metadata and properties of PDF files" />
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Click to select a PDF file</p>
        <input ref={inputRef} type="file" accept=".pdf" onChange={loadFile} className="hidden" />
      </div>
      {meta && (
        <div>
          <div className="bg-card border border-border rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-foreground">{fileName}</p>
          </div>
          <div className="space-y-1">
            {Object.entries(meta).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-card border border-border rounded-md px-3 py-2">
                <span className="text-xs text-muted-foreground">{key}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground">{value}</span>
                  {value !== "N/A" && <CopyButton text={value} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
