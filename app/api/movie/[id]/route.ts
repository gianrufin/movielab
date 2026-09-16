import { NextRequest, NextResponse } from "next/server";
import { getMovieDetail } from "@/lib/movie";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const tmdbId = parseInt(params.id, 10);
  if (Number.isNaN(tmdbId)) {
    return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
  }

  try {
    const payload = await getMovieDetail(tmdbId);
    if (!payload) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("[api/movie] failed:", err.message || err);
    return NextResponse.json({ error: "Could not load this title" }, { status: 502 });
  }
}
