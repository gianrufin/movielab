import { RatingSource } from "../types";

const EMPTY: RatingSource = {
  available: false,
  score: null,
  displayScore: "—",
  voteCount: null,
  url: "",
};

/**
 * IMDb and Rotten Tomatoes both actively fingerprint and block scrapers
 * (rotating markup, JS-rendered scores, aggressive rate limiting), and
 * both sit behind ToS that prohibit automated collection. OMDb is a
 * legitimate, ToS-compliant aggregator that already licenses this data
 * and returns both scores in one call — use it as the primary source
 * rather than scraping IMDb/RT pages directly.
 *
 * Free tier: 1,000 requests/day, keyed by IMDb id for accuracy.
 * https://www.omdbapi.com
 */
export async function getImdbAndRTRatings(imdbId: string): Promise<{
  imdb: RatingSource;
  rtCritics: RatingSource;
  rtAudience: RatingSource;
}> {
  const apiKey = process.env.OMDB_API_KEY?.trim();
  if (!apiKey) {
    return { imdb: EMPTY, rtCritics: EMPTY, rtAudience: EMPTY };
  }

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${encodeURIComponent(imdbId)}&apikey=${encodeURIComponent(apiKey)}`,
      { next: { revalidate: 3600 } }
    );

    if (res.status === 401 || res.status === 403) {
      console.warn("[omdb] OMDb API key is inactive, pending email confirmation, or unauthorized (401).");
      return { imdb: EMPTY, rtCritics: EMPTY, rtAudience: EMPTY };
    }

    if (!res.ok) {
      console.warn(`[omdb] Request returned HTTP ${res.status}`);
      return { imdb: EMPTY, rtCritics: EMPTY, rtAudience: EMPTY };
    }

    const data = await res.json();
    if (data.Response === "False") {
      return { imdb: EMPTY, rtCritics: EMPTY, rtAudience: EMPTY };
    }

    const ratings: { Source: string; Value: string }[] = data.Ratings ?? [];
    const rtEntry = ratings.find((r) => r.Source === "Rotten Tomatoes");

    const imdb: RatingSource =
      data.imdbRating && data.imdbRating !== "N/A"
        ? {
            available: true,
            score: parseFloat(data.imdbRating) * 10,
            displayScore: `${data.imdbRating}/10`,
            voteCount: formatVotes(data.imdbVotes),
            url: `https://www.imdb.com/title/${imdbId}/`,
          }
        : EMPTY;

    const rtCritics: RatingSource = rtEntry
      ? {
          available: true,
          score: parseInt(rtEntry.Value, 10),
          displayScore: rtEntry.Value,
          voteCount: null, // OMDb doesn't expose RT review counts
          url: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(data.Title)}`,
        }
      : EMPTY;

    // OMDb doesn't carry RT's separate audience score — see fetchRTAudienceFallback
    // below for the documented gap and the defensive path around it.
    const rtAudience: RatingSource = EMPTY;

    return { imdb, rtCritics, rtAudience };
  } catch (err: any) {
    console.warn("[omdb] fetch warning:", err.message || err);
    return { imdb: EMPTY, rtCritics: EMPTY, rtAudience: EMPTY };
  }
}

function formatVotes(raw: string | undefined): string | null {
  if (!raw || raw === "N/A") return null;
  const n = parseInt(raw.replace(/,/g, ""), 10);
  if (Number.isNaN(n)) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M votes`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K votes`;
  return `${n} votes`;
}

/**
 * RT's audience score isn't in OMDb's payload. If you need it, the
 * pragmatic options, in order of preference:
 *  1. Pay for the official Rotten Tomatoes API (requires a partner
 *     agreement — not self-serve, but the only fully compliant route).
 *  2. Render the RT page with Puppeteer and read the score out of the
 *     embedded JSON-LD/`<score-board>` custom element, respecting
 *     robots.txt and rate limits, cached hard (12–24h) to minimize hits.
 *  3. Omit it and show "Audience score unavailable" in the UI — the
 *     defensive default this project ships with.
 * Left unimplemented here deliberately; wire in whichever path fits
 * your risk tolerance and swap it into omdb.ts's rtAudience field.
 */
export async function fetchRTAudienceFallback(_title: string, _year: string) {
  return EMPTY;
}
