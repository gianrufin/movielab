import { NextRequest, NextResponse } from "next/server";
import { getPersonDetail } from "@/lib/person";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const personId = parseInt(params.id, 10);
  if (Number.isNaN(personId) || personId <= 0) {
    return NextResponse.json({ error: "Invalid person ID" }, { status: 400 });
  }

  const person = await getPersonDetail(personId);
  if (!person) {
    return NextResponse.json({ error: "Person not found" }, { status: 404 });
  }

  return NextResponse.json(person);
}
