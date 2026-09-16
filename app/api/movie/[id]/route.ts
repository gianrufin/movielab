import { NextRequest, NextResponse } from "next/server";
import { getMovieMetadata } from "@/lib/tmdb";
import { getImdbAndRTRatings } from "@/lib/scrapers/omdb";
import { getLetterboxdRating } from "@/lib/scrapers/letterboxd";
import { withCache } from "@/lib/cache";
import { MovieDetail, ReviewSnippet } from "@/lib/types";
import { generateConsensus } from "@/lib/consensus";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const tmdbId = parseInt(params.id, 10);
  if (Number.isNaN(tmdbId)) {
    return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
  }

  try {
    const payload = await withCache<MovieDetail>(
      `movie:${tmdbId}`,
      () => buildMovieDetail(tmdbId),
      60 * 60 * 12 // 12h
    );
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[api/movie] failed:", err);
    return NextResponse.json({ error: "Could not load this title" }, { status: 502 });
  }
}

async function buildMovieDetail(tmdbId: number): Promise<MovieDetail> {
  const meta = await getMovieMetadata(tmdbId);

  // Ratings + reviews are fetched in parallel and each source fails
  // independently — one blocked scraper never takes the others down.
  const [omdbResult, letterboxdResult] = await Promise.allSettled([
    meta.imdbId ? getImdbAndRTRatings(meta.imdbId) : Promise.resolve(null),
    getLetterboxdRating(meta.title, meta.year),
  ]);

  const omdb = omdbResult.status === "fulfilled" ? omdbResult.value : null;
  const letterboxd =
    letterboxdResult.status === "fulfilled"
      ? letterboxdResult.value
      : { rating: fallbackRating(), reviews: [] as ReviewSnippet[] };

  const ratings = {
    imdb: omdb?.imdb ?? fallbackRating(),
    rottenTomatoes: {
      ...(omdb?.rtCritics ?? fallbackRating()),
      audienceScore: omdb?.rtAudience ?? fallbackRating(),
    },
    letterboxd: letterboxd.rating,
  };

  // Best-effort review corpus for the AI summarizer. In production, pull
  // real review text per-source (OMDb doesn't include prose, so IMDb/RT
  // snippets would need their own compliant source — see omdb.ts notes);
  // Letterboxd blurbs come from the scraper above.
  const reviewCorpus: ReviewSnippet[] = [...letterboxd.reviews];

  const consensus =
    reviewCorpus.length > 0
      ? await generateConsensus(meta.title, reviewCorpus).catch((err) => {
          console.error("[consensus] generation failed:", err);
          return null;
        })
      : null;

  return {
    id: meta.id,
    title: meta.title,
    year: meta.year,
    overview: meta.overview,
    posterUrl: meta.posterUrl,
    backdropUrl: meta.backdropUrl,
    trailerYouTubeId: meta.trailerYouTubeId,
    ratings,
    consensus,
  };
}

function fallbackRating() {
  return { available: false, score: null, displayScore: "—", voteCount: null, url: "" };
}
