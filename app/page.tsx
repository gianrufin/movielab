import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";

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
      </section>
    </main>
  );
}
