import {
  Braces, Binary, Regex, Globe, Clock, Fingerprint, Lock, Palette,
  Shield, FileText, Type, FileSearch, Key, Link, GitCompare, Code, FileCode,
  ArrowLeftRight, Timer, BookOpen, Image, FileUp, Scissors, FileCheck,
  Hash, FileJson, CheckSquare, CaseSensitive, Network, ShieldCheck, List, Table2
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
  { id: "pdf", label: "PDF Tools" },
];

export const tools: ToolDef[] = [
  { id: "json-formatter", title: "JSON Formatter", description: "Prettify, minify & validate JSON", icon: Braces, category: "text-data", path: "/tools/json-formatter" },
  { id: "base64", title: "Base64 Encoder", description: "Encode & decode Base64 strings", icon: Binary, category: "text-data", path: "/tools/base64" },
  { id: "markdown-preview", title: "Markdown Preview", description: "Live markdown editor & preview", icon: FileText, category: "text-data", path: "/tools/markdown-preview" },
  { id: "lorem-ipsum", title: "Lorem Ipsum", description: "Generate placeholder text", icon: Type, category: "text-data", path: "/tools/lorem-ipsum" },
  { id: "log-viewer", title: "Log Viewer", description: "Paste & filter log lines", icon: FileSearch, category: "text-data", path: "/tools/log-viewer" },
  { id: "diff-checker", title: "Diff Checker", description: "Compare two texts side by side", icon: GitCompare, category: "text-data", path: "/tools/diff-checker" },
  { id: "json-csv", title: "JSON ↔ CSV", description: "Convert between JSON and CSV", icon: ArrowLeftRight, category: "text-data", path: "/tools/json-csv" },
  { id: "regex-tester", title: "Regex Tester", description: "Test regex with live match highlighting", icon: Regex, category: "code-testing", path: "/tools/regex-tester" },
  { id: "regex-cheatsheet", title: "Regex Cheatsheet", description: "Quick regex syntax reference", icon: BookOpen, category: "code-testing", path: "/tools/regex-cheatsheet" },
  { id: "api-tester", title: "API Tester", description: "Send HTTP requests & view responses", icon: Globe, category: "code-testing", path: "/tools/api-tester" },
  { id: "css-minifier", title: "CSS Minifier", description: "Minify CSS code", icon: Code, category: "code-testing", path: "/tools/css-minifier" },
  { id: "html-entity", title: "HTML Entity Encoder", description: "Encode & decode HTML entities", icon: FileCode, category: "code-testing", path: "/tools/html-entity" },
  { id: "cron-parser", title: "Cron Parser", description: "Parse & understand cron expressions", icon: Timer, category: "code-testing", path: "/tools/cron-parser" },
  { id: "svg-optimizer", title: "SVG Optimizer", description: "Optimize SVG files", icon: Image, category: "code-testing", path: "/tools/svg-optimizer" },
  { id: "timestamp", title: "Timestamp Converter", description: "Convert Unix ↔ human-readable dates", icon: Clock, category: "converters", path: "/tools/timestamp" },
  { id: "uuid-generator", title: "UUID Generator", description: "Generate UUID v4 identifiers", icon: Fingerprint, category: "converters", path: "/tools/uuid-generator" },
  { id: "password-generator", title: "Password Generator", description: "Generate secure passwords", icon: Lock, category: "converters", path: "/tools/password-generator" },
  { id: "color-picker", title: "Color Picker", description: "Pick & convert HEX, RGB, HSL colors", icon: Palette, category: "converters", path: "/tools/color-picker" },
  { id: "url-encoder", title: "URL Encoder/Decoder", description: "Encode & decode URL components", icon: Link, category: "converters", path: "/tools/url-encoder" },
  { id: "jwt-decoder", title: "JWT Decoder", description: "Decode & inspect JSON Web Tokens", icon: Key, category: "security", path: "/tools/jwt-decoder" },
  { id: "hash-generator", title: "Hash Generator", description: "Generate SHA-1, SHA-256, SHA-512 hashes", icon: Shield, category: "security", path: "/tools/hash-generator" },
  { id: "pdf-merger", title: "PDF Merger", description: "Combine multiple PDF files into one", icon: FileUp, category: "pdf", path: "/tools/pdf-merger" },
  { id: "pdf-extractor", title: "PDF Page Extractor", description: "Extract specific pages from a PDF", icon: Scissors, category: "pdf", path: "/tools/pdf-extractor" },
  { id: "pdf-metadata", title: "PDF Metadata Viewer", description: "View PDF properties & metadata", icon: FileCheck, category: "pdf", path: "/tools/pdf-metadata" },
  { id: "number-base", title: "Number Base Converter", description: "Convert between binary, octal, decimal & hex", icon: Hash, category: "converters", path: "/tools/number-base" },
  { id: "yaml-json", title: "YAML ↔ JSON", description: "Convert between YAML and JSON", icon: FileJson, category: "text-data", path: "/tools/yaml-json" },
  { id: "json-schema", title: "JSON Schema Validator", description: "Validate JSON against a schema", icon: CheckSquare, category: "code-testing", path: "/tools/json-schema" },
  { id: "text-case", title: "Text Case Converter", description: "Convert text between different cases", icon: CaseSensitive, category: "text-data", path: "/tools/text-case" },
  { id: "ip-analyzer", title: "IP Address Analyzer", description: "Analyze IPv4 addresses — class, type & binary", icon: Network, category: "code-testing", path: "/tools/ip-analyzer" },
  { id: "unix-permissions", title: "Unix Permissions", description: "Calculate chmod values interactively", icon: ShieldCheck, category: "code-testing", path: "/tools/unix-permissions" },
  { id: "http-status", title: "HTTP Status Codes", description: "Quick reference for HTTP status codes", icon: List, category: "code-testing", path: "/tools/http-status" },
  { id: "markdown-table", title: "Markdown Table Generator", description: "Build markdown tables visually", icon: Table2, category: "text-data", path: "/tools/markdown-table" },
];
