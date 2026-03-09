import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LANGUAGES = ["JavaScript (fetch)", "Python (requests)", "PHP (curl)", "Go (net/http)", "Ruby (Net::HTTP)"];

function parseCurl(curl: string) {
  const result: { method: string; url: string; headers: Record<string, string>; body: string } = { method: "GET", url: "", headers: {}, body: "" };
  const parts = curl.replace(/\\\n/g, " ").trim();
  const urlMatch = parts.match(/curl\s+(?:(?:-[A-Za-z]+\s+\S+\s+)*?)['"]?(https?:\/\/[^\s'"]+)['"]?/) || parts.match(/curl\s+['"]?(https?:\/\/[^\s'"]+)['"]?/);
  if (urlMatch) result.url = urlMatch[1];
  const methodMatch = parts.match(/-X\s+(\w+)/);
  if (methodMatch) result.method = methodMatch[1].toUpperCase();
  const headerMatches = parts.matchAll(/-H\s+['"]([^'"]+)['"]/g);
  for (const m of headerMatches) { const [k, ...v] = m[1].split(":"); result.headers[k.trim()] = v.join(":").trim(); }
  const dataMatch = parts.match(/(?:-d|--data|--data-raw)\s+['"](.+?)['"]/s);
  if (dataMatch) { result.body = dataMatch[1]; if (result.method === "GET") result.method = "POST"; }
  return result;
}

function toJsFetch(p: ReturnType<typeof parseCurl>) {
  let code = `const response = await fetch("${p.url}"`;
  const opts: string[] = [];
  if (p.method !== "GET") opts.push(`  method: "${p.method}"`);
  if (Object.keys(p.headers).length) opts.push(`  headers: ${JSON.stringify(p.headers, null, 4).replace(/\n/g, "\n  ")}`);
  if (p.body) opts.push(`  body: ${JSON.stringify(p.body)}`);
  if (opts.length) code += `, {\n${opts.join(",\n")}\n}`;
  code += `);\nconst data = await response.json();\nconsole.log(data);`;
  return code;
}

function toPython(p: ReturnType<typeof parseCurl>) {
  let code = `import requests\n\n`;
  const h = Object.keys(p.headers).length ? `\nheaders = ${JSON.stringify(p.headers, null, 4)}\n` : "";
  code += h;
  const args = [`"${p.url}"`];
  if (Object.keys(p.headers).length) args.push("headers=headers");
  if (p.body) args.push(`data='${p.body}'`);
  code += `\nresponse = requests.${p.method.toLowerCase()}(${args.join(", ")})\nprint(response.json())`;
  return code;
}

function toPhp(p: ReturnType<typeof parseCurl>) {
  let code = `<?php\n$ch = curl_init();\ncurl_setopt($ch, CURLOPT_URL, "${p.url}");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n`;
  if (p.method !== "GET") code += `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${p.method}");\n`;
  if (Object.keys(p.headers).length) {
    const h = Object.entries(p.headers).map(([k, v]) => `"${k}: ${v}"`).join(",\n  ");
    code += `curl_setopt($ch, CURLOPT_HTTPHEADER, [\n  ${h}\n]);\n`;
  }
  if (p.body) code += `curl_setopt($ch, CURLOPT_POSTFIELDS, '${p.body}');\n`;
  code += `$response = curl_exec($ch);\ncurl_close($ch);\necho $response;\n?>`;
  return code;
}

function toGo(p: ReturnType<typeof parseCurl>) {
  let code = `package main\n\nimport (\n  "fmt"\n  "io"\n  "net/http"\n`;
  if (p.body) code += `  "strings"\n`;
  code += `)\n\nfunc main() {\n`;
  if (p.body) code += `  body := strings.NewReader(\`${p.body}\`)\n  req, _ := http.NewRequest("${p.method}", "${p.url}", body)\n`;
  else code += `  req, _ := http.NewRequest("${p.method}", "${p.url}", nil)\n`;
  for (const [k, v] of Object.entries(p.headers)) code += `  req.Header.Set("${k}", "${v}")\n`;
  code += `  resp, _ := http.DefaultClient.Do(req)\n  defer resp.Body.Close()\n  data, _ := io.ReadAll(resp.Body)\n  fmt.Println(string(data))\n}`;
  return code;
}

function toRuby(p: ReturnType<typeof parseCurl>) {
  let code = `require 'net/http'\nrequire 'uri'\nrequire 'json'\n\nuri = URI.parse("${p.url}")\nhttp = Net::HTTP.new(uri.host, uri.port)\n`;
  if (p.url.startsWith("https")) code += `http.use_ssl = true\n`;
  const m = p.method.charAt(0) + p.method.slice(1).toLowerCase();
  code += `request = Net::HTTP::${m}.new(uri.request_uri)\n`;
  for (const [k, v] of Object.entries(p.headers)) code += `request["${k}"] = "${v}"\n`;
  if (p.body) code += `request.body = '${p.body}'\n`;
  code += `response = http.request(request)\nputs response.body`;
  return code;
}

function convert(curl: string, lang: string): string {
  const p = parseCurl(curl);
  if (!p.url) return "// Could not parse cURL command";
  if (lang.startsWith("JavaScript")) return toJsFetch(p);
  if (lang.startsWith("Python")) return toPython(p);
  if (lang.startsWith("PHP")) return toPhp(p);
  if (lang.startsWith("Go")) return toGo(p);
  if (lang.startsWith("Ruby")) return toRuby(p);
  return "";
}

export default function CurlToCode() {
  const [curl, setCurl] = useState(`curl -X POST "https://api.example.com/data" \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer token123" \\\n  -d '{"name":"test","value":42}'`);
  const [lang, setLang] = useState(LANGUAGES[0]);
  const output = convert(curl, lang);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="cURL to Code" description="Convert cURL commands to JavaScript, Python, PHP, Go and Ruby" />
      <Textarea value={curl} onChange={e => setCurl(e.target.value)} placeholder="Paste cURL command..." className="font-mono text-sm min-h-[120px] mb-4" />
      <div className="flex items-center gap-2 mb-4">
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>{LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
        </Select>
        <CopyButton text={output} />
      </div>
      <pre className="p-4 bg-muted rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap text-foreground">{output}</pre>
    </div>
  );
}
