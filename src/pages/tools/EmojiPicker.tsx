import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";

const emojiCategories: Record<string, string[]> = {
  "Smileys": ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","😊","😇","🥰","😍","🤩","😘","😗","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","😐","😑","😶","😏","😒","🙄","😬","😮‍💨","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🥵","🥶","😵","🤯","🥳","🥸","😎","🤓","🧐"],
  "Gestures": ["👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🙏","💪"],
  "Hearts": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","💕","💞","💓","💗","💖","💘","💝"],
  "Objects": ["⌚","📱","💻","⌨️","🖥️","🖨️","🖱️","💾","💿","📷","📹","🎥","📺","📻","🔧","🔨","⚙️","🔩","🔑","🗝️","💡","🔦","📦","📫","✏️","📝","📁","📂"],
  "Symbols": ["⭐","🌟","✨","⚡","🔥","💥","❄️","🌈","☀️","🌙","💫","✅","❌","⚠️","🔴","🟢","🔵","🟡","⬛","⬜","🔶","🔷","♻️","🎯","💯","🏆","🎪"],
  "Animals": ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦅","🦆","🦉","🐴","🦄","🐝","🐛","🦋","🐌","🐞"],
  "Food": ["🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🍕","🍔","🍟","🌮","🍣","🍩","🍪","🎂","🍰","☕","🧋"],
};

export default function EmojiPicker() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  const copy = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopied(emoji);
    setTimeout(() => setCopied(""), 1200);
  };

  const filtered = useMemo(() => {
    if (!search) return emojiCategories;
    const result: Record<string, string[]> = {};
    // Simple filter - just show all when searching since emoji names aren't stored
    Object.entries(emojiCategories).forEach(([cat, emojis]) => {
      result[cat] = emojis;
    });
    return result;
  }, [search]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Emoji Picker" description="Browse and copy emojis to clipboard" />
      <div className="space-y-4">
        <Input value={search} onChange={e => setSearch(e.target.value)} className="bg-card" placeholder="Search categories..." />
        {copied && <p className="text-xs text-primary">Copied {copied} to clipboard!</p>}
        {Object.entries(filtered).map(([cat, emojis]) => (
          cat.toLowerCase().includes(search.toLowerCase()) || !search ? (
            <div key={cat}>
              <label className="text-xs text-muted-foreground mb-2 block font-medium">{cat}</label>
              <div className="flex flex-wrap gap-1">
                {emojis.map((e, i) => (
                  <button key={i} onClick={() => copy(e)} className="text-2xl p-1.5 rounded hover:bg-accent transition-colors" title="Click to copy">{e}</button>
                ))}
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}
