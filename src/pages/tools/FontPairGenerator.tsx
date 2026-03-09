import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";

const PAIRS = [
  { heading: "Playfair Display", body: "Source Sans Pro", style: "Elegant & Classic" },
  { heading: "Montserrat", body: "Merriweather", style: "Modern & Readable" },
  { heading: "Oswald", body: "Lato", style: "Bold & Clean" },
  { heading: "Raleway", body: "Roboto", style: "Minimal & Professional" },
  { heading: "Abril Fatface", body: "Poppins", style: "Dramatic & Friendly" },
  { heading: "Space Grotesk", body: "Inter", style: "Tech & Modern" },
  { heading: "DM Serif Display", body: "DM Sans", style: "Editorial & Clean" },
  { heading: "Bebas Neue", body: "Open Sans", style: "Impactful & Neutral" },
  { heading: "Crimson Text", body: "Work Sans", style: "Literary & Geometric" },
  { heading: "Josefin Sans", body: "Libre Baskerville", style: "Retro & Refined" },
];

export default function FontPairGenerator() {
  const [index, setIndex] = useState(0);
  const pair = PAIRS[index];

  const css = `/* ${pair.style} */\n@import url('https://fonts.googleapis.com/css2?family=${pair.heading.replace(/ /g, "+")}&family=${pair.body.replace(/ /g, "+")}&display=swap');\n\nh1, h2, h3 { font-family: '${pair.heading}', serif; }\nbody, p { font-family: '${pair.body}', sans-serif; }`;

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Font Pair Generator" description="Discover beautiful font pairings for your projects" />
      <div className="flex gap-2 mb-6 flex-wrap">
        {PAIRS.map((p, i) => (
          <Button key={i} size="sm" variant={i === index ? "default" : "outline"} onClick={() => setIndex(i)}>{p.style}</Button>
        ))}
      </div>
      <div className="border rounded-md p-6 mb-4">
        <link href={`https://fonts.googleapis.com/css2?family=${pair.heading.replace(/ /g, "+")}&family=${pair.body.replace(/ /g, "+")}&display=swap`} rel="stylesheet" />
        <h2 style={{ fontFamily: `'${pair.heading}', serif` }} className="text-3xl font-bold text-foreground mb-2">The Quick Brown Fox</h2>
        <p style={{ fontFamily: `'${pair.body}', sans-serif` }} className="text-base text-muted-foreground leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span>Heading: <strong className="text-foreground">{pair.heading}</strong></span>
          <span>Body: <strong className="text-foreground">{pair.body}</strong></span>
        </div>
      </div>
      <div className="flex justify-end mb-1"><CopyButton text={css} /></div>
      <pre className="border rounded-md p-3 text-xs font-mono text-foreground overflow-x-auto">{css}</pre>
    </div>
  );
}
