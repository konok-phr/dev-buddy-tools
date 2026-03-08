import { useState, useRef, useCallback, useEffect } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plug, Unplug, Send, Trash2, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "sent" | "received" | "system";
  data: string;
  timestamp: Date;
}

export default function WebSocketTester() {
  const [url, setUrl] = useState("wss://echo.websocket.org");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState('{"type": "hello", "data": "world"}');
  const [messages, setMessages] = useState<Message[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const uid = () => Math.random().toString(36).slice(2, 8);

  const addMessage = useCallback((msg: Omit<Message, "id" | "timestamp">) => {
    setMessages(prev => [...prev, { ...msg, id: uid(), timestamp: new Date() }]);
  }, []);

  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const connect = () => {
    if (!url.trim()) { toast.error("Enter a WebSocket URL"); return; }
    setConnecting(true);
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setConnected(true);
        setConnecting(false);
        addMessage({ type: "system", data: `Connected to ${url}` });
        toast.success("Connected");
      };

      ws.onmessage = (e) => {
        addMessage({ type: "received", data: typeof e.data === "string" ? e.data : "[Binary data]" });
      };

      ws.onclose = (e) => {
        setConnected(false);
        setConnecting(false);
        addMessage({ type: "system", data: `Disconnected (code: ${e.code}${e.reason ? `, reason: ${e.reason}` : ""})` });
      };

      ws.onerror = () => {
        setConnecting(false);
        addMessage({ type: "system", data: "Connection error" });
        toast.error("Connection failed");
      };

      wsRef.current = ws;
    } catch (err) {
      setConnecting(false);
      toast.error("Invalid WebSocket URL");
    }
  };

  const disconnect = () => {
    wsRef.current?.close();
    wsRef.current = null;
  };

  const sendMessage = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast.error("Not connected");
      return;
    }
    if (!message.trim()) return;
    wsRef.current.send(message);
    addMessage({ type: "sent", data: message });
  };

  const clearMessages = () => setMessages([]);

  useEffect(() => {
    return () => { wsRef.current?.close(); };
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3 } as any);

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader title="WebSocket Tester" description="Connect to WebSocket servers, send and receive messages in real-time" />

      <div className="space-y-4">
        {/* Connection */}
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="wss://echo.websocket.org"
            className="flex-1 font-mono text-sm"
            disabled={connected}
            onKeyDown={e => e.key === "Enter" && !connected && connect()}
          />
          {connected ? (
            <Button variant="destructive" onClick={disconnect}>
              <Unplug className="h-4 w-4 mr-1" /> Disconnect
            </Button>
          ) : (
            <Button onClick={connect} disabled={connecting}>
              <Plug className="h-4 w-4 mr-1" /> {connecting ? "Connecting..." : "Connect"}
            </Button>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30"}`} />
          <span className="text-xs text-muted-foreground">
            {connected ? "Connected" : connecting ? "Connecting..." : "Disconnected"}
          </span>
        </div>

        {/* Send message */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="font-mono text-sm bg-card min-h-[80px] flex-1 resize-y"
              placeholder="Type a message..."
              onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); sendMessage(); } }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Ctrl+Enter to send</p>
            <Button size="sm" onClick={sendMessage} disabled={!connected}>
              <Send className="h-3 w-3 mr-1" /> Send
            </Button>
          </div>
        </div>

        {/* Message Log */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Messages ({messages.length})</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAutoScroll(!autoScroll)}>
                {autoScroll ? <ArrowDown className="h-3 w-3 mr-1" /> : <ArrowUp className="h-3 w-3 mr-1" />}
                {autoScroll ? "Auto-scroll ON" : "Auto-scroll OFF"}
              </Button>
              <Button variant="ghost" size="sm" onClick={clearMessages}>
                <Trash2 className="h-3 w-3 mr-1" /> Clear
              </Button>
            </div>
          </div>

          <div
            ref={logRef}
            className="bg-card border border-border rounded-lg h-[350px] overflow-auto font-mono text-xs"
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No messages yet — connect and start sending
              </div>
            ) : (
              <div className="divide-y divide-border">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-2.5 flex gap-3 ${
                      msg.type === "sent" ? "bg-primary/5" :
                      msg.type === "received" ? "bg-green-500/5" :
                      "bg-muted/50"
                    }`}
                  >
                    <span className="text-muted-foreground shrink-0 w-[85px]">
                      {formatTime(msg.timestamp)}
                    </span>
                    <span className={`shrink-0 w-10 font-semibold ${
                      msg.type === "sent" ? "text-primary" :
                      msg.type === "received" ? "text-green-600 dark:text-green-400" :
                      "text-muted-foreground"
                    }`}>
                      {msg.type === "sent" ? "→ TX" : msg.type === "received" ? "← RX" : "SYS"}
                    </span>
                    <span className="break-all flex-1 whitespace-pre-wrap">{msg.data}</span>
                    {msg.type !== "system" && (
                      <CopyButton text={msg.data} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
