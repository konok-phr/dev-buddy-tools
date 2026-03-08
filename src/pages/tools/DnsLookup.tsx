import { useState, useCallback } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertCircle, Globe, Calendar, Building, Shield, History, List } from "lucide-react";

interface DnsRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DomainInfo {
  domain: string;
  status: string[];
  registered: boolean;
  registrar?: string;
  createdDate?: string;
  expiryDate?: string;
  updatedDate?: string;
  nameservers?: string[];
  dnssec?: string;
  events?: { action: string; date: string }[];
}

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "SRV"];

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return dateStr; }
}

function formatDateTime(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return dateStr; }
}

function getDaysUntilExpiry(dateStr: string | undefined) {
  if (!dateStr) return null;
  try {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch { return null; }
}

function getExpiryBadge(days: number | null) {
  if (days === null) return null;
  if (days < 0) return <Badge variant="destructive" className="ml-2">Expired {Math.abs(days)} days ago</Badge>;
  if (days <= 30) return <Badge variant="destructive" className="ml-2">Expires in {days} days</Badge>;
  if (days <= 90) return <Badge variant="outline" className="ml-2 text-accent-foreground">Expires in {days} days</Badge>;
  return <Badge variant="secondary" className="ml-2">{days} days remaining</Badge>;
}

function cleanDomainName(d: string) {
  return d.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
}

async function fetchDomainInfo(rawDomain: string): Promise<DomainInfo> {
  const cleanDomain = cleanDomainName(rawDomain);
  const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(cleanDomain)}`);

  if (res.status === 404) {
    return { domain: cleanDomain, status: [], registered: false };
  }
  if (!res.ok) {
    throw new Error(`RDAP lookup failed (${res.status})`);
  }

  const data = await res.json();
  const statusList: string[] = data.status || [];
  const registered = statusList.length > 0;

  let registrar: string | undefined;
  if (data.entities) {
    const registrarEntity = data.entities.find((e: any) => e.roles?.includes("registrar"));
    if (registrarEntity?.vcardArray?.[1]) {
      const fnField = registrarEntity.vcardArray[1].find((f: any) => f[0] === "fn");
      registrar = fnField?.[3];
    }
  }

  let createdDate: string | undefined;
  let expiryDate: string | undefined;
  let updatedDate: string | undefined;
  const events: { action: string; date: string }[] = [];

  if (data.events) {
    for (const event of data.events) {
      events.push({ action: event.eventAction, date: event.eventDate });
      if (event.eventAction === "registration") createdDate = event.eventDate;
      if (event.eventAction === "expiration") expiryDate = event.eventDate;
      if (event.eventAction === "last changed") updatedDate = event.eventDate;
    }
  }

  const nameservers = data.nameservers?.map((ns: any) => ns.ldhName).filter(Boolean);
  const dnssec = data.secureDNS?.delegationSigned ? "Signed" : "Unsigned";

  return { domain: cleanDomain, status: statusList, registered, registrar, createdDate, expiryDate, updatedDate, nameservers, dnssec, events };
}

export default function DnsLookup() {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState("A");
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null);
  const [domainLoading, setDomainLoading] = useState(false);
  const [domainError, setDomainError] = useState("");
  const [activeTab, setActiveTab] = useState("dns");

  // Bulk check state
  const [bulkInput, setBulkInput] = useState("");
  const [bulkResults, setBulkResults] = useState<DomainInfo[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });

  const lookup = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setRecords([]);
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
      const data = await res.json();
      if (data.Answer) setRecords(data.Answer);
      else if (data.Authority) setRecords(data.Authority);
      else setError("No records found");
    } catch (e: any) {
      setError(`Lookup failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkDomain = async () => {
    if (!domain.trim()) return;
    setDomainLoading(true);
    setDomainError("");
    setDomainInfo(null);
    try {
      const info = await fetchDomainInfo(domain);
      setDomainInfo(info);
    } catch (e: any) {
      setDomainError(`Domain check failed: ${e.message}`);
    } finally {
      setDomainLoading(false);
    }
  };

  const bulkCheck = useCallback(async () => {
    const domains = bulkInput.split("\n").map(d => d.trim()).filter(Boolean);
    if (domains.length === 0) return;

    setBulkLoading(true);
    setBulkResults([]);
    setBulkProgress({ done: 0, total: domains.length });

    const results: DomainInfo[] = [];
    for (let i = 0; i < domains.length; i++) {
      try {
        const info = await fetchDomainInfo(domains[i]);
        results.push(info);
      } catch {
        results.push({ domain: cleanDomainName(domains[i]), status: [], registered: false });
      }
      setBulkProgress({ done: i + 1, total: domains.length });
      setBulkResults([...results]);
      // Small delay to avoid rate limiting
      if (i < domains.length - 1) await new Promise(r => setTimeout(r, 300));
    }
    setBulkLoading(false);
  }, [bulkInput]);

  const handleSearch = () => {
    if (activeTab === "dns") lookup();
    else if (activeTab === "domain") checkDomain();
    else if (activeTab === "bulk") bulkCheck();
  };

  const typeNames: Record<number, string> = { 1: "A", 28: "AAAA", 5: "CNAME", 15: "MX", 2: "NS", 16: "TXT", 6: "SOA", 33: "SRV" };
  const daysUntilExpiry = domainInfo?.expiryDate ? getDaysUntilExpiry(domainInfo.expiryDate) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="DNS & Domain Checker" description="Query DNS records, check domain registration, WHOIS history & bulk check" />

      {activeTab !== "bulk" && (
        <div className="flex gap-2 mb-4">
          <Input
            value={domain}
            onChange={e => setDomain(e.target.value)}
            placeholder="example.com"
            className="font-mono text-sm flex-1"
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          {activeTab === "dns" && (
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RECORD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <Button onClick={handleSearch} disabled={loading || domainLoading}>
            {(loading || domainLoading) ? <Loader2 className="h-4 w-4 animate-spin" /> : activeTab === "dns" ? "Lookup" : "Check"}
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="dns" className="flex-1 gap-1"><Globe className="h-3.5 w-3.5" />DNS</TabsTrigger>
          <TabsTrigger value="domain" className="flex-1 gap-1"><Shield className="h-3.5 w-3.5" />Domain</TabsTrigger>
          <TabsTrigger value="bulk" className="flex-1 gap-1"><List className="h-3.5 w-3.5" />Bulk Check</TabsTrigger>
        </TabsList>

        {/* DNS Records Tab */}
        <TabsContent value="dns">
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}
          {records.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-foreground">{records.length} record(s) found</h2>
                <CopyButton text={records.map(r => `${r.data}`).join("\n")} />
              </div>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-xs">
                      <th className="text-left p-2 font-medium text-muted-foreground">Type</th>
                      <th className="text-left p-2 font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-2 font-medium text-muted-foreground">Value</th>
                      <th className="text-left p-2 font-medium text-muted-foreground">TTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-2 font-mono text-xs text-primary">{typeNames[r.type] || r.type}</td>
                        <td className="p-2 font-mono text-xs text-foreground">{r.name}</td>
                        <td className="p-2 font-mono text-xs text-foreground break-all">{r.data}</td>
                        <td className="p-2 font-mono text-xs text-muted-foreground">{r.TTL}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Domain Checker Tab */}
        <TabsContent value="domain">
          {domainError && <p className="text-sm text-destructive mb-4">{domainError}</p>}

          {domainInfo && !domainInfo.registered && (
            <div className="border rounded-lg p-6 text-center space-y-3">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Domain Available!</h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-mono text-primary">{domain}</span> is not registered and may be available for purchase.
              </p>
            </div>
          )}

          {domainInfo && domainInfo.registered && (
            <div className="space-y-4">
              {/* Status Card */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <h2 className="text-sm font-semibold text-foreground">Domain is Registered</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  {domainInfo.registrar && (
                    <div className="flex items-start gap-2">
                      <Building className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Registrar</p>
                        <p className="text-sm font-medium text-foreground">{domainInfo.registrar}</p>
                      </div>
                    </div>
                  )}
                  {domainInfo.createdDate && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-sm font-medium text-foreground">{formatDate(domainInfo.createdDate)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Expires</p>
                      <div className="flex items-center flex-wrap">
                        <p className="text-sm font-medium text-foreground">{formatDate(domainInfo.expiryDate)}</p>
                        {getExpiryBadge(daysUntilExpiry)}
                      </div>
                    </div>
                  </div>
                  {domainInfo.updatedDate && (
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium text-foreground">{formatDate(domainInfo.updatedDate)}</p>
                      </div>
                    </div>
                  )}
                  {domainInfo.dnssec && (
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">DNSSEC</p>
                        <p className="text-sm font-medium text-foreground">{domainInfo.dnssec}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* WHOIS Event History */}
              {domainInfo.events && domainInfo.events.length > 0 && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold text-muted-foreground">WHOIS Event History</h3>
                  </div>
                  <div className="relative pl-4 border-l-2 border-border space-y-3">
                    {domainInfo.events
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((ev, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[calc(1rem+5px)] top-1.5 h-2 w-2 rounded-full bg-primary" />
                          <p className="text-sm font-medium text-foreground capitalize">
                            {ev.action.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(ev.date)}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Status Tags */}
              {domainInfo.status.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2">Domain Status</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {domainInfo.status.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs font-mono">
                        {s.replace(/https?:\/\/.*$/, "").trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Nameservers */}
              {domainInfo.nameservers && domainInfo.nameservers.length > 0 && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-muted-foreground">Nameservers</h3>
                    <CopyButton text={domainInfo.nameservers.join("\n")} />
                  </div>
                  <div className="space-y-1">
                    {domainInfo.nameservers.map((ns, i) => (
                      <p key={i} className="font-mono text-sm text-foreground">{ns}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Bulk Check Tab */}
        <TabsContent value="bulk">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Enter one domain per line (max 20)</p>
              <Textarea
                value={bulkInput}
                onChange={e => setBulkInput(e.target.value)}
                placeholder={"google.com\nexample.com\nmydomain.xyz\ntest123abc.com"}
                className="font-mono text-sm min-h-[120px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={bulkCheck} disabled={bulkLoading || !bulkInput.trim()}>
                {bulkLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Checking {bulkProgress.done}/{bulkProgress.total}</>
                ) : "Check All Domains"}
              </Button>
              {bulkResults.length > 0 && (
                <CopyButton text={bulkResults.map(r =>
                  `${r.domain}\t${r.registered ? "Registered" : "Available"}\t${r.expiryDate ? formatDate(r.expiryDate) : "N/A"}\t${r.registrar || "N/A"}`
                ).join("\n")} />
              )}
            </div>

            {bulkLoading && (
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }}
                />
              </div>
            )}

            {bulkResults.length > 0 && (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-xs">
                      <th className="text-left p-2 font-medium text-muted-foreground">Domain</th>
                      <th className="text-left p-2 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-2 font-medium text-muted-foreground">Registrar</th>
                      <th className="text-left p-2 font-medium text-muted-foreground">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkResults.map((r, i) => {
                      const days = getDaysUntilExpiry(r.expiryDate);
                      return (
                        <tr key={i} className="border-t border-border">
                          <td className="p-2 font-mono text-xs text-foreground">{r.domain}</td>
                          <td className="p-2">
                            {r.registered ? (
                              <Badge variant="secondary" className="text-xs">Registered</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-primary border-primary">Available</Badge>
                            )}
                          </td>
                          <td className="p-2 text-xs text-muted-foreground">{r.registrar || "—"}</td>
                          <td className="p-2 text-xs text-muted-foreground">
                            <div className="flex items-center flex-wrap">
                              {r.expiryDate ? formatDate(r.expiryDate) : "—"}
                              {days !== null && days <= 90 && getExpiryBadge(days)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {bulkResults.length > 0 && !bulkLoading && (
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Total: {bulkResults.length}</span>
                <span>Available: {bulkResults.filter(r => !r.registered).length}</span>
                <span>Registered: {bulkResults.filter(r => r.registered).length}</span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
