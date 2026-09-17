import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { PWAInstallButton } from "@/components/PWAInstallButton";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-5 py-5">
        <Logo />
        <PWAInstallButton />
      </header>

      <section className="flex-1 flex flex-col items-center pt-16 sm:pt-24 md:pt-28 gap-8 px-5">
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
