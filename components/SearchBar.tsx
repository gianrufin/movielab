"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  X,
  Film,
  Info,
  Clock,
  SlidersHorizontal,
  Calendar,
  Clapperboard,
  Users,
  Check,
} from "lucide-react";
import { MovieSummary, SearchRefinements } from "@/lib/types";

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
  const [yearFilter, setYearFilter] = useState("");
  const [directorFilter, setDirectorFilter] = useState("");
  const [castFilter, setCastFilter] = useState("");
  const [showRefineBar, setShowRefineBar] = useState(false);

  const [results, setResults] = useState<MovieSummary[]>([]);
  const [refinements, setRefinements] = useState<SearchRefinements | null>(null);
  const [detectedFilters, setDetectedFilters] = useState<{ year?: string; person?: string } | null>(
    null
  );
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

  const addToHistory = (movie: {
    id: number;
    title: string;
    year?: string;
    posterUrl?: string | null;
  }) => {
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

  // Perform debounced search query with active filters
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setRefinements(null);
      setDetectedFilters(null);
      setSelectedIndex(-1);
      return;
    }

    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.set("q", trimmed);
        if (yearFilter.trim()) params.set("year", yearFilter.trim());
        if (directorFilter.trim()) params.set("director", directorFilter.trim());
        if (castFilter.trim()) params.set("cast", castFilter.trim());

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setRefinements(data.refinements ?? null);
        setDetectedFilters(data.detectedFilters ?? null);
        setHasLiveTmdb(Boolean(data.hasLiveTmdb));
        setOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.warn("[search] query failed", err);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(handle);
  }, [query, yearFilter, directorFilter, castFilter]);

  // Click outside listener
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
  const hasActiveFilters = Boolean(yearFilter || directorFilter || castFilter);

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

  const handleSelectMovie = (movie: {
    id: number;
    title: string;
    year?: string;
    posterUrl?: string | null;
  }) => {
    addToHistory(movie);
    setOpen(false);
    router.push(`/movie/${movie.id}`);
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setRefinements(null);
    setDetectedFilters(null);
    setSelectedIndex(-1);
    if (history.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    inputRef.current?.focus();
  };

  const clearAllFilters = () => {
    setYearFilter("");
    setDirectorFilter("");
    setCastFilter("");
  };

  const isShowingHistory = open && query.trim().length < 2 && history.length > 0;
  const isShowingResults = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Main Search Input Box */}
      <div className="flex items-center gap-2.5 rounded-pill border border-base-700 bg-base-900 px-4 py-3 sm:py-3.5 focus-within:border-accent/60 transition-colors shadow-sm">
        <Search size={18} className="text-ink-500 shrink-0 ml-1" strokeWidth={1.75} />
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search films, year, director, or actor (e.g. Dune 1984, Batman Nolan)..."
          className="w-full bg-transparent text-ink-100 placeholder:text-ink-500 outline-none text-[14px] sm:text-[15px]"
        />

        {/* Refine Filters Toggle Button */}
        <button
          type="button"
          onClick={() => setShowRefineBar((prev) => !prev)}
          title="Refine search by year, director, or actor"
          aria-label="Refine search"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium transition-colors shrink-0 ${
            hasActiveFilters || showRefineBar
              ? "bg-accent text-base-950 font-semibold"
              : "text-ink-400 hover:text-ink-100 bg-base-800/80 hover:bg-base-800"
          }`}
        >
          <SlidersHorizontal size={12} strokeWidth={2} />
          <span className="hidden sm:inline">Refine</span>
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-base-950 text-[10px] text-accent font-bold">
              {[yearFilter, directorFilter, castFilter].filter(Boolean).length}
            </span>
          )}
        </button>

        {loading && <Loader2 size={16} className="animate-spin text-accent shrink-0" />}

        {!loading && query.length > 0 && (
          <button
            type="button"
            onClick={clearQuery}
            aria-label="Clear search"
            className="text-ink-500 hover:text-ink-200 transition-colors p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Active Filter Chips Bar (Shown if filters or auto-detected filters are set) */}
      {(hasActiveFilters || detectedFilters?.year || detectedFilters?.person) && (
        <div className="flex items-center gap-2 mt-2 px-1 flex-wrap text-xs animate-in fade-in-50 duration-150">
          <span className="text-ink-500 font-medium text-[11px]">Filtered by:</span>

          {yearFilter ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-accent/15 border border-accent/30 text-accent font-mono">
              <Calendar size={11} />
              <span>Year: {yearFilter}</span>
              <button
                type="button"
                onClick={() => setYearFilter("")}
                className="hover:text-ink-100 ml-0.5 p-0.5"
                title="Remove year filter"
              >
                <X size={11} />
              </button>
            </span>
          ) : detectedFilters?.year ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-base-800/90 border border-base-700 text-ink-300 font-mono text-[11px]">
              <Calendar size={11} className="text-accent" />
              <span>Auto-Year: {detectedFilters.year}</span>
            </span>
          ) : null}

          {directorFilter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
              <Clapperboard size={11} />
              <span>Dir: {directorFilter}</span>
              <button
                type="button"
                onClick={() => setDirectorFilter("")}
                className="hover:text-emerald-100 ml-0.5 p-0.5"
                title="Remove director filter"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {castFilter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-sky-950/80 border border-sky-500/40 text-sky-300">
              <Users size={11} />
              <span>Actor: {castFilter}</span>
              <button
                type="button"
                onClick={() => setCastFilter("")}
                className="hover:text-sky-100 ml-0.5 p-0.5"
                title="Remove cast filter"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[11px] font-medium text-ink-500 hover:text-accent transition-colors underline underline-offset-2 ml-1"
            >
              Reset all
            </button>
          )}
        </div>
      )}

      {/* Expandable Manual Refinement Drawer */}
      {showRefineBar && (
        <div className="mt-2.5 p-3.5 rounded-card border border-base-700 bg-base-900/95 backdrop-blur-md shadow-xl animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-base-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-200">
              <SlidersHorizontal size={13} className="text-accent" />
              <span>Refine Movie Search</span>
            </div>
            <p className="text-[11px] text-ink-500">
              Narrow down multiple versions or same titles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Year Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-ink-400 flex items-center gap-1">
                <Calendar size={11} className="text-accent" />
                <span>Release Year</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1984 or 2021"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full bg-base-950 border border-base-700 rounded-md px-2.5 py-1.5 text-xs text-ink-100 placeholder:text-ink-600 focus:border-accent outline-none font-mono"
              />
            </div>

            {/* Director Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-ink-400 flex items-center gap-1">
                <Clapperboard size={11} className="text-emerald-400" />
                <span>Director</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Nolan, Villeneuve, Lynch"
                value={directorFilter}
                onChange={(e) => setDirectorFilter(e.target.value)}
                className="w-full bg-base-950 border border-base-700 rounded-md px-2.5 py-1.5 text-xs text-ink-100 placeholder:text-ink-600 focus:border-accent outline-none"
              />
            </div>

            {/* Cast / Actor Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-ink-400 flex items-center gap-1">
                <Users size={11} className="text-sky-400" />
                <span>Lead Actor / Cast</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Chalamet, Bale, DiCaprio"
                value={castFilter}
                onChange={(e) => setCastFilter(e.target.value)}
                className="w-full bg-base-950 border border-base-700 rounded-md px-2.5 py-1.5 text-xs text-ink-100 placeholder:text-ink-600 focus:border-accent outline-none"
              />
            </div>
          </div>
        </div>
      )}

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
          {/* Quick Refinement Suggestions (displayed when multiple movies or same titles exist) */}
          {refinements &&
            (refinements.hasMultipleSameTitle ||
              refinements.years.length > 1 ||
              refinements.directors.length > 1) && (
              <div className="px-4 py-2.5 bg-base-950 border-b border-base-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-ink-400">
                  <span className="flex items-center gap-1.5 text-accent font-semibold">
                    <SlidersHorizontal size={12} />
                    <span>Quick Refine (Same / Multiple Titles)</span>
                  </span>
                  <span className="text-ink-500">Tap to filter</span>
                </div>

                {/* Years Pills */}
                {refinements.years.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-ink-500 uppercase font-mono mr-0.5">Year:</span>
                    {refinements.years.slice(0, 5).map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setYearFilter(yearFilter === yr ? "" : yr)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                          yearFilter === yr
                            ? "bg-accent text-base-950 font-bold"
                            : "bg-base-850 hover:bg-base-800 text-ink-300 border border-base-750"
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                )}

                {/* Directors Pills */}
                {refinements.directors.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-ink-500 uppercase font-mono mr-0.5">Dir:</span>
                    {refinements.directors.slice(0, 4).map((dir) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => setDirectorFilter(directorFilter === dir ? "" : dir)}
                        className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer truncate max-w-[150px] ${
                          directorFilter === dir
                            ? "bg-emerald-400 text-emerald-950 font-bold"
                            : "bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                )}

                {/* Cast / Actor Pills */}
                {refinements.cast.length > 0 && !castFilter && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-ink-500 uppercase font-mono mr-0.5">Cast:</span>
                    {refinements.cast.slice(0, 4).map((actor) => (
                      <button
                        key={actor}
                        type="button"
                        onClick={() => setCastFilter(castFilter === actor ? "" : actor)}
                        className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer truncate max-w-[140px] ${
                          castFilter === actor
                            ? "bg-sky-400 text-sky-950 font-bold"
                            : "bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 border border-sky-500/30"
                        }`}
                      >
                        {actor}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* Results List */}
          {results.length > 0 ? (
            <div className="max-h-[380px] overflow-y-auto divide-y divide-base-800">
              {results.map((movie, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-start gap-3.5 px-4 py-3 text-left transition-colors cursor-pointer ${
                      isSelected ? "bg-base-800 text-ink-100" : "text-ink-300 hover:bg-base-800/70"
                    }`}
                  >
                    {/* Poster Thumbnail */}
                    <div className="h-16 w-11 shrink-0 overflow-hidden rounded-md bg-base-800 border border-base-750 flex items-center justify-center">
                      {movie.posterUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={movie.posterUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Film size={18} className="text-ink-600" />
                      )}
                    </div>

                    {/* Movie Info with Director and Cast */}
                    <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-ink-100 leading-tight">
                          {movie.title}
                        </p>
                        {movie.year && (
                          <span className="rounded bg-base-950 border border-base-700 px-1.5 py-0.2 text-[10px] font-mono text-ink-300 font-semibold">
                            {movie.year}
                          </span>
                        )}
                      </div>

                      {/* Director Display */}
                      {movie.director && (
                        <p className="text-xs text-ink-400 flex items-center gap-1.5 mt-0.5">
                          <Clapperboard size={11} className="text-emerald-400 shrink-0" />
                          <span className="truncate">
                            <span className="text-ink-500 font-medium">Dir:</span> {movie.director}
                          </span>
                        </p>
                      )}

                      {/* Lead Cast Display */}
                      {movie.leadCast && movie.leadCast.length > 0 && (
                        <p className="text-xs text-ink-400 flex items-center gap-1.5">
                          <Users size={11} className="text-sky-400 shrink-0" />
                          <span className="truncate text-ink-400">
                            {movie.leadCast.slice(0, 3).join(", ")}
                          </span>
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <span className="text-[11px] font-mono text-accent shrink-0 uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 self-center">
                        Enter ↵
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : !loading ? (
            <div className="p-5 text-center">
              <p className="text-sm font-medium text-ink-300">
                No films found matching &ldquo;{query}&rdquo;
                {hasActiveFilters ? " with current filters" : ""}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-2 text-xs text-accent hover:underline cursor-pointer"
                >
                  Clear active filters to view all results
                </button>
              )}
              {!hasLiveTmdb && (
                <div className="mt-3 flex items-start gap-2 rounded-md bg-base-800/80 p-2.5 text-left text-xs text-ink-400">
                  <Info size={15} className="text-accent shrink-0 mt-0.5" />
                  <p>
                    Currently searching offline curated titles. Enter your{" "}
                    <span className="font-mono text-ink-200">TMDB_ACCESS_TOKEN</span> in Workspace Settings to search 800,000+ movies!
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
