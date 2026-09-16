"use client";

import { useState } from "react";
import { Play } from "lucide-react";

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

  // Fixed aspect-video box for both states — swapping the image for the
  // iframe inside the same container is what avoids layout shift, rather
  // than conditionally mounting elements of different intrinsic sizes.
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-card border border-base-700 bg-base-900">
      {playing && trailerYouTubeId ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${trailerYouTubeId}?autoplay=1&rel=0`}
          title={`${title} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={`${title} poster`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-base-950/80 via-base-950/10 to-transparent" />

          {trailerYouTubeId && (
            <button
              onClick={() => setPlaying(true)}
              aria-label={`Play trailer for ${title}`}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-base-950/60 border border-ink-100/20 backdrop-blur-sm transition-transform group-hover:scale-105 group-active:scale-95">
                <Play size={24} className="text-ink-100 ml-0.5" strokeWidth={1.75} fill="currentColor" />
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
