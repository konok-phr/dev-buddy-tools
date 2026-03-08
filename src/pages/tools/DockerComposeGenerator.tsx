import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  image: string;
  ports: string;
  volumes: string;
  environment: string;
  restart: string;
  dependsOn: string;
  command: string;
}

const PRESETS: Record<string, Service[]> = {
  "node-mongo": [
    { id: "1", name: "app", image: "node:20-alpine", ports: "3000:3000", volumes: "./:/app", environment: "NODE_ENV=production", restart: "unless-stopped", dependsOn: "mongo", command: "npm start" },
    { id: "2", name: "mongo", image: "mongo:7", ports: "27017:27017", volumes: "mongo_data:/data/db", environment: "MONGO_INITDB_ROOT_USERNAME=root\nMONGO_INITDB_ROOT_PASSWORD=secret", restart: "unless-stopped", dependsOn: "", command: "" },
  ],
  "nginx-php": [
    { id: "1", name: "nginx", image: "nginx:alpine", ports: "80:80", volumes: "./nginx.conf:/etc/nginx/nginx.conf\n./src:/var/www/html", environment: "", restart: "unless-stopped", dependsOn: "php", command: "" },
    { id: "2", name: "php", image: "php:8.2-fpm", ports: "", volumes: "./src:/var/www/html", environment: "", restart: "unless-stopped", dependsOn: "", command: "" },
  ],
  "postgres-redis": [
    { id: "1", name: "postgres", image: "postgres:16-alpine", ports: "5432:5432", volumes: "pg_data:/var/lib/postgresql/data", environment: "POSTGRES_DB=mydb\nPOSTGRES_USER=user\nPOSTGRES_PASSWORD=secret", restart: "unless-stopped", dependsOn: "", command: "" },
    { id: "2", name: "redis", image: "redis:7-alpine", ports: "6379:6379", volumes: "redis_data:/data", environment: "", restart: "unless-stopped", dependsOn: "", command: "" },
  ],
};

function newService(): Service {
  return { id: crypto.randomUUID(), name: "", image: "", ports: "", volumes: "", environment: "", restart: "unless-stopped", dependsOn: "", command: "" };
}

function generateCompose(services: Service[], version: string): string {
  const lines: string[] = [];
  if (version) lines.push(`version: "${version}"`, "");
  lines.push("services:");

  for (const s of services) {
    if (!s.name || !s.image) continue;
    lines.push(`  ${s.name}:`);
    lines.push(`    image: ${s.image}`);
    if (s.command) lines.push(`    command: ${s.command}`);
    if (s.restart) lines.push(`    restart: ${s.restart}`);
    if (s.ports) {
      lines.push("    ports:");
      s.ports.split("\n").filter(Boolean).forEach(p => lines.push(`      - "${p.trim()}"`));
    }
    if (s.volumes) {
      lines.push("    volumes:");
      s.volumes.split("\n").filter(Boolean).forEach(v => lines.push(`      - ${v.trim()}`));
    }
    if (s.environment) {
      lines.push("    environment:");
      s.environment.split("\n").filter(Boolean).forEach(e => lines.push(`      - ${e.trim()}`));
    }
    if (s.dependsOn) {
      lines.push("    depends_on:");
      s.dependsOn.split(",").map(d => d.trim()).filter(Boolean).forEach(d => lines.push(`      - ${d}`));
    }
    lines.push("");
  }

  // Collect named volumes
  const namedVolumes: string[] = [];
  for (const s of services) {
    if (s.volumes) {
      s.volumes.split("\n").filter(Boolean).forEach(v => {
        const src = v.trim().split(":")[0];
        if (!src.startsWith(".") && !src.startsWith("/")) namedVolumes.push(src);
      });
    }
  }
  if (namedVolumes.length > 0) {
    lines.push("volumes:");
    [...new Set(namedVolumes)].forEach(v => lines.push(`  ${v}:`));
  }

  return lines.join("\n");
}

export default function DockerComposeGenerator() {
  const [services, setServices] = useState<Service[]>(PRESETS["node-mongo"]);
  const [version, setVersion] = useState("3.8");

  const yaml = generateCompose(services, version);

  const updateService = (id: string, field: keyof Service, value: string) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="Docker Compose Generator" description="Build docker-compose.yml visually with presets" />

      <div className="flex flex-wrap gap-2 mb-4">
        <p className="text-xs text-muted-foreground w-full">Presets:</p>
        {Object.keys(PRESETS).map(k => (
          <Badge key={k} variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setServices(PRESETS[k].map(s => ({ ...s, id: crypto.randomUUID() })))}>
            {k}
          </Badge>
        ))}
      </div>

      <div className="space-y-4 mb-4">
        {services.map((s, idx) => (
          <div key={s.id} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Service {idx + 1}</span>
              {services.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => setServices(services.filter(x => x.id !== s.id))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input value={s.name} onChange={e => updateService(s.id, "name", e.target.value)} placeholder="Service name" className="text-sm font-mono" />
              <Input value={s.image} onChange={e => updateService(s.id, "image", e.target.value)} placeholder="Image (e.g. node:20)" className="text-sm font-mono" />
              <Input value={s.ports} onChange={e => updateService(s.id, "ports", e.target.value)} placeholder="Ports (3000:3000)" className="text-sm font-mono" />
              <Input value={s.command} onChange={e => updateService(s.id, "command", e.target.value)} placeholder="Command" className="text-sm font-mono" />
              <Input value={s.volumes} onChange={e => updateService(s.id, "volumes", e.target.value)} placeholder="Volumes (./:/app)" className="text-sm font-mono" />
              <Input value={s.dependsOn} onChange={e => updateService(s.id, "dependsOn", e.target.value)} placeholder="Depends on" className="text-sm font-mono" />
            </div>
            <Input value={s.environment} onChange={e => updateService(s.id, "environment", e.target.value)} placeholder="Environment (KEY=value, one per line)" className="text-sm font-mono" />
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="mb-6" onClick={() => setServices([...services, newService()])}>
        <Plus className="h-3.5 w-3.5 mr-1" />Add Service
      </Button>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">docker-compose.yml</h3>
          <CopyButton text={yaml} />
        </div>
        <pre className="text-sm font-mono text-foreground bg-muted p-3 rounded overflow-x-auto whitespace-pre">{yaml}</pre>
      </div>
    </div>
  );
}
