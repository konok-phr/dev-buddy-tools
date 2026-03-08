import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";

export default function CharacterCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const lines = text ? text.split("\n").length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const speakingTime = Math.max(1, Math.ceil(words / 130));
    return { chars, charsNoSpaces, words, sentences, paragraphs, lines, readingTime, speakingTime };
  }, [text]);

  const statCards = [
    { label: "Characters", value: stats.chars },
    { label: "No Spaces", value: stats.charsNoSpaces },
    { label: "Words", value: stats.words },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Lines", value: stats.lines },
    { label: "Reading Time", value: `${stats.readingTime} min` },
    { label: "Speaking Time", value: `${stats.speakingTime} min` },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Character Counter" description="Count characters, words, sentences, and more" />
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {statCards.map(s => (
            <div key={s.label} className="border border-border rounded-lg p-3 bg-card text-center">
              <div className="text-lg font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <Textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="bg-card text-sm min-h-[250px]"
          placeholder="Start typing or paste your text here..."
        />
      </div>
    </div>
  );
}
