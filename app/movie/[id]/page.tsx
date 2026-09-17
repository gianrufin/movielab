import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { MovieDetailAnimatedContent } from "@/components/MovieDetailAnimatedContent";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { getMovieDetail } from "@/lib/movie";

export const dynamic = "force-dynamic";

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const tmdbId = parseInt(params.id, 10);
  const movie = Number.isNaN(tmdbId) ? null : await getMovieDetail(tmdbId);

  if (!movie) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-ink-300">Couldn&apos;t load this title.</p>
        <Link href="/" className="text-sm text-accent hover:underline">
          Back to search
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <header className="flex items-center justify-between px-5 py-5">
        <Link href="/" aria-label="Back to search">
          <ArrowLeft size={20} className="text-ink-300 hover:text-ink-100 transition-colors" strokeWidth={1.75} />
        </Link>
        <Logo />
        <PWAInstallButton />
      </header>

      <MovieDetailAnimatedContent movie={movie} />
    </main>
  );
}
