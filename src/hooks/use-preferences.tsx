import { createContext, useContext, useState, useEffect, useCallback } from "react";

// ── Theme ──
type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("devtools-theme") as Theme) || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("devtools-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme(t => (t === "dark" ? "light" : "dark")), []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

// ── Favorites ──
interface FavContextType {
  favorites: string[];
  toggleFav: (id: string) => void;
  isFav: (id: string) => boolean;
  exportFavorites: () => string;
  importFavorites: (data: string) => boolean;
  clearFavorites: () => void;
}

const FavContext = createContext<FavContextType>({
  favorites: [],
  toggleFav: () => {},
  isFav: () => false,
  exportFavorites: () => "",
  importFavorites: () => false,
  clearFavorites: () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("devtools-favorites") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("devtools-favorites", JSON.stringify(favorites)); }, [favorites]);

  const toggleFav = (id: string) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  const isFav = (id: string) => favorites.includes(id);

  const exportFavorites = useCallback(() => {
    return JSON.stringify({ favorites, exportedAt: new Date().toISOString() });
  }, [favorites]);

  const importFavorites = useCallback((data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed.favorites)) {
        setFavorites(parsed.favorites);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  return (
    <FavContext.Provider value={{ favorites, toggleFav, isFav, exportFavorites, importFavorites, clearFavorites }}>
      {children}
    </FavContext.Provider>
  );
}

export const useFavorites = () => useContext(FavContext);

// ── Recent Tools ──
const RecentContext = createContext<{ recents: string[]; addRecent: (id: string) => void }>({
  recents: [], addRecent: () => {},
});

export function RecentsProvider({ children }: { children: React.ReactNode }) {
  const [recents, setRecents] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("devtools-recents") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("devtools-recents", JSON.stringify(recents)); }, [recents]);

  const addRecent = useCallback((id: string) => {
    setRecents(r => [id, ...r.filter(x => x !== id)].slice(0, 8));
  }, []);

  return <RecentContext.Provider value={{ recents, addRecent }}>{children}</RecentContext.Provider>;
}

export const useRecents = () => useContext(RecentContext);

// ── Usage Stats ──
interface ToolStats {
  [toolId: string]: { count: number; lastUsed: string };
}

interface StatsContextType {
  stats: ToolStats;
  trackUsage: (toolId: string) => void;
  getMostUsed: (limit?: number) => { id: string; count: number }[];
  getTotalUsage: () => number;
  clearStats: () => void;
}

const StatsContext = createContext<StatsContextType>({
  stats: {},
  trackUsage: () => {},
  getMostUsed: () => [],
  getTotalUsage: () => 0,
  clearStats: () => {},
});

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<ToolStats>(() => {
    try { return JSON.parse(localStorage.getItem("devtools-stats") || "{}"); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem("devtools-stats", JSON.stringify(stats)); }, [stats]);

  const trackUsage = useCallback((toolId: string) => {
    setStats(s => ({
      ...s,
      [toolId]: {
        count: (s[toolId]?.count || 0) + 1,
        lastUsed: new Date().toISOString(),
      },
    }));
  }, []);

  const getMostUsed = useCallback((limit = 5) => {
    return Object.entries(stats)
      .map(([id, data]) => ({ id, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [stats]);

  const getTotalUsage = useCallback(() => {
    return Object.values(stats).reduce((sum, d) => sum + d.count, 0);
  }, [stats]);

  const clearStats = useCallback(() => setStats({}), []);

  return (
    <StatsContext.Provider value={{ stats, trackUsage, getMostUsed, getTotalUsage, clearStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export const useStats = () => useContext(StatsContext);
