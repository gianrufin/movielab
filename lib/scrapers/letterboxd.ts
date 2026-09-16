import * as cheerio from "cheerio";
import { RatingSource, ReviewSnippet } from "../types";

const EMPTY: RatingSource = {
  available: false,
  score: null,
  displayScore: "—",
  voteCount: null,
  url: "",
};

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

function sanitizeSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics (e.g. café -> cafe)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Letterboxd provides an official IMDb ID resolution endpoint:
 * https://letterboxd.com/imdb/<imdbId>/ which returns a 302 redirect
 * to the canonical film page (e.g. /film/heneral-luna/).
 *
 * If no IMDb ID is known, we try clean title slugs with and without year.
 */
export async function getLetterboxdRating(
  title: string,
  year: string,
  imdbId?: string | null
): Promise<{ rating: RatingSource; reviews: ReviewSnippet[] }> {
  try {
    let res: Response | null = null;
    let finalUrl = "";

    // 1. Try resolving via Letterboxd's IMDb ID redirect
    if (imdbId && /^tt\d+$/.test(imdbId)) {
      try {
        const imdbUrl = `https://letterboxd.com/imdb/${imdbId}/`;
        const testRes = await fetch(imdbUrl, {
          headers: BROWSER_HEADERS,
          redirect: "follow",
          next: { revalidate: 3600 },
        });
        if (testRes.ok && testRes.url && !testRes.url.includes("/imdb/")) {
          res = testRes;
          finalUrl = testRes.url;
        }
      } catch (err: any) {
        console.warn("[letterboxd] IMDb redirect lookup skipped:", err?.message || err);
      }
    }

    // 2. If IMDb lookup wasn't available or didn't resolve, try candidate slugs
    if (!res || !res.ok) {
      const baseSlug = sanitizeSlug(title);
      const candidates: string[] = [
        baseSlug, // e.g. "heneral-luna"
        `${baseSlug}-${year}`, // e.g. "heneral-luna-2015"
      ];

      // If title has a colon or subtitle (e.g. "Mission: Impossible - Fallout"), add simplified slug
      if (title.includes(":") || title.includes(" - ")) {
        const mainPart = title.split(/[:\-]/)[0];
        const simplifiedSlug = sanitizeSlug(mainPart);
        if (simplifiedSlug && !candidates.includes(simplifiedSlug)) {
          candidates.push(simplifiedSlug);
          candidates.push(`${simplifiedSlug}-${year}`);
        }
      }

      for (const slug of candidates) {
        if (!slug) continue;
        try {
          const directUrl = `https://letterboxd.com/film/${slug}/`;
          const directRes = await fetch(directUrl, {
            headers: BROWSER_HEADERS,
            redirect: "follow",
            next: { revalidate: 3600 },
          });

          if (directRes.ok) {
            res = directRes;
            finalUrl = directRes.url || directUrl;
            break;
          }
        } catch (err: any) {
          // Continue to next slug candidate
        }
      }
    }

    if (!res || !res.ok) {
      return { rating: EMPTY, reviews: [] };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    let score: number | null = null;
    let voteCount: string | null = null;

    // A. Parse schema.org JSON-LD (contains official aggregate rating and counts)
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const raw = $(el).html() ?? "";
        const clean = raw.replace(/\/\*\s*<!\[CDATA\[\s*\*\/|\/\*\s*\]\]>\s*\*\//g, "").trim();
        const data = JSON.parse(clean);
        if (data.aggregateRating?.ratingValue != null) {
          score = parseFloat(data.aggregateRating.ratingValue);
          const count = data.aggregateRating.ratingCount || data.aggregateRating.reviewCount;
          if (count && typeof count === "number") {
            if (count >= 1_000_000) {
              voteCount = `${(count / 1_000_000).toFixed(1)}M ratings`;
            } else if (count >= 1_000) {
              voteCount = `${(count / 1_000).toFixed(1)}K ratings`;
            } else {
              voteCount = `${count} ratings`;
            }
          }
        }
      } catch {
        // Continue to fallback extraction
      }
    });

    // B. Fallback to Twitter card meta tag (e.g. content="3.72 out of 5")
    if (score == null) {
      const ratingMeta = $('meta[name="twitter:data2"]').attr("content");
      const match = ratingMeta?.match(/([\d.]+)\s*out of 5/);
      if (match) {
        score = parseFloat(match[1]);
        const labelMeta = $('meta[name="twitter:label2"]').attr("content");
        if (labelMeta) voteCount = labelMeta;
      }
    }

    // Canonical film page URL
    const canonical = $('link[rel="canonical"]').attr("href") || finalUrl || `https://letterboxd.com/film/${sanitizeSlug(title)}/`;

    const rating: RatingSource =
      score != null
        ? {
            available: true,
            score: Math.round((score / 5) * 100),
            displayScore: `${score.toFixed(1)}★`,
            voteCount,
            url: canonical,
          }
        : EMPTY;

    // C. Extract authentic user review blurbs from the film page
    const ignoredPatterns = [
      /Letterboxd is an independent service/i,
      /^Synopsis/i,
      /This review may contain spoilers/i,
      /Sign in to log/i,
      /Forgotten username/i,
      /moderator has locked/i,
      /report this review/i,
    ];

    const reviews: ReviewSnippet[] = [];
    $(
      ".js-review-body, section.film-recent-reviews .body-text, section.film-reviews .body-text"
    ).each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, " ");
      if (
        text.length >= 30 &&
        text.length <= 600 &&
        !ignoredPatterns.some((pattern) => pattern.test(text)) &&
        !reviews.some((r) => r.text === text)
      ) {
        reviews.push({ source: "letterboxd" as const, text });
      }
    });

    return {
      rating,
      reviews: reviews.slice(0, 10),
    };
  } catch (err: any) {
    console.warn("[letterboxd] scrape warning:", err?.message || err);
    return { rating: EMPTY, reviews: [] };
  }
}

