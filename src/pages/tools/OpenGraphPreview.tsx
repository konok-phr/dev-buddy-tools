import { useState } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function OpenGraphPreview() {
  const [title, setTitle] = useState("My Website Title");
  const [description, setDescription] = useState("A short description of the page content that will appear in social media previews.");
  const [image, setImage] = useState("https://placehold.co/1200x630/4f46e5/white?text=OG+Image");
  const [url, setUrl] = useState("https://example.com");
  const [siteName, setSiteName] = useState("Example");

  const domain = (() => { try { return new URL(url).hostname; } catch { return "example.com"; } })();

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Open Graph Preview" description="Preview how your page will look when shared on social media" />
      <div className="space-y-6">
        <div className="grid gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-card text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} className="bg-card text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
            <Input value={image} onChange={e => setImage(e.target.value)} className="bg-card text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">URL</label>
              <Input value={url} onChange={e => setUrl(e.target.value)} className="bg-card text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Site Name</label>
              <Input value={siteName} onChange={e => setSiteName(e.target.value)} className="bg-card text-sm" />
            </div>
          </div>
        </div>

        {/* Facebook Preview */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block font-medium">Facebook / LinkedIn</label>
          <div className="border border-border rounded-lg overflow-hidden bg-card max-w-lg">
            <div className="aspect-[1.91/1] bg-muted overflow-hidden">
              <img src={image} alt="OG" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground uppercase">{domain}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5 line-clamp-2">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{description}</p>
            </div>
          </div>
        </div>

        {/* Twitter Preview */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block font-medium">Twitter / X</label>
          <div className="border border-border rounded-2xl overflow-hidden bg-card max-w-lg">
            <div className="aspect-[2/1] bg-muted overflow-hidden">
              <img src={image} alt="OG" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-foreground line-clamp-1">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{description}</p>
              <p className="text-xs text-muted-foreground mt-1">{domain}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
