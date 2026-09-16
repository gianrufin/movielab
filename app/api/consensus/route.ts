import { NextRequest, NextResponse } from "next/server";
import { generateConsensus } from "@/lib/consensus";
import { ReviewSnippet } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, reviews } = body as { title: string; reviews: ReviewSnippet[] };

    if (!title || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json({ error: "title and a non-empty reviews array are required" }, { status: 400 });
    }

    const consensus = await generateConsensus(title, reviews);
    return NextResponse.json(consensus);
  } catch (err) {
    console.error("[api/consensus] failed:", err);
    return NextResponse.json({ error: "Could not generate a summary right now" }, { status: 502 });
  }
}
