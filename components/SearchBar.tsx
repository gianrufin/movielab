"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, X, Film, Info, Clock } from "lucide-react";
import { MovieSummary } from "@/lib/types";

interface SearchHistoryItem {
  id: number;
  title: string;
  year?: string;
  posterUrl?: string | null;
  searchedAt: number;
}

const STORAGE_KEY = "filmpulse_search_history";

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieSummary[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [hasLiveTmdb, setHasLiveTmdb] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveHistory = (items: SearchHistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const addToHistory = (movie: { id: number; title: string; year?: string; posterUrl?: string | null }) => {
    const next = [
      {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        posterUrl: movie.posterUrl,
        searchedAt: Date.now(),
      },
      ...history.filter((h) => h.id !== movie.id),
    ].slice(0, 8);
    saveHistory(next);
  };

  const removeHistoryItem = (id: number) => {
    const next = history.filter((h) => h.id !== id);
    saveHistory(next);
  };

  const clearAllHistory = () => {
    saveHistory([]);
  };

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setHasLiveTmdb(Boolean(data.hasLiveTmdb));
        setOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.warn("[search] query failed", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const activeItems = query.trim().length >= 2 ? results : history;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" && activeItems.length > 0) {
        setOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < activeItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : activeItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target =
        selectedIndex >= 0 && activeItems[selectedIndex]
          ? activeItems[selectedIndex]
          : activeItems[0];
      if (target) {
        addToHistory(target);
        setOpen(false);
        router.push(`/movie/${target.id}`);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectMovie = (movie: { id: number; title: string; year?: string; posterUrl?: string | null }) => {
    addToHistory(movie);
    setOpen(false);
    router.push(`/movie/${movie.id}`);
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    if (history.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    inputRef.current?.focus();
  };

  const isShowingHistory = open && query.trim().length < 2 && history.length > 0;
  const isShowingResults = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-pill border border-base-700 bg-base-900 px-5 py-3.5 focus-within:border-accent/60 transition-colors">
        <Search size={18} className="text-ink-500 shrink-0" strokeWidth={1.75} />
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search a film (e.g. Inception, Dune, Oppenheimer)..."
          className="w-full bg-transparent text-ink-100 placeholder:text-ink-500 outline-none text-[15px]"
        />
        {loading && <Loader2 size={16} className="animate-spin text-accent shrink-0" />}
        {!loading && query.length > 0 && (
          <button
            type="button"
            onClick={clearQuery}
            aria-label="Clear search"
            className="text-ink-500 hover:text-ink-200 transition-colors p-0.5"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search history dropdown */}
      {isShowingHistory && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-card border border-base-700 bg-base-900 shadow-2xl animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between px-4 py-2.5 bg-base-950/70 border-b border-base-800 text-xs font-semibold text-ink-400">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-accent" />
              <span>Recent Searches</span>
            </div>
            <button
              type="button"
              onClick={clearAllHistory}
              className="text-[11px] font-medium text-ink-500 hover:text-ink-200 transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="max-h-[340px] overflow-y-auto divide-y divide-base-800">
            {history.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectMovie(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group flex w-full items-center justify-between gap-3.5 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                    isSelected ? "bg-base-800 text-ink-100" : "text-ink-300 hover:bg-base-800/70"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-11 w-8 shrink-0 overflow-hidden rounded bg-base-800 flex items-center justify-center">
                      {item.posterUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.posterUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Film size={14} className="text-ink-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink-100">{item.title}</p>
                      {item.year && <p className="text-xs text-ink-500">{item.year}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="text-[10px] font-mono text-accent uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/10">
                        ↵
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHistoryItem(item.id);
                      }}
                      title="Remove from history"
                      aria-label={`Remove ${item.title} from history`}
                      className="text-ink-600 hover:text-ink-200 p-1 rounded transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live search results dropdown */}
      {isShowingResults && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-card border border-base-700 bg-base-900 shadow-2xl animate-in fade-in-50 duration-150">
          {results.length > 0 ? (
            <div className="max-h-[360px] overflow-y-auto divide-y divide-base-800">
              {results.map((movie, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-center gap-3.5 px-4 py-3 text-left transition-colors cursor-pointer ${
                      isSelected ? "bg-base-800 text-ink-100" : "text-ink-300 hover:bg-base-800/70"
                    }`}
                  >
                    <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md bg-base-800 flex items-center justify-center">
                      {movie.posterUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={movie.posterUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Film size={18} className="text-ink-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink-100">{movie.title}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{movie.year}</p>
                    </div>
                    {isSelected && (
                      <span className="text-[11px] font-mono text-accent shrink-0 uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10">
                        Enter ↵
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : !loading ? (
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-ink-300">
                No films found for &ldquo;{query}&rdquo;
              </p>
              {!hasLiveTmdb ? (
                <div className="mt-2.5 flex items-start gap-2 rounded-md bg-base-800/80 p-2.5 text-left text-xs text-ink-400">
                  <Info size={15} className="text-accent shrink-0 mt-0.5" />
                  <p>
                    Currently searching 8 offline curated titles. Enter your{" "}
                    <span className="font-mono text-ink-200">TMDB_ACCESS_TOKEN</span> in Workspace Settings to search 800,000+ movies!
                  </p>
                </div>
              ) : (
                <p className="text-xs text-ink-500 mt-1">
                  Try checking the spelling or searching by original film title.
                </p>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
