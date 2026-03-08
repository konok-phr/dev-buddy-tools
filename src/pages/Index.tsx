import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Terminal, Star, Clock } from "lucide-react";
import { tools, categories } from "@/config/tools";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavorites, useRecents } from "@/hooks/use-preferences";
import { SEO } from "@/components/SEO";

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { favorites, toggleFav, isFav } = useFavorites();
  const { recents, addRecent } = useRecents();
  const navigate = useNavigate();

  const filtered = tools.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  const favTools = tools.filter(t => favorites.includes(t.id));
  const recentTools = recents.map(id => tools.find(t => t.id === id)).filter(Boolean) as typeof tools;

  const handleToolClick = (tool: typeof tools[0]) => {
    addRecent(tool.id);
    navigate(tool.path);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <SEO
        title="DevTools Hub — 90+ Free Online Developer Tools"
        description="Free online developer tools suite: JSON formatter, Base64 encoder, regex tester, API tester, SQL playground, PDF viewer, CSS generators and 90+ more tools. Fast, private, runs in your browser."
        path="/"
        keywords="developer tools, online tools, json formatter, base64 encoder, regex tester, uuid generator, css generator, pdf tools, free dev tools"
      />
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <Terminal className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">DevTools Hub</h1>
        </div>
        <p className="text-muted-foreground">
          Free, fast, client-side developer tools. No sign-up required.
        </p>
        <Badge variant="secondary" className="mt-3 text-sm font-mono">
          {tools.length} tools available
        </Badge>
      </div>

      {/* Favorites */}
      {favTools.length > 0 && !search && !activeCategory && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> Favorites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} isFav={true} onToggleFav={() => toggleFav(tool.id)} onClick={() => handleToolClick(tool)} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Tools */}
      {recentTools.length > 0 && !search && !activeCategory && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" /> Recently Used
          </h2>
          <div className="flex gap-2 flex-wrap">
            {recentTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="flex items-center gap-2 bg-card border border-border rounded-md px-3 py-1.5 text-sm hover:border-primary/50 transition-colors"
              >
                <tool.icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-foreground">{tool.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-12 py-6 text-base bg-card border-border rounded-xl w-full"
          />
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-xs text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        <Badge
          variant={activeCategory === null ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => setActiveCategory(null)}
        >
          All
        </Badge>
        {categories.map(cat => (
          <Badge
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(tool => (
          <ToolCard key={tool.id} tool={tool} isFav={isFav(tool.id)} onToggleFav={() => toggleFav(tool.id)} onClick={() => handleToolClick(tool)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No tools found matching your search.
        </div>
      )}
    </div>
  );
};

function ToolCard({ tool, isFav, onToggleFav, onClick }: {
  tool: typeof tools[0]; isFav: boolean; onToggleFav: () => void; onClick: () => void;
}) {
  return (
    <div className="group relative rounded-lg border border-border bg-card p-5 hover:border-primary/50 hover:bg-card/80 transition-all cursor-pointer" onClick={onClick}>
      <button
        onClick={e => { e.stopPropagation(); onToggleFav(); }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        title={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        <Star className={`h-4 w-4 ${isFav ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground hover:text-yellow-500"}`} />
      </button>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          <tool.icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {tool.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
        </div>
      </div>
    </div>
  );
}

export default Index;
