import {
  Braces, Binary, Regex, Globe, Clock, Fingerprint, Lock, Palette,
  Shield, FileText, Type, FileSearch, Terminal
} from "lucide-react";

export interface ToolDef {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  path: string;
}

export const categories = [
  { id: "text-data", label: "Text & Data" },
  { id: "code-testing", label: "Code & Testing" },
  { id: "converters", label: "Converters & Generators" },
  { id: "security", label: "Security" },
];

export const tools: ToolDef[] = [
  { id: "json-formatter", title: "JSON Formatter", description: "Prettify, minify & validate JSON", icon: Braces, category: "text-data", path: "/tools/json-formatter" },
  { id: "base64", title: "Base64 Encoder", description: "Encode & decode Base64 strings", icon: Binary, category: "text-data", path: "/tools/base64" },
  { id: "markdown-preview", title: "Markdown Preview", description: "Live markdown editor & preview", icon: FileText, category: "text-data", path: "/tools/markdown-preview" },
  { id: "lorem-ipsum", title: "Lorem Ipsum", description: "Generate placeholder text", icon: Type, category: "text-data", path: "/tools/lorem-ipsum" },
  { id: "log-viewer", title: "Log Viewer", description: "Paste & filter log lines", icon: FileSearch, category: "text-data", path: "/tools/log-viewer" },
  { id: "regex-tester", title: "Regex Tester", description: "Test regex with live match highlighting", icon: Regex, category: "code-testing", path: "/tools/regex-tester" },
  { id: "api-tester", title: "API Tester", description: "Send HTTP requests & view responses", icon: Globe, category: "code-testing", path: "/tools/api-tester" },
  { id: "timestamp", title: "Timestamp Converter", description: "Convert Unix ↔ human-readable dates", icon: Clock, category: "converters", path: "/tools/timestamp" },
  { id: "uuid-generator", title: "UUID Generator", description: "Generate UUID v4 identifiers", icon: Fingerprint, category: "converters", path: "/tools/uuid-generator" },
  { id: "password-generator", title: "Password Generator", description: "Generate secure passwords", icon: Lock, category: "converters", path: "/tools/password-generator" },
  { id: "color-picker", title: "Color Picker", description: "Pick & convert HEX, RGB, HSL colors", icon: Palette, category: "converters", path: "/tools/color-picker" },
  { id: "hash-generator", title: "Hash Generator", description: "Generate SHA-1, SHA-256, SHA-512 hashes", icon: Shield, category: "security", path: "/tools/hash-generator" },
];
