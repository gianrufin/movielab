import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { HeroPoster } from "@/components/HeroPoster";
import { RatingGrid } from "@/components/RatingGrid";
import { ConsensusCard } from "@/components/ConsensusCard";
import { MovieDetail } from "@/lib/types";

async function fetchMovie(id: string): Promise<MovieDetail | null> {
  // Server-side fetch on the same origin — relies on Next's fetch cache
  // in addition to the app-level Redis cache in the route handler itself.
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/movie/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = await fetchMovie(params.id);

  if (!movie) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-ink-300">Couldn&apos;t load this title.</p>
        <Link href="/" className="text-sm text-accent">
          Back to search
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <header className="flex items-center justify-between px-5 py-5">
        <Link href="/" aria-label="Back to search">
          <ArrowLeft size={20} className="text-ink-300" strokeWidth={1.75} />
        </Link>
        <Logo />
        <span className="w-5" /> {/* balances the back arrow for a centered logo */}
      </header>

      <div className="px-5 flex flex-col gap-6">
        <HeroPoster
          posterUrl={movie.posterUrl}
          backdropUrl={movie.backdropUrl}
          trailerYouTubeId={movie.trailerYouTubeId}
          title={movie.title}
        />

        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-2xl font-semibold text-ink-100">{movie.title}</h1>
          <p className="text-sm text-ink-500">{movie.year}</p>
        </div>

        <RatingGrid ratings={movie.ratings} />

        <p className="text-sm leading-relaxed text-ink-300">{movie.overview}</p>

        <ConsensusCard consensus={movie.consensus} />
      </div>
    </main>
  );
}
