import { useState, useRef, useCallback } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, RotateCcw } from "lucide-react";

type FilterType = "grayscale" | "sepia" | "blur" | "brightness" | "contrast" | "saturate" | "hue-rotate" | "invert" | "none";

interface FilterConfig {
  type: FilterType;
  label: string;
  min: number;
  max: number;
  default: number;
  unit: string;
}

const FILTERS: FilterConfig[] = [
  { type: "none", label: "None", min: 0, max: 100, default: 0, unit: "" },
  { type: "grayscale", label: "Grayscale", min: 0, max: 100, default: 100, unit: "%" },
  { type: "sepia", label: "Sepia", min: 0, max: 100, default: 80, unit: "%" },
  { type: "blur", label: "Blur", min: 0, max: 20, default: 5, unit: "px" },
  { type: "brightness", label: "Brightness", min: 0, max: 300, default: 150, unit: "%" },
  { type: "contrast", label: "Contrast", min: 0, max: 300, default: 150, unit: "%" },
  { type: "saturate", label: "Saturate", min: 0, max: 300, default: 200, unit: "%" },
  { type: "hue-rotate", label: "Hue Rotate", min: 0, max: 360, default: 90, unit: "deg" },
  { type: "invert", label: "Invert", min: 0, max: 100, default: 100, unit: "%" },
];

const PRESETS = [
  { name: "Vintage", filters: "sepia(60%) contrast(110%) brightness(90%)" },
  { name: "Cold", filters: "saturate(80%) hue-rotate(180deg) brightness(105%)" },
  { name: "Dramatic", filters: "contrast(150%) brightness(80%) saturate(120%)" },
  { name: "Noir", filters: "grayscale(100%) contrast(130%) brightness(90%)" },
  { name: "Vivid", filters: "saturate(200%) contrast(110%)" },
  { name: "Fade", filters: "brightness(120%) contrast(85%) saturate(80%)" },
];

export default function ImageFilters() {
  const [preview, setPreview] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("none");
  const [filterValue, setFilterValue] = useState(0);
  const [customFilter, setCustomFilter] = useState("");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setCustomFilter("");
    setActiveFilter("none");
    const img = new window.Image();
    img.onload = () => setImage(img);
    img.src = url;
  };

  const filterConfig = FILTERS.find(f => f.type === activeFilter);
  const cssFilter = activeFilter === "none"
    ? customFilter || "none"
    : customFilter || `${activeFilter}(${filterValue}${filterConfig?.unit || ""})`;

  const applyPreset = (filter: string) => {
    setActiveFilter("none");
    setCustomFilter(filter);
  };

  const selectFilter = (type: FilterType) => {
    setActiveFilter(type);
    setCustomFilter("");
    const config = FILTERS.find(f => f.type === type);
    if (config) setFilterValue(config.default);
  };

  const download = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.filter = cssFilter;
    ctx.drawImage(image, 0, 0);

    canvas.toBlob(blob => {
      if (blob) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "filtered-image.png";
        a.click();
      }
    }, "image/png");
  }, [image, cssFilter]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Image Filters & Effects" description="Apply CSS filters and effects to images" />
      <canvas ref={canvasRef} className="hidden" />

      {!preview ? (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
          onDragOver={e => e.preventDefault()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Drop an image or click to upload</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="border rounded-lg p-4 flex justify-center bg-muted/30">
            <img src={preview} alt="Filtered" className="max-w-full max-h-[350px] rounded-lg object-contain" style={{ filter: cssFilter }} />
          </div>

          {/* Presets */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <Badge key={p.name} variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => applyPreset(p.filters)}>
                  {p.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filter controls */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={activeFilter} onValueChange={v => selectFilter(v as FilterType)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FILTERS.map(f => <SelectItem key={f.type} value={f.type}>{f.label}</SelectItem>)}
                </SelectContent>
              </Select>

              {activeFilter !== "none" && filterConfig && (
                <div className="flex items-center gap-3 flex-1">
                  <Slider
                    value={[filterValue]}
                    onValueChange={v => { setFilterValue(v[0]); setCustomFilter(""); }}
                    min={filterConfig.min}
                    max={filterConfig.max}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs font-mono text-muted-foreground w-16 text-right">{filterValue}{filterConfig.unit}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded flex-1">filter: {cssFilter};</code>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={download}><Download className="h-4 w-4 mr-2" />Download</Button>
            <Button variant="outline" onClick={() => { setActiveFilter("none"); setCustomFilter(""); setFilterValue(0); }}>
              <RotateCcw className="h-4 w-4 mr-2" />Reset
            </Button>
            <Button variant="outline" onClick={() => { setPreview(""); setImage(null); }}>New Image</Button>
          </div>
        </div>
      )}
    </div>
  );
}
