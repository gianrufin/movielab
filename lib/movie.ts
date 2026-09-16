import { getMovieMetadata, CURATED_MOVIES } from "@/lib/tmdb";
import { getImdbAndRTRatings } from "@/lib/scrapers/omdb";
import { getLetterboxdRating } from "@/lib/scrapers/letterboxd";
import { findYouTubeTrailer } from "@/lib/scrapers/youtube";
import { withCache } from "@/lib/cache";
import { MovieDetail, ReviewSnippet, RatingSource } from "@/lib/types";
import { generateConsensus } from "@/lib/consensus";

function fallbackRating(): RatingSource {
  return { available: false, score: null, displayScore: "—", voteCount: null, url: "" };
}

export async function getMovieDetail(tmdbId: number): Promise<MovieDetail | null> {
  if (Number.isNaN(tmdbId)) return null;

  try {
    return await withCache<MovieDetail>(
      `movie:${tmdbId}`,
      () => buildMovieDetail(tmdbId),
      60 * 60 * 12 // 12h
    );
  } catch (err: any) {
    console.warn(`[getMovieDetail] Could not load movie ${tmdbId}:`, err.message || err);
    return null;
  }
}

async function buildMovieDetail(tmdbId: number): Promise<MovieDetail> {
  const meta = await getMovieMetadata(tmdbId);
  const curated = CURATED_MOVIES.find((m) => m.id === tmdbId);

  // Ratings + reviews are fetched in parallel and each source fails
  // independently — one blocked scraper never takes the others down.
  const [omdbResult, letterboxdResult] = await Promise.allSettled([
    meta.imdbId ? getImdbAndRTRatings(meta.imdbId) : Promise.resolve(null),
    getLetterboxdRating(meta.title, meta.year, meta.imdbId),
  ]);

  const omdb = omdbResult.status === "fulfilled" ? omdbResult.value : null;
  const letterboxd =
    letterboxdResult.status === "fulfilled"
      ? letterboxdResult.value
      : { rating: fallbackRating(), reviews: [] as ReviewSnippet[] };

  // If live OMDb/Letterboxd scores were empty but we have high-quality curated data for this title,
  // use curated scores so the UI displays the full experience even before user sets up OMDb keys!
  const hasOmdb = omdb && (omdb.imdb.available || omdb.rtCritics.available);
  const hasLetterboxd = letterboxd.rating.available;

  const ratings = {
    imdb: hasOmdb && omdb.imdb.available
      ? omdb.imdb
      : curated?.ratings
      ? {
          available: true,
          score: curated.ratings.imdb.score,
          displayScore: curated.ratings.imdb.displayScore,
          voteCount: curated.ratings.imdb.voteCount,
          url: meta.imdbId ? `https://www.imdb.com/title/${meta.imdbId}/` : "",
        }
      : meta.imdbId
      ? {
          available: false,
          score: null,
          displayScore: "—",
          voteCount: null,
          url: `https://www.imdb.com/title/${meta.imdbId}/`,
        }
      : fallbackRating(),
    rottenTomatoes: {
      ...(hasOmdb && omdb.rtCritics.available
        ? omdb.rtCritics
        : curated?.ratings
        ? {
            available: true,
            score: curated.ratings.rtCritics.score,
            displayScore: curated.ratings.rtCritics.displayScore,
            voteCount: null,
            url: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(meta.title)}`,
          }
        : {
            ...fallbackRating(),
            url: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(meta.title)}`,
          }),
      audienceScore:
        omdb?.rtAudience.available
          ? omdb.rtAudience
          : curated?.ratings
          ? {
              available: true,
              score: curated.ratings.rtAudience.score,
              displayScore: curated.ratings.rtAudience.displayScore,
              voteCount: null,
              url: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(meta.title)}`,
            }
          : fallbackRating(),
    },
    letterboxd: hasLetterboxd
      ? letterboxd.rating
      : curated?.ratings
      ? {
          available: true,
          score: curated.ratings.letterboxd.score,
          displayScore: curated.ratings.letterboxd.displayScore,
          voteCount: curated.ratings.letterboxd.voteCount,
          url: `https://letterboxd.com/search/${encodeURIComponent(meta.title)}/`,
        }
      : {
          ...fallbackRating(),
          url: `https://letterboxd.com/search/${encodeURIComponent(meta.title)}/`,
        },
  };

  const reviewCorpus: ReviewSnippet[] = [...letterboxd.reviews];

  let consensus = null;
  try {
    consensus = await generateConsensus(meta.title, reviewCorpus, meta.overview);
  } catch (err) {
    console.warn("[consensus] generation failed:", err);
  }

  // Fall back to curated consensus if AI generation didn't produce one
  if (!consensus && curated?.consensus) {
    consensus = curated.consensus;
  }

  let trailerYouTubeId = meta.trailerYouTubeId;
  if (!trailerYouTubeId) {
    try {
      trailerYouTubeId = await findYouTubeTrailer(meta.title, meta.year);
    } catch (err) {
      console.warn("[movie] YouTube trailer fallback error:", err);
    }
  }

  return {
    id: meta.id,
    title: meta.title,
    year: meta.year,
    overview: meta.overview,
    posterUrl: meta.posterUrl,
    backdropUrl: meta.backdropUrl,
    trailerYouTubeId,
    ratings,
    consensus,
  };
}
