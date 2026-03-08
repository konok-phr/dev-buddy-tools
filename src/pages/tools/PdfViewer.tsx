import { useState, useRef, useCallback, useEffect } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Search, X, RotateCw, Download } from "lucide-react";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

interface PageInfo {
  pageNum: number;
  rendered: boolean;
}

export default function PdfViewer() {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [fileName, setFileName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [searchIdx, setSearchIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const renderPage = useCallback(async (doc: any, pageNum: number, s: number, rot: number) => {
    if (!doc || !canvasRef.current) return;
    try {
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale: s, rotation: rot });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (e) {
      console.error("Render error:", e);
    }
  }, []);

  useEffect(() => {
    if (pdfDoc) renderPage(pdfDoc, currentPage, scale, rotation);
  }, [pdfDoc, currentPage, scale, rotation, renderPage]);

  const loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }
    setLoading(true);
    setFileName(file.name);
    try {
      const data = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data }).promise;
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setCurrentPage(1);
      setScale(1.2);
      setRotation(0);
      setSearchResults([]);
      setSearchText("");
      toast.success(`Loaded ${doc.numPages} pages`);
    } catch (err) {
      toast.error("Failed to load PDF");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const zoom = (delta: number) => {
    setScale(prev => Math.max(0.3, Math.min(5, prev + delta)));
  };

  const rotate = () => setRotation(prev => (prev + 90) % 360);

  const searchInPdf = async () => {
    if (!pdfDoc || !searchText.trim()) return;
    const results: number[] = [];
    const query = searchText.toLowerCase();
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(" ").toLowerCase();
      if (text.includes(query)) results.push(i);
    }
    setSearchResults(results);
    if (results.length > 0) {
      setSearchIdx(0);
      setCurrentPage(results[0]);
      toast.success(`Found on ${results.length} page(s)`);
    } else {
      toast.info("No results found");
    }
  };

  const nextResult = () => {
    if (searchResults.length === 0) return;
    const next = (searchIdx + 1) % searchResults.length;
    setSearchIdx(next);
    setCurrentPage(searchResults[next]);
  };

  const prevResult = () => {
    if (searchResults.length === 0) return;
    const prev = (searchIdx - 1 + searchResults.length) % searchResults.length;
    setSearchIdx(prev);
    setCurrentPage(searchResults[prev]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <ToolHeader title="PDF Viewer" description="View PDFs with zoom, navigation, search, and rotation" />

      <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={loadFile} />

      {!pdfDoc ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-16 text-center cursor-pointer hover:border-primary/50 transition-colors bg-card"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium">Click to upload a PDF</p>
          <p className="text-sm text-muted-foreground mt-1">Supports any PDF file</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-lg p-2">
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload className="w-4 h-4 mr-1" /> Open
            </Button>
            <span className="text-xs text-muted-foreground truncate max-w-[150px]">{fileName}</span>

            <div className="h-6 w-px bg-border mx-1" />

            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={currentPage}
                onChange={e => goToPage(Number(e.target.value))}
                className="w-14 h-8 text-center text-sm"
                min={1}
                max={totalPages}
              />
              <span className="text-sm text-muted-foreground">/ {totalPages}</span>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <div className="h-6 w-px bg-border mx-1" />

            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => zoom(-0.2)}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => zoom(0.2)}>
              <ZoomIn className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="icon" className="h-8 w-8" onClick={rotate}>
              <RotateCw className="w-4 h-4" />
            </Button>

            <div className="h-6 w-px bg-border mx-1" />

            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && searchInPdf()}
                placeholder="Search in PDF..."
                className="h-8 flex-1"
              />
              <Button variant="outline" size="sm" onClick={searchInPdf}>Find</Button>
              {searchResults.length > 0 && (
                <>
                  <span className="text-xs text-muted-foreground">{searchIdx + 1}/{searchResults.length}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevResult}>
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextResult}>
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSearchOpen(false); setSearchResults([]); setSearchText(""); }}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Canvas */}
          <div ref={containerRef} className="bg-muted/30 border border-border rounded-lg overflow-auto flex justify-center p-4 min-h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center h-[600px]">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <canvas ref={canvasRef} className="shadow-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
