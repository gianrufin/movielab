import { getMovieMetadata, CURATED_MOVIES } from "@/lib/tmdb";
import { getImdbAndRTRatings } from "@/lib/scrapers/omdb";
import { getLetterboxdRating } from "@/lib/scrapers/letterboxd";
import { getRottenTomatoesRatings } from "@/lib/scrapers/rottentomatoes";
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
  const curated = CURATED_MOVIES.find(
    (m) => m.id === tmdbId || (meta.imdbId && m.imdbId === meta.imdbId)
  );

  // Ratings + reviews are fetched in parallel across IMDb, Rotten Tomatoes, and Letterboxd
  // Each source fails independently — one blocked scraper never brings down the others.
  const [omdbResult, rtResult, letterboxdResult] = await Promise.allSettled([
    meta.imdbId ? getImdbAndRTRatings(meta.imdbId) : Promise.resolve(null),
    getRottenTomatoesRatings(meta.title, meta.year),
    getLetterboxdRating(meta.title, meta.year, meta.imdbId),
  ]);

  const omdb = omdbResult.status === "fulfilled" ? omdbResult.value : null;
  const rtScraped = rtResult.status === "fulfilled" ? rtResult.value : null;
  const letterboxd =
    letterboxdResult.status === "fulfilled"
      ? letterboxdResult.value
      : { rating: fallbackRating(), reviews: [] as ReviewSnippet[] };

  const defaultImdbUrl = meta.imdbId ? `https://www.imdb.com/title/${meta.imdbId}/` : "";
  const defaultRtUrl = `https://www.rottentomatoes.com/search?search=${encodeURIComponent(meta.title)}`;
  const defaultLbUrl = `https://letterboxd.com/search/${encodeURIComponent(meta.title)}/`;

  // 1. IMDb Rating Resolution (Live OMDb / Cinemeta -> Curated -> Fallback)
  let imdbRating: RatingSource;
  if (omdb?.imdb.available) {
    imdbRating = omdb.imdb;
  } else if (curated?.ratings?.imdb) {
    imdbRating = {
      available: true,
      score: curated.ratings.imdb.score,
      displayScore: curated.ratings.imdb.displayScore,
      voteCount: curated.ratings.imdb.voteCount,
      url: defaultImdbUrl,
    };
  } else {
    imdbRating = {
      ...fallbackRating(),
      url: defaultImdbUrl,
    };
  }

  // 2. Rotten Tomatoes Critic Score (Live Scrape -> Curated -> OMDb -> Fallback)
  let rtCriticRating: RatingSource;
  if (rtScraped?.critics.available) {
    rtCriticRating = rtScraped.critics;
  } else if (curated?.ratings?.rtCritics) {
    rtCriticRating = {
      available: true,
      score: curated.ratings.rtCritics.score,
      displayScore: curated.ratings.rtCritics.displayScore,
      voteCount: "Critic Score",
      url: rtScraped?.critics.url || defaultRtUrl,
    };
  } else if (omdb?.rtCritics.available) {
    rtCriticRating = omdb.rtCritics;
  } else {
    rtCriticRating = {
      ...fallbackRating(),
      url: rtScraped?.critics.url || defaultRtUrl,
    };
  }

  // 3. Rotten Tomatoes Audience Score / Popcornmeter (Live Scrape -> Curated -> Fallback)
  let rtAudienceRating: RatingSource;
  if (rtScraped?.audience.available) {
    rtAudienceRating = rtScraped.audience;
  } else if (curated?.ratings?.rtAudience) {
    rtAudienceRating = {
      available: true,
      score: curated.ratings.rtAudience.score,
      displayScore: curated.ratings.rtAudience.displayScore,
      voteCount: "Audience Score",
      url: rtScraped?.audience.url || defaultRtUrl,
    };
  } else {
    rtAudienceRating = {
      ...fallbackRating(),
      url: rtScraped?.audience.url || defaultRtUrl,
    };
  }

  // 4. Letterboxd Rating (Live Scrape -> Curated -> Fallback)
  let lbRating: RatingSource;
  if (letterboxd.rating.available) {
    lbRating = letterboxd.rating;
  } else if (curated?.ratings?.letterboxd) {
    lbRating = {
      available: true,
      score: curated.ratings.letterboxd.score,
      displayScore: curated.ratings.letterboxd.displayScore,
      voteCount: curated.ratings.letterboxd.voteCount,
      url: defaultLbUrl,
    };
  } else {
    lbRating = {
      ...fallbackRating(),
      url: defaultLbUrl,
    };
  }

  const ratings = {
    imdb: imdbRating,
    rottenTomatoes: {
      ...rtCriticRating,
      audienceScore: rtAudienceRating,
    },
    letterboxd: lbRating,
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
    runtime: meta.runtime ?? curated?.runtime ?? null,
    overview: meta.overview,
    genres: meta.genres ?? curated?.genres ?? [],
    directors: (meta.directors && meta.directors.length > 0) ? meta.directors : (curated?.directors ?? []),
    cast: (meta.cast && meta.cast.length > 0) ? meta.cast : (curated?.cast ?? []),
    posterUrl: meta.posterUrl,
    backdropUrl: meta.backdropUrl,
    trailerYouTubeId,
    ratings,
    consensus,
    watchProviders: meta.watchProviders ?? curated?.watchProviders ?? null,
  };
}
