import { Terminal, Heart, Linkedin, Facebook } from "lucide-react";


export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 px-4 py-6 mt-auto">
      <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Terminal className="h-4 w-4 text-primary shrink-0" />
            <span>DevTools Hub</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Free & open-source developer tools</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-destructive" /> by{" "}
              <a href="https://www.linkedin.com/in/kssadi" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors font-medium">
                Khaled Saifullah Sadi
              </a>
            </span>
            <div className="flex items-center gap-2">
              <a href="https://www.linkedin.com/in/kssadi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://facebook.com/mdsadi100" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
