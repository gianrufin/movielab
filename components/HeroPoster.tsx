"use client";

import { useState } from "react";
import { Play, X, ExternalLink } from "lucide-react";

export function HeroPoster({
  posterUrl,
  backdropUrl,
  trailerYouTubeId,
  title,
}: {
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerYouTubeId: string | null;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const image = backdropUrl ?? posterUrl;

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-card border border-base-700 bg-base-900 group">
      {playing && trailerYouTubeId ? (
        <div className="absolute inset-0 z-10 h-full w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${trailerYouTubeId}?autoplay=1&rel=0`}
            title={`${title} trailer`}
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
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={`${title} poster`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-base-950/85 via-base-950/20 to-transparent" />

          {trailerYouTubeId ? (
            <button
              onClick={() => setPlaying(true)}
              aria-label={`Play trailer for ${title}`}
              className="absolute inset-0 flex flex-col items-center justify-center group/btn cursor-pointer focus:outline-none"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-base-950/75 border border-ink-100/30 backdrop-blur-md shadow-2xl transition-all duration-200 group-hover/btn:scale-110 group-hover/btn:bg-accent group-hover/btn:border-accent group-hover/btn:text-base-950 text-ink-100">
                <Play size={24} className="ml-1 fill-current" strokeWidth={1.5} />
              </span>
              <span className="mt-2.5 rounded-pill bg-base-950/80 px-3.5 py-1 text-xs font-medium text-ink-200 border border-base-700/80 backdrop-blur-sm shadow transition-colors group-hover/btn:text-ink-100 group-hover/btn:border-base-500">
                Watch Trailer
              </span>
            </button>
          ) : (
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} trailer`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-pill bg-base-950/80 border border-base-700 px-3 py-1.5 text-xs text-ink-400 hover:text-ink-100 hover:border-base-500 transition-colors backdrop-blur-sm"
            >
              <ExternalLink size={12} />
              <span>Find trailer on YouTube</span>
            </a>
          )}
        </>
      )}
    </div>
  );
}
