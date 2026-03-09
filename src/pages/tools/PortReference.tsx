import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";

const PORTS = [
  [20,"FTP Data","TCP"],[21,"FTP Control","TCP"],[22,"SSH/SFTP","TCP"],[23,"Telnet","TCP"],
  [25,"SMTP","TCP"],[53,"DNS","TCP/UDP"],[67,"DHCP Server","UDP"],[68,"DHCP Client","UDP"],
  [80,"HTTP","TCP"],[110,"POP3","TCP"],[119,"NNTP","TCP"],[123,"NTP","UDP"],
  [143,"IMAP","TCP"],[161,"SNMP","UDP"],[194,"IRC","TCP"],[443,"HTTPS","TCP"],
  [445,"SMB","TCP"],[465,"SMTPS","TCP"],[514,"Syslog","UDP"],[587,"SMTP Submission","TCP"],
  [636,"LDAPS","TCP"],[993,"IMAPS","TCP"],[995,"POP3S","TCP"],[1080,"SOCKS Proxy","TCP"],
  [1433,"MSSQL","TCP"],[1521,"Oracle DB","TCP"],[2049,"NFS","TCP/UDP"],[3000,"Dev Server","TCP"],
  [3306,"MySQL","TCP"],[3389,"RDP","TCP"],[5432,"PostgreSQL","TCP"],[5672,"RabbitMQ","TCP"],
  [5900,"VNC","TCP"],[6379,"Redis","TCP"],[8080,"HTTP Alt","TCP"],[8443,"HTTPS Alt","TCP"],
  [9090,"Prometheus","TCP"],[9200,"Elasticsearch","TCP"],[11211,"Memcached","TCP"],[27017,"MongoDB","TCP"],
] as const;

export default function PortReference() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => PORTS.filter(([port, name]) => 
    String(port).includes(search) || name.toLowerCase().includes(search.toLowerCase())
  ), [search]);

  return (
    <div className="max-w-2xl mx-auto">
      <ToolHeader title="Common Ports Reference" description="Quick reference for well-known network ports" />
      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search port or service..." className="mb-4" />
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted text-xs">
            <th className="text-left p-2 font-medium text-muted-foreground">Port</th>
            <th className="text-left p-2 font-medium text-muted-foreground">Service</th>
            <th className="text-left p-2 font-medium text-muted-foreground">Protocol</th>
          </tr></thead>
          <tbody>{filtered.map(([port, name, proto]) => (
            <tr key={port} className="border-t border-border">
              <td className="p-2 font-mono text-primary font-semibold">{port}</td>
              <td className="p-2 text-foreground">{name}</td>
              <td className="p-2 text-muted-foreground">{proto}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
