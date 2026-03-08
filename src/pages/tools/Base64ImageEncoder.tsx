import { useState, useRef } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

export default function Base64ImageEncoder() {
  const [base64, setBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (val: string) => {
    setBase64(val);
    if (val.startsWith("data:image")) setPreview(val);
    else setPreview("");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Base64 Image Encoder" description="Convert images to Base64 data URIs" />
      <div className="space-y-4">
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {fileName || "Click to upload an image"}
          </p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {preview && (
          <div className="rounded-lg border border-border p-4 bg-card">
            <label className="text-xs text-muted-foreground mb-2 block">Preview</label>
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Base64 Output</label>
            {base64 && <CopyButton text={base64} />}
          </div>
          <Textarea
            value={base64}
            onChange={e => handlePaste(e.target.value)}
            className="font-mono text-xs bg-card min-h-[120px]"
            placeholder="Or paste a Base64 data URI here..."
          />
        </div>

        {base64 && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">HTML Tag</label>
            <div className="relative">
              <CopyButton text={`<img src="${base64}" alt="" />`} />
              <pre className="text-xs font-mono bg-card border border-border rounded p-3 overflow-x-auto">
                {`<img src="${base64.slice(0, 60)}..." alt="" />`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
