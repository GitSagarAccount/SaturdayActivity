import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getMatchForUsers } from "@/lib/matchmaking";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { matchId } = await params;
  const found = await getMatchForUsers(matchId, me.id);
  if (!found) {
    return NextResponse.json({ error: "Match not found." }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: { matchId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { matchId } = await params;
  const found = await getMatchForUsers(matchId, me.id);
  if (!found) {
    return NextResponse.json({ error: "Match not found." }, { status: 404 });
  }

  const { body } = await req.json();
  if (typeof body !== "string" || !body.trim() || body.length > 2000) {
    return NextResponse.json({ error: "Message must be 1-2000 characters." }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: { matchId, senderId: me.id, body: body.trim() },
  });

  return NextResponse.json({ message });
}
