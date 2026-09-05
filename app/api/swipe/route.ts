import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { toUserId, action } = await req.json();
  if (!toUserId || !["LIKE", "DISLIKE"].includes(action)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (toUserId === me.id) {
    return NextResponse.json({ error: "Cannot swipe on yourself." }, { status: 400 });
  }

  await prisma.swipe.upsert({
    where: { fromUserId_toUserId: { fromUserId: me.id, toUserId } },
    update: { action },
    create: { fromUserId: me.id, toUserId, action },
  });

  let matched = false;

  if (action === "LIKE") {
    const reciprocal = await prisma.swipe.findUnique({
      where: { fromUserId_toUserId: { fromUserId: toUserId, toUserId: me.id } },
    });

    if (reciprocal && reciprocal.action === "LIKE") {
      const [userAId, userBId] = [me.id, toUserId].sort();
      await prisma.match.upsert({
        where: { userAId_userBId: { userAId, userBId } },
        update: {},
        create: { userAId, userBId },
      });
      matched = true;
    }
  }

  return NextResponse.json({ ok: true, matched });
}
