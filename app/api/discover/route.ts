import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDiscoverQueue } from "@/lib/matchmaking";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const queue = await getDiscoverQueue(me.id);
  return NextResponse.json({ queue });
}
