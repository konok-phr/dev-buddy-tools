import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

export default function TextStatistics() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
    const lines = text ? text.split("\n").length : 0;
    const avgWordLen = words ? (charsNoSpace / words).toFixed(1) : "0";
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const speakingTime = Math.max(1, Math.ceil(words / 130));
    // Flesch-Kincaid
    const syllables = text.toLowerCase().split(/\s+/).reduce((sum, w) => {
      const s = w.replace(/[^a-z]/g, "").replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").match(/[aeiouy]{1,2}/g);
      return sum + Math.max(1, s ? s.length : 0);
    }, 0);
    const fk = words && sentences ? Math.round(206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)) : 0;
    const level = fk >= 90 ? "Very Easy" : fk >= 70 ? "Easy" : fk >= 50 ? "Average" : fk >= 30 ? "Difficult" : "Very Difficult";
    return { chars, charsNoSpace, words, sentences, paragraphs, lines, avgWordLen, readingTime, speakingTime, fk, level };
  }, [text]);

  const items = [
    ["Characters", stats.chars], ["Characters (no spaces)", stats.charsNoSpace],
    ["Words", stats.words], ["Sentences", stats.sentences],
    ["Paragraphs", stats.paragraphs], ["Lines", stats.lines],
    ["Avg Word Length", stats.avgWordLen], ["Reading Time", `${stats.readingTime} min`],
    ["Speaking Time", `${stats.speakingTime} min`],
    ["Readability Score", `${stats.fk} (${stats.level})`],
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Text Statistics" description="Analyze text readability, word count, reading time and more" />
      <Textarea value={text} onChange={e => setText(e.target.value)} className="h-48 mb-4 font-mono text-sm" placeholder="Paste your text here..." />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map(([label, value]) => (
          <div key={String(label)} className="border rounded-md p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
