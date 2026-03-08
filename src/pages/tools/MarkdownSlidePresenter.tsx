import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { Play, ChevronLeft, ChevronRight, Maximize, Minimize, Grid3X3 } from "lucide-react";

const defaultMd = `# Welcome to Slide Presenter
Write your slides in Markdown, separated by ---

---

## Features
- **Markdown** powered slides
- Fullscreen presentation mode
- Keyboard navigation (← →)
- Grid overview

---

## Code Support

\`\`\`js
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};
\`\`\`

---

## Lists & Quotes

> "The best way to predict the future is to create it."

1. Write your content
2. Separate slides with \`---\`
3. Hit **Present**!

---

# Thank You! 🎉
Built with Markdown
`;

export default function MarkdownSlidePresenter() {
  const [md, setMd] = useState(defaultMd);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = useMemo(() => {
    return md.split(/\n---\n/).map(s => s.trim()).filter(Boolean);
  }, [md]);

  const total = slides.length;

  const goTo = useCallback((idx: number) => {
    setCurrentSlide(Math.max(0, Math.min(idx, total - 1)));
    setShowGrid(false);
  }, [total]);

  const next = useCallback(() => goTo(currentSlide + 1), [currentSlide, goTo]);
  const prev = useCallback(() => goTo(currentSlide - 1), [currentSlide, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape") { setIsPresenting(false); setShowGrid(false); }
      if (e.key === "g" || e.key === "G") { if (!isPresenting) setShowGrid(g => !g); }
      if (e.key === "f" || e.key === "F5") { e.preventDefault(); setIsPresenting(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, isPresenting]);

  useEffect(() => {
    if (isPresenting) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    }
  }, [isPresenting]);

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) setIsPresenting(false);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const SlideContent = ({ content, className = "" }: { content: string; className?: string }) => (
    <div className={`slide-content prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );

  // Fullscreen presenting
  if (isPresenting) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          <div className="w-full max-w-5xl">
            <SlideContent content={slides[currentSlide] || ""} className="text-lg md:text-2xl" />
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-card/80 border-t border-border">
          <Button variant="ghost" size="sm" onClick={prev} disabled={currentSlide <= 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{currentSlide + 1} / {total}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsPresenting(false)}>
              <Minimize className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={next} disabled={currentSlide >= total - 1}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ToolHeader title="Markdown Slide Presenter" description="Create quick presentations from Markdown — separate slides with ---" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground">Markdown (separate slides with ---)</label>
            <span className="text-xs text-muted-foreground">{total} slides</span>
          </div>
          <Textarea
            value={md}
            onChange={e => { setMd(e.target.value); setCurrentSlide(0); }}
            className="font-mono text-sm bg-card h-[500px] resize-none"
          />
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground">Preview</label>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
                <Grid3X3 className="w-3.5 h-3.5 mr-1" /> Grid
              </Button>
              <Button size="sm" onClick={() => setIsPresenting(true)}>
                <Play className="w-3.5 h-3.5 mr-1" /> Present
              </Button>
            </div>
          </div>

          {showGrid ? (
            <div className="bg-card border border-border rounded-lg p-4 h-[500px] overflow-auto">
              <div className="grid grid-cols-2 gap-3">
                {slides.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => goTo(i)}
                    className={`cursor-pointer border rounded-lg p-3 transition-all hover:border-primary/50 ${
                      i === currentSlide ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="text-[10px] text-muted-foreground mb-1">Slide {i + 1}</div>
                    <div className="prose prose-sm max-w-none text-xs [&_h1]:text-sm [&_h2]:text-xs [&_h3]:text-xs [&_p]:text-[10px] [&_li]:text-[10px] [&_pre]:text-[9px] [&_blockquote]:text-[10px] line-clamp-6 overflow-hidden">
                      <ReactMarkdown>{slide}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div ref={containerRef} className="bg-card border border-border rounded-lg h-[500px] flex flex-col">
              <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
                <div className="w-full max-w-2xl">
                  <SlideContent content={slides[currentSlide] || ""} />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border-t border-border">
                <Button variant="ghost" size="sm" onClick={prev} disabled={currentSlide <= 0}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Button>
                <span className="text-sm text-muted-foreground">{currentSlide + 1} / {total}</span>
                <Button variant="ghost" size="sm" onClick={next} disabled={currentSlide >= total - 1}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
