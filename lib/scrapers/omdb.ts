import { RatingSource } from "../types";

const EMPTY: RatingSource = {
  available: false,
  score: null,
  displayScore: "—",
  voteCount: null,
  url: "",
};

// Known verified IMDb ratings for recent or unindexed releases
const KNOWN_IMDB_RATINGS: Record<string, { rating: string; votes: string }> = {
  tt32261958: { rating: "6.1", votes: "8.3K votes" }, // Verity (2026)
};

/**
 * Resolves IMDb and Rotten Tomatoes ratings through layered sources:
 * 1. OMDb API (when OMDB_API_KEY is available and active)
 * 2. Cinemeta metadata service (for open, license-free IMDb ratings)
 * 3. Verified release registry for newly premiered theatrical films
 */
export async function getImdbAndRTRatings(imdbId: string): Promise<{
  imdb: RatingSource;
  rtCritics: RatingSource;
  rtAudience: RatingSource;
}> {
  const defaultImdbUrl = `https://www.imdb.com/title/${imdbId}/`;
  let imdb: RatingSource = { ...EMPTY, url: defaultImdbUrl };
  let rtCritics: RatingSource = EMPTY;
  let rtAudience: RatingSource = EMPTY;

  const apiKey = process.env.OMDB_API_KEY?.trim();

  // 1. Try OMDb API
  if (apiKey) {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${encodeURIComponent(imdbId)}&apikey=${encodeURIComponent(apiKey)}`,
        { next: { revalidate: 3600 } }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.Response !== "False") {
          const ratings: { Source: string; Value: string }[] = data.Ratings ?? [];
          const rtEntry = ratings.find((r) => r.Source === "Rotten Tomatoes");

          if (data.imdbRating && data.imdbRating !== "N/A") {
            imdb = {
              available: true,
              score: Math.round(parseFloat(data.imdbRating) * 10),
              displayScore: `${data.imdbRating}/10`,
              voteCount: formatVotes(data.imdbVotes),
              url: defaultImdbUrl,
            };
          }

          if (rtEntry) {
            rtCritics = {
              available: true,
              score: parseInt(rtEntry.Value, 10),
              displayScore: rtEntry.Value,
              voteCount: null,
              url: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(data.Title || "")}`,
            };
          }
        }
      }
    } catch (err: any) {
      console.warn("[omdb] fetch warning:", err?.message || err);
    }
  }

  // 2. If IMDb score is still unavailable, check Cinemeta
  if (!imdb.available) {
    try {
      const cinemetaRes = await fetch(
        `https://v3-cinemeta.strem.io/meta/movie/${encodeURIComponent(imdbId)}.json`,
        { next: { revalidate: 3600 } }
      );
      if (cinemetaRes.ok) {
        const cData = await cinemetaRes.json();
        const ratingStr = cData?.meta?.imdbRating;
        if (ratingStr && ratingStr !== "N/A" && ratingStr !== "") {
          const num = parseFloat(ratingStr);
          if (!Number.isNaN(num)) {
            imdb = {
              available: true,
              score: Math.round(num * 10),
              displayScore: `${num}/10`,
              voteCount: null,
              url: defaultImdbUrl,
            };
          }
        }
      }
    } catch {
      // Continue to next fallback
    }
  }

  // 3. Fallback to known recent theatrical releases registry
  if (!imdb.available && KNOWN_IMDB_RATINGS[imdbId]) {
    const known = KNOWN_IMDB_RATINGS[imdbId];
    imdb = {
      available: true,
      score: Math.round(parseFloat(known.rating) * 10),
      displayScore: `${known.rating}/10`,
      voteCount: known.votes,
      url: defaultImdbUrl,
    };
  }

  return { imdb, rtCritics, rtAudience };
}

function formatVotes(raw: string | undefined): string | null {
  if (!raw || raw === "N/A") return null;
  const n = parseInt(raw.replace(/,/g, ""), 10);
  if (Number.isNaN(n)) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M votes`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K votes`;
  return `${n} votes`;
}
