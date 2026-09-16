import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";
import { withCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
  const hasLiveTmdb = Boolean(
    process.env.TMDB_ACCESS_TOKEN?.trim() ||
    process.env.TMDB_API_KEY?.trim() ||
    process.env.TMDB_TOKEN?.trim()
  );

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], hasLiveTmdb });
  }

  try {
    const results = await withCache(
      `search:${query.toLowerCase()}`,
      () => searchMovies(query),
      60 * 30 // 30min — search results churn faster than a movie's own data
    );
    return NextResponse.json({ results: results ?? [], hasLiveTmdb });
  } catch (err: any) {
    console.error("[api/search] failed:", err.message || err);
    return NextResponse.json({ results: [], hasLiveTmdb, error: "Search temporarily unavailable" }, { status: 200 });
  }
}
