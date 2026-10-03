import * as cheerio from "cheerio";
import { RatingSource } from "../types";

const EMPTY: RatingSource = {
  available: false,
  score: null,
  displayScore: "—",
  voteCount: null,
  url: "",
};

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

function sanitizeSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s_]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

export interface RottenTomatoesResult {
  critics: RatingSource;
  audience: RatingSource;
}

/**
 * Scrapes Rotten Tomatoes for both Tomatometer (critic) and Popcornmeter (audience) scores.
 * Uses direct slug resolution with search page fallback.
 */
export async function getRottenTomatoesRatings(
  title: string,
  year?: string
): Promise<RottenTomatoesResult> {
  const baseSlug = sanitizeSlug(title);
  const dashedSlug = baseSlug.replace(/_/g, "-");

  const candidateUrls: string[] = [
    `https://www.rottentomatoes.com/m/${baseSlug}`,
  ];
  if (year && year !== "—") {
    candidateUrls.push(`https://www.rottentomatoes.com/m/${baseSlug}_${year}`);
  }
  if (dashedSlug !== baseSlug) {
    candidateUrls.push(`https://www.rottentomatoes.com/m/${dashedSlug}`);
  }

  let movieHtml = "";
  let finalUrl = "";

  // 1. Try candidate direct URLs
  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        headers: BROWSER_HEADERS,
        redirect: "follow",
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        movieHtml = await res.text();
        finalUrl = res.url || url;
        break;
      }
    } catch {
      // Continue to next candidate
    }
  }

  // 2. Fallback to RT HTML search if direct slugs missed
  if (!movieHtml) {
    try {
      const searchUrl = `https://www.rottentomatoes.com/search?search=${encodeURIComponent(title)}`;
      const searchRes = await fetch(searchUrl, {
        headers: BROWSER_HEADERS,
        next: { revalidate: 3600 },
      });

      if (searchRes.ok) {
        const searchHtml = await searchRes.text();
        const $s = cheerio.load(searchHtml);
        let foundHref = "";

        $s("search-page-media-row").each((_, el) => {
          if (foundHref) return;
          const rowYear = $s(el).attr("release-year");
          const link = $s(el).find('a[slot="title"], a[data-qa="info-name"]').attr("href");
          if (link) {
            if (
              !year ||
              year === "—" ||
              !rowYear ||
              rowYear === year ||
              Math.abs(parseInt(rowYear, 10) - parseInt(year, 10)) <= 1
            ) {
              foundHref = link;
            }
          }
        });

        if (foundHref) {
          const detailUrl = foundHref.startsWith("http")
            ? foundHref
            : `https://www.rottentomatoes.com${foundHref}`;
          const detailRes = await fetch(detailUrl, {
            headers: BROWSER_HEADERS,
            redirect: "follow",
            next: { revalidate: 3600 },
          });
          if (detailRes.ok) {
            movieHtml = await detailRes.text();
            finalUrl = detailRes.url || detailUrl;
          }
        }
      }
    } catch (err: any) {
      console.warn("[rottentomatoes] search fallback error:", err?.message || err);
    }
  }

  const defaultSearchUrl = `https://www.rottentomatoes.com/search?search=${encodeURIComponent(title)}`;
  const pageUrl = finalUrl || defaultSearchUrl;

  if (!movieHtml) {
    return {
      critics: { ...EMPTY, url: pageUrl },
      audience: { ...EMPTY, url: pageUrl },
    };
  }

  const $ = cheerio.load(movieHtml);
  let criticScore: number | null = null;
  let criticCount: string | null = null;
  let audienceScore: number | null = null;
  let audienceCount: string | null = null;

  // A. Extract Critic score from JSON-LD schema
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).html() ?? "";
      const clean = raw.replace(/\/\*\s*<!\[CDATA\[\s*\*\/|\/\*\s*\]\]>\s*\*\//g, "").trim();
      const data = JSON.parse(clean);
      if (data.aggregateRating && data.aggregateRating.ratingValue != null) {
        const val = parseInt(data.aggregateRating.ratingValue, 10);
        if (!Number.isNaN(val)) {
          criticScore = val;
        }
        const count = data.aggregateRating.reviewCount || data.aggregateRating.ratingCount;
        if (count && typeof count === "number") {
          criticCount = `${count} Reviews`;
        }
      }
    } catch {
      // Continue
    }
  });

  // B. Extract Audience / Popcornmeter score from embedded JSON
  const audienceMatches = movieHtml.match(/"audienceScore":\s*(\{[^}]+\})/);
  if (audienceMatches) {
    try {
      const audObj = JSON.parse(audienceMatches[1]);
      if (audObj.score != null && audObj.score !== "") {
        const parsed = parseInt(audObj.score, 10);
        if (!Number.isNaN(parsed)) {
          audienceScore = parsed;
        }
      }
      if (audObj.bandedRatingCount) {
        audienceCount = audObj.bandedRatingCount;
      } else if (audObj.reviewCount) {
        audienceCount = `${audObj.reviewCount} Ratings`;
      }
    } catch {
      // Continue
    }
  }

  // C. Fallbacks from custom HTML tags or attributes
  if (criticScore == null) {
    const sbMatch =
      movieHtml.match(/tomatometerscore="(\d+)"/i) ||
      movieHtml.match(/critics-score="(\d+)"/i) ||
      movieHtml.match(/tomatometer-score="(\d+)"/i);
    if (sbMatch) {
      criticScore = parseInt(sbMatch[1], 10);
    }
  }

  if (audienceScore == null) {
    const audSbMatch =
      movieHtml.match(/audiencescore="(\d+)"/i) ||
      movieHtml.match(/audience-score="(\d+)"/i);
    if (audSbMatch) {
      audienceScore = parseInt(audSbMatch[1], 10);
    }
  }

  const critics: RatingSource =
    criticScore != null
      ? {
          available: true,
          score: criticScore,
          displayScore: `${criticScore}%`,
          voteCount: criticCount,
          url: pageUrl,
        }
      : { ...EMPTY, url: pageUrl };

  const audience: RatingSource =
    audienceScore != null
      ? {
          available: true,
          score: audienceScore,
          displayScore: `${audienceScore}%`,
          voteCount: audienceCount,
          url: pageUrl,
        }
      : { ...EMPTY, url: pageUrl };

  return { critics, audience };
}
