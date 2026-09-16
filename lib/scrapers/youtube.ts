import { withCache } from "../cache";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

interface YouTubeVideoCandidate {
  id: string;
  title: string;
  channel: string;
}

/**
 * Searches and scrapes YouTube for the official movie trailer.
 * Used when TMDB or external databases do not have video links available
 * (common for local, independent, foreign, or classic films like Heneral Luna).
 */
export async function findYouTubeTrailer(
  title: string,
  year?: string
): Promise<string | null> {
  const cacheKey = `yt_trailer_${title.toLowerCase().replace(/[^a-z0-9]/g, "")}_${year ?? ""}`;

  return withCache(
    cacheKey,
    async () => {
      const queries = [
        `${title} ${year ?? ""} official trailer`.trim(),
        `${title} trailer`.trim(),
      ];

      for (const query of queries) {
        try {
          const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
          const res = await fetch(url, {
            headers: BROWSER_HEADERS,
            next: { revalidate: 86400 }, // 24h
          });

          if (!res.ok) continue;

          const html = await res.text();
          const candidates = extractVideoCandidates(html);

          if (candidates.length === 0) {
            // Fallback: simple regex matching on video IDs
            const matchedIds = [
              ...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g),
            ].map((m) => m[1]);
            const unique = [...new Set(matchedIds)];
            if (unique.length > 0) {
              return unique[0];
            }
            continue;
          }

          // 1. Prefer videos with "official trailer" or "trailer" in the title
          const titleLower = title.toLowerCase();
          const trailerMatch = candidates.find((c) => {
            const vTitle = c.title.toLowerCase();
            const hasMovieTitle =
              vTitle.includes(titleLower) ||
              titleLower.split(/[:\s-]+/)[0].length > 3 &&
                vTitle.includes(titleLower.split(/[:\s-]+/)[0]);
            const isTrailer =
              vTitle.includes("trailer") ||
              vTitle.includes("teaser") ||
              vTitle.includes("preview");
            const notReaction =
              !vTitle.includes("reaction") &&
              !vTitle.includes("review") &&
              !vTitle.includes("ending explained");
            return hasMovieTitle && isTrailer && notReaction;
          });

          if (trailerMatch) {
            return trailerMatch.id;
          }

          // 2. Secondary preference: any video with "trailer" or "teaser"
          const anyTrailer = candidates.find((c) => {
            const vTitle = c.title.toLowerCase();
            return (
              (vTitle.includes("trailer") || vTitle.includes("teaser")) &&
              !vTitle.includes("reaction") &&
              !vTitle.includes("review")
            );
          });

          if (anyTrailer) {
            return anyTrailer.id;
          }

          // 3. Fallback to first video candidate
          if (candidates[0]?.id) {
            return candidates[0].id;
          }
        } catch (err: any) {
          console.warn(`[youtube] Trailer scrape failed for "${query}":`, err?.message || err);
        }
      }

      return null;
    },
    60 * 60 * 24 // 24 hours
  );
}

function extractVideoCandidates(html: string): YouTubeVideoCandidate[] {
  const candidates: YouTubeVideoCandidate[] = [];

  try {
    const jsonMatch =
      html.match(/var ytInitialData = ({[\s\S]*?});<\/script>/) ||
      html.match(/ytInitialData\s*=\s*({[\s\S]*?});/);

    if (!jsonMatch) return candidates;

    const data = JSON.parse(jsonMatch[1]);
    const contents =
      data.contents?.twoColumnSearchResultsRenderer?.primaryContents
        ?.sectionListRenderer?.contents;

    if (!Array.isArray(contents)) return candidates;

    for (const section of contents) {
      const items = section.itemSectionRenderer?.contents;
      if (!Array.isArray(items)) continue;

      for (const item of items) {
        const v = item.videoRenderer;
        if (v && typeof v.videoId === "string" && v.videoId.length === 11) {
          const videoTitle =
            v.title?.runs?.map((r: any) => r.text).join("") || "";
          const channel =
            v.ownerText?.runs?.map((r: any) => r.text).join("") || "";
          candidates.push({
            id: v.videoId,
            title: videoTitle,
            channel,
          });
        }
      }
    }
  } catch (err) {
    // Malformed JSON or structure changed
  }

  return candidates;
}
