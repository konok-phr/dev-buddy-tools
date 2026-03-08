import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const SECTIONS = [
  {
    title: "Character Classes",
    items: [
      { pattern: ".", desc: "Any character except newline" },
      { pattern: "\\d", desc: "Digit [0-9]" },
      { pattern: "\\D", desc: "Not a digit" },
      { pattern: "\\w", desc: "Word character [a-zA-Z0-9_]" },
      { pattern: "\\W", desc: "Not a word character" },
      { pattern: "\\s", desc: "Whitespace" },
      { pattern: "\\S", desc: "Not whitespace" },
      { pattern: "\\b", desc: "Word boundary" },
    ],
  },
  {
    title: "Quantifiers",
    items: [
      { pattern: "*", desc: "0 or more" },
      { pattern: "+", desc: "1 or more" },
      { pattern: "?", desc: "0 or 1 (optional)" },
      { pattern: "{n}", desc: "Exactly n times" },
      { pattern: "{n,}", desc: "n or more times" },
      { pattern: "{n,m}", desc: "Between n and m times" },
      { pattern: "*?", desc: "0 or more (lazy)" },
      { pattern: "+?", desc: "1 or more (lazy)" },
    ],
  },
  {
    title: "Anchors",
    items: [
      { pattern: "^", desc: "Start of string/line" },
      { pattern: "$", desc: "End of string/line" },
      { pattern: "\\b", desc: "Word boundary" },
      { pattern: "\\B", desc: "Not a word boundary" },
    ],
  },
  {
    title: "Groups & Lookaround",
    items: [
      { pattern: "(abc)", desc: "Capture group" },
      { pattern: "(?:abc)", desc: "Non-capturing group" },
      { pattern: "(?=abc)", desc: "Positive lookahead" },
      { pattern: "(?!abc)", desc: "Negative lookahead" },
      { pattern: "(?<=abc)", desc: "Positive lookbehind" },
      { pattern: "(?<!abc)", desc: "Negative lookbehind" },
      { pattern: "\\1", desc: "Back-reference to group 1" },
      { pattern: "(a|b)", desc: "Alternation (a or b)" },
    ],
  },
  {
    title: "Character Sets",
    items: [
      { pattern: "[abc]", desc: "Any of a, b, or c" },
      { pattern: "[^abc]", desc: "Not a, b, or c" },
      { pattern: "[a-z]", desc: "Range: a to z" },
      { pattern: "[A-Z]", desc: "Range: A to Z" },
      { pattern: "[0-9]", desc: "Range: 0 to 9" },
    ],
  },
  {
    title: "Flags",
    items: [
      { pattern: "g", desc: "Global — find all matches" },
      { pattern: "i", desc: "Case-insensitive" },
      { pattern: "m", desc: "Multi-line (^ and $ match lines)" },
      { pattern: "s", desc: "Dotall (. matches \\n)" },
      { pattern: "u", desc: "Unicode support" },
    ],
  },
  {
    title: "Common Patterns",
    items: [
      { pattern: "^[\\w.-]+@[\\w.-]+\\.\\w{2,}$", desc: "Email address" },
      { pattern: "https?://[\\w.-]+(?:/\\S*)?", desc: "URL" },
      { pattern: "^\\d{1,3}(\\.\\d{1,3}){3}$", desc: "IPv4 address" },
      { pattern: "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$", desc: "HEX color" },
      { pattern: "^\\+?\\d{10,15}$", desc: "Phone number" },
      { pattern: "^\\d{4}-\\d{2}-\\d{2}$", desc: "Date (YYYY-MM-DD)" },
    ],
  },
];

export default function RegexCheatsheet() {
  const [search, setSearch] = useState("");

  const filtered = SECTIONS.map(s => ({
    ...s,
    items: s.items.filter(i =>
      i.pattern.toLowerCase().includes(search.toLowerCase()) ||
      i.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(s => s.items.length > 0);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Regex Cheatsheet" description="Quick reference for regular expression syntax" />
      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patterns..." className="bg-card mb-6" />
      <div className="space-y-6">
        {filtered.map(section => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold text-primary mb-2">{section.title}</h2>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 border-b border-border/50 last:border-0 hover:bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <code className="font-mono text-sm text-accent bg-muted px-2 py-0.5 rounded">{item.pattern}</code>
                    <span className="text-sm text-foreground">{item.desc}</span>
                  </div>
                  <CopyButton text={item.pattern} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
