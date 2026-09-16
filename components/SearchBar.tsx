"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { MovieSummary } from "@/lib/types";

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
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

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-pill border border-base-700 bg-base-900 px-5 py-3.5 focus-within:border-accent/60 transition-colors">
        <Search size={18} className="text-ink-500 shrink-0" strokeWidth={1.75} />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search a film..."
          className="w-full bg-transparent text-ink-100 placeholder:text-ink-500 outline-none text-[15px]"
        />
        {loading && <Loader2 size={16} className="animate-spin text-ink-500 shrink-0" />}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-card border border-base-700 bg-base-900 shadow-2xl">
          {results.map((movie) => (
            <button
              key={movie.id}
              onClick={() => {
                setOpen(false);
                router.push(`/movie/${movie.id}`);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-base-800 transition-colors"
            >
              <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md bg-base-800">
                {movie.posterUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={movie.posterUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-ink-100">{movie.title}</p>
                <p className="text-xs text-ink-500">{movie.year}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
