import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";
import { withCache } from "@/lib/cache";
import { SearchResultPayload } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim() || "";
  const year = req.nextUrl.searchParams.get("year")?.trim() || undefined;
  const director = req.nextUrl.searchParams.get("director")?.trim() || undefined;
  const cast = req.nextUrl.searchParams.get("cast")?.trim() || undefined;

  const hasLiveTmdb = Boolean(
    process.env.TMDB_ACCESS_TOKEN?.trim() ||
    process.env.TMDB_API_KEY?.trim() ||
    process.env.TMDB_TOKEN?.trim()
  );

  if (!query || query.length < 2) {
    return NextResponse.json({
      results: [],
      refinements: { years: [], directors: [], cast: [], hasMultipleSameTitle: false },
      hasLiveTmdb,
    });
  }

  try {
    const cacheKey = `search:${query.toLowerCase()}:${year || ""}:${director || ""}:${cast || ""}`;
    const payload = await withCache<SearchResultPayload>(
      cacheKey,
      () => searchMovies(query, { year, director, cast }),
      60 * 30 // 30min
    );

    return NextResponse.json({
      results: payload?.results ?? [],
      refinements: payload?.refinements ?? {
        years: [],
        directors: [],
        cast: [],
        hasMultipleSameTitle: false,
      },
      detectedFilters: payload?.detectedFilters,
      hasLiveTmdb,
    });
  } catch (err: any) {
    console.error("[api/search] failed:", err.message || err);
    return NextResponse.json(
      {
        results: [],
        refinements: { years: [], directors: [], cast: [], hasMultipleSameTitle: false },
        hasLiveTmdb,
        error: "Search temporarily unavailable",
      },
      { status: 200 }
    );
  }
}
