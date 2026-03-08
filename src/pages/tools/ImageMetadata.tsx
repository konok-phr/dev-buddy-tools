import { useState, useRef } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, MapPin, Calendar, Aperture, Info } from "lucide-react";

interface ExifData {
  [key: string]: string | number | undefined;
}

function readExifFromArrayBuffer(buffer: ArrayBuffer): ExifData {
  const view = new DataView(buffer);
  const exif: ExifData = {};

  // Basic file info
  exif["File Size"] = `${(buffer.byteLength / 1024).toFixed(1)} KB`;

  // Check for JPEG
  if (view.getUint16(0) !== 0xFFD8) {
    return exif;
  }

  let offset = 2;
  while (offset < view.byteLength - 1) {
    const marker = view.getUint16(offset);
    offset += 2;

    if (marker === 0xFFE1) {
      // APP1 - EXIF
      const length = view.getUint16(offset);
      const exifOffset = offset + 2;

      // Check "Exif\0\0"
      const exifHeader = String.fromCharCode(
        view.getUint8(exifOffset), view.getUint8(exifOffset + 1),
        view.getUint8(exifOffset + 2), view.getUint8(exifOffset + 3)
      );
      if (exifHeader !== "Exif") break;

      const tiffOffset = exifOffset + 6;
      const littleEndian = view.getUint16(tiffOffset) === 0x4949;

      const ifdOffset = view.getUint32(tiffOffset + 4, littleEndian);
      const numEntries = view.getUint16(tiffOffset + ifdOffset, littleEndian);

      const tagNames: Record<number, string> = {
        0x010F: "Camera Make", 0x0110: "Camera Model", 0x0112: "Orientation",
        0x011A: "X Resolution", 0x011B: "Y Resolution", 0x0128: "Resolution Unit",
        0x0131: "Software", 0x0132: "Date/Time", 0x013B: "Artist",
        0x8298: "Copyright", 0x829A: "Exposure Time", 0x829D: "F-Number",
        0x8827: "ISO Speed", 0x9003: "Date Original", 0x9004: "Date Digitized",
        0x920A: "Focal Length", 0xA001: "Color Space", 0xA002: "Image Width",
        0xA003: "Image Height", 0xA405: "Focal Length (35mm)", 0xA420: "Unique ID",
      };

      for (let i = 0; i < numEntries && i < 50; i++) {
        try {
          const entryOffset = tiffOffset + ifdOffset + 2 + i * 12;
          const tag = view.getUint16(entryOffset, littleEndian);
          const type = view.getUint16(entryOffset + 2, littleEndian);
          const count = view.getUint32(entryOffset + 4, littleEndian);

          const tagName = tagNames[tag];
          if (!tagName) continue;

          if (type === 2) {
            // ASCII string
            let valueOffset = entryOffset + 8;
            if (count > 4) {
              valueOffset = tiffOffset + view.getUint32(entryOffset + 8, littleEndian);
            }
            let str = "";
            for (let j = 0; j < count - 1 && valueOffset + j < view.byteLength; j++) {
              str += String.fromCharCode(view.getUint8(valueOffset + j));
            }
            exif[tagName] = str;
          } else if (type === 3) {
            exif[tagName] = view.getUint16(entryOffset + 8, littleEndian);
          } else if (type === 4) {
            exif[tagName] = view.getUint32(entryOffset + 8, littleEndian);
          } else if (type === 5) {
            const ratOffset = tiffOffset + view.getUint32(entryOffset + 8, littleEndian);
            if (ratOffset + 8 <= view.byteLength) {
              const num = view.getUint32(ratOffset, littleEndian);
              const den = view.getUint32(ratOffset + 4, littleEndian);
              exif[tagName] = den ? `${num}/${den}` : String(num);
            }
          }
        } catch { /* skip bad entries */ }
      }

      break;
    } else if ((marker & 0xFF00) === 0xFF00) {
      const length = view.getUint16(offset);
      offset += length;
    } else {
      break;
    }
  }

  return exif;
}

export default function ImageMetadata() {
  const [metadata, setMetadata] = useState<ExifData | null>(null);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [fileType, setFileType] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileType(file.type);

    // Preview
    const url = URL.createObjectURL(file);
    setPreview(url);

    // Get dimensions
    const img = new window.Image();
    img.onload = () => setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;

    // Read EXIF
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const exif = readExifFromArrayBuffer(buffer);
      exif["File Name"] = file.name;
      exif["MIME Type"] = file.type;
      exif["Last Modified"] = new Date(file.lastModified).toLocaleString();
      setMetadata(exif);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  };

  const metadataText = metadata
    ? Object.entries(metadata).map(([k, v]) => `${k}: ${v}`).join("\n")
    : "";

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Image Metadata Viewer" description="Extract EXIF data, dimensions & file info from images" />

      <div
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors mb-4"
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Drop an image here or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP, GIF supported</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {preview && metadata && (
        <div className="space-y-4">
          {/* Preview + Basic Info */}
          <div className="border rounded-lg p-4 flex gap-4 flex-col sm:flex-row">
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <p className="font-mono text-sm font-medium text-foreground">{fileName}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{fileType}</Badge>
                {dimensions.w > 0 && <Badge variant="outline">{dimensions.w} × {dimensions.h}px</Badge>}
                {metadata["File Size"] && <Badge variant="outline">{metadata["File Size"]}</Badge>}
              </div>
              {metadata["Camera Make"] && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Camera className="h-3.5 w-3.5" />
                  {metadata["Camera Make"]} {metadata["Camera Model"]}
                </div>
              )}
              {metadata["Date Original"] && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {metadata["Date Original"]}
                </div>
              )}
            </div>
          </div>

          {/* Camera Settings */}
          {(metadata["Exposure Time"] || metadata["F-Number"] || metadata["ISO Speed"] || metadata["Focal Length"]) && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Aperture className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xs font-semibold text-muted-foreground">Camera Settings</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {metadata["Exposure Time"] && (
                  <div><p className="text-xs text-muted-foreground">Shutter Speed</p><p className="text-sm font-mono text-foreground">{metadata["Exposure Time"]}s</p></div>
                )}
                {metadata["F-Number"] && (
                  <div><p className="text-xs text-muted-foreground">Aperture</p><p className="text-sm font-mono text-foreground">f/{metadata["F-Number"]}</p></div>
                )}
                {metadata["ISO Speed"] && (
                  <div><p className="text-xs text-muted-foreground">ISO</p><p className="text-sm font-mono text-foreground">{metadata["ISO Speed"]}</p></div>
                )}
                {metadata["Focal Length"] && (
                  <div><p className="text-xs text-muted-foreground">Focal Length</p><p className="text-sm font-mono text-foreground">{metadata["Focal Length"]}mm</p></div>
                )}
              </div>
            </div>
          )}

          {/* All Metadata */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xs font-semibold text-muted-foreground">All Metadata</h3>
              </div>
              <CopyButton text={metadataText} />
            </div>
            <div className="space-y-1">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="flex gap-3 py-1 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground min-w-[140px] shrink-0">{key}</span>
                  <span className="text-xs font-mono text-foreground break-all">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
