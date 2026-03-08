import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchDialog } from "@/components/SearchDialog";
import { Footer } from "@/components/Footer";
import { Terminal, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-4 gap-3 shrink-0 bg-card/50 backdrop-blur">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">DevTools Hub</span>
            </Link>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs text-muted-foreground gap-2"
                onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
              >
                <Search className="h-3 w-3" />
                <span className="hidden sm:inline">Search tools</span>
                <kbd className="ml-1 px-1 py-0.5 bg-muted rounded text-[10px] font-mono hidden sm:inline">⌘K</kbd>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
          <Footer />
        </div>
      </div>
      <SearchDialog />
    </SidebarProvider>
  );
}
