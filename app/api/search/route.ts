import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";
import { withCache } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await withCache(
      `search:${query.toLowerCase()}`,
      () => searchMovies(query),
      60 * 30 // 30min — search results churn faster than a movie's own data
    );
    return NextResponse.json({ results });
  } catch (err) {
    console.error("[api/search] failed:", err);
    return NextResponse.json({ results: [], error: "Search temporarily unavailable" }, { status: 502 });
  }
}
