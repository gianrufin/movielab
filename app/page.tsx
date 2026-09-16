import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";

// Curated rather than "trending now" — a fixed, editorially-chosen rail
// avoids an extra API call on the landing page and never shows an empty
// state while trending data loads.
const QUICK_ACCESS = [
  { id: 27205, label: "Inception" },
  { id: 155, label: "The Dark Knight" },
  { id: 693134, label: "Dune: Part Two" },
  { id: 447365, label: "Guardians Vol. 3" },
  { id: 872585, label: "Oppenheimer" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-5 py-5">
        <Logo />
      </header>

      <section className="flex-1 flex flex-col items-center justify-center gap-8 px-5 -mt-16">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-100">
            Every rating.
            <br />
            One read.
          </h1>
          <p className="max-w-xs text-sm text-ink-500">
            Search a film to see IMDb, Rotten Tomatoes, and Letterboxd side
            by side, with an audience consensus underneath.
          </p>
        </div>

        <SearchBar autoFocus />

        <div className="pill-rail flex gap-2 overflow-x-auto w-full max-w-xl px-1 [scrollbar-width:none]">
          {QUICK_ACCESS.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="shrink-0 rounded-pill border border-base-700 bg-base-900 px-4 py-2 text-sm text-ink-300 hover:border-base-600 hover:text-ink-100 transition-colors"
            >
              {movie.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
