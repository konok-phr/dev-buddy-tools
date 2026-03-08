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

  const toggle = useCallback(() => {
    document.documentElement.classList.add("theme-transition");
    setTheme(t => (t === "dark" ? "light" : "dark"));
    setTimeout(() => document.documentElement.classList.remove("theme-transition"), 500);
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

// ── Favorites ──
const FavContext = createContext<{ favorites: string[]; toggleFav: (id: string) => void; isFav: (id: string) => boolean }>({
  favorites: [], toggleFav: () => {}, isFav: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("devtools-favorites") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("devtools-favorites", JSON.stringify(favorites)); }, [favorites]);

  const toggleFav = (id: string) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  const isFav = (id: string) => favorites.includes(id);

  return <FavContext.Provider value={{ favorites, toggleFav, isFav }}>{children}</FavContext.Provider>;
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
