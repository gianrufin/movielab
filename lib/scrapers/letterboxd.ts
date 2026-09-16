import * as cheerio from "cheerio";
import { RatingSource, ReviewSnippet } from "../types";

const EMPTY: RatingSource = {
  available: false,
  score: null,
  displayScore: "—",
  voteCount: null,
  url: "",
};

// Letterboxd has no public API, so this reads the public film page's
// server-rendered meta tags (stable across redesigns, unlike CSS class
// names) rather than scraping visible DOM structure. Slugs are usually
// just the kebab-cased title, but title collisions exist — this is a
// best-effort match, not a guaranteed one.
function toSlug(title: string, year: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `${base}-${year}`;
}

export async function getLetterboxdRating(
  title: string,
  year: string
): Promise<{ rating: RatingSource; reviews: ReviewSnippet[] }> {
  const slug = toSlug(title, year);
  const url = `https://letterboxd.com/film/${slug}/`;

  try {
    const res = await fetch(url, {
      headers: {
        // A descriptive UA that identifies the app, rather than
        // impersonating a browser — play nice with robots.txt.
        "User-Agent": "MovieLabBot/1.0 (+https://movielab.app/about-bot)",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      // Slug guess likely wrong, or Letterboxd is rate-limiting us —
      // either way, fail soft rather than throw.
      return { rating: EMPTY, reviews: [] };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Letterboxd embeds the average rating in a twitter:data2 meta tag
    // on the film page, e.g. content="3.8 out of 5".
    const ratingMeta = $('meta[name="twitter:data2"]').attr("content");
    const match = ratingMeta?.match(/([\d.]+)\s*out of 5/);
    const score = match ? parseFloat(match[1]) : null;

    const reviewCountText = $('meta[name="twitter:label2"]').attr("content") ?? "";

    const rating: RatingSource = score
      ? {
          available: true,
          score: (score / 5) * 100,
          displayScore: `${score.toFixed(1)}★`,
          voteCount: reviewCountText || null,
          url,
        }
      : EMPTY;

    // Top review blurbs live in .review .body-text on the film page —
    // this is best-effort text scraping, so keep it short and defensive.
    const reviews: ReviewSnippet[] = $(".review .body-text p")
      .slice(0, 5)
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 20)
      .map((text) => ({ source: "letterboxd" as const, text }));

    return { rating, reviews };
  } catch (err) {
    console.error("[letterboxd] fetch failed:", err);
    return { rating: EMPTY, reviews: [] };
  }
}
