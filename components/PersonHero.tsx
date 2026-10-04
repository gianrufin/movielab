"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, X, ArrowUpRight, Film, Sparkles } from "lucide-react";
import { PersonMovieCredit } from "@/lib/types";

interface PersonHeroProps {
  movie: PersonMovieCredit;
  personName: string;
  trailerYouTubeId?: string | null;
}

export function PersonHero({
  movie,
  personName,
  trailerYouTubeId,
}: PersonHeroProps) {
  const [playing, setPlaying] = useState(false);
  const image = movie.backdropUrl ?? movie.posterUrl;

  return (
    <section aria-label="Latest Work" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          <Sparkles size={14} className="fill-current" />
          <span>Latest Release</span>
        </div>
        <span className="text-xs text-ink-500 font-mono">{movie.year}</span>
      </div>

      <div className="relative w-full aspect-video overflow-hidden rounded-card border border-base-700 bg-base-900 group">
        {playing && trailerYouTubeId ? (
          <div className="absolute inset-0 z-10 h-full w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${trailerYouTubeId}?autoplay=1&rel=0`}
              title={`${movie.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={() => setPlaying(false)}
              aria-label="Close trailer"
              className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-pill bg-base-950/85 hover:bg-base-900 border border-base-600 px-3 py-1.5 text-xs font-medium text-ink-100 transition-all shadow-xl backdrop-blur-md cursor-pointer hover:border-ink-400"
            >
              <X size={13} strokeWidth={2.2} />
              <span>Close Trailer</span>
            </button>
          </div>
        ) : (
          <>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={`${movie.title} backdrop`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-base-900 text-ink-700">
                <Film size={48} strokeWidth={1} />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-base-950/90 via-base-950/40 to-transparent" />

            {trailerYouTubeId && (
              <button
                onClick={() => setPlaying(true)}
                aria-label={`Play trailer for ${movie.title}`}
                className="absolute inset-0 flex flex-col items-center justify-center group/btn cursor-pointer focus:outline-none"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-base-950/75 border border-ink-100/30 backdrop-blur-md shadow-2xl transition-all duration-200 group-hover/btn:scale-110 group-hover/btn:bg-accent group-hover/btn:border-accent group-hover/btn:text-base-950 text-ink-100">
                  <Play size={24} className="ml-1 fill-current" strokeWidth={1.5} />
                </span>
                <span className="mt-2.5 rounded-pill bg-base-950/85 px-3 py-1 text-xs font-medium text-ink-200 backdrop-blur-sm border border-base-700/80 transition-colors group-hover/btn:border-accent/40 group-hover/btn:text-ink-100">
                  Watch Trailer
                </span>
              </button>
            )}

            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3">
              <div className="flex flex-col gap-1 max-w-md">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-pill bg-accent/20 border border-accent/40 px-2 py-0.5 text-[11px] font-semibold text-accent uppercase tracking-wider">
                    {movie.year}
                  </span>
                  {movie.roles.slice(0, 2).map((role) => (
                    <span
                      key={role}
                      className="rounded-pill bg-base-900/85 backdrop-blur-md border border-base-600/70 px-2 py-0.5 text-[11px] font-medium text-ink-200"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-100 drop-shadow-md">
                  {movie.title}
                </h3>
                <p className="text-xs text-ink-300 line-clamp-1 drop-shadow">
                  {personName}’s latest work
                </p>
              </div>

              <Link
                href={`/movie/${movie.id}`}
                className="shrink-0 flex items-center gap-1.5 rounded-pill bg-base-950/85 hover:bg-base-900 border border-base-600/80 px-3.5 py-2 text-xs font-semibold text-ink-100 backdrop-blur-md transition-all hover:border-accent hover:text-accent shadow-lg"
              >
                <span>Movie Details</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
