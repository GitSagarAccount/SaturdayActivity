import { prisma } from "@/lib/prisma";
import type { Gender, Preference } from "@prisma/client";

function genderMatchesPreference(gender: Gender, preference: Preference) {
  return preference === "EVERYONE" || preference === gender;
}

export async function getDiscoverQueue(userId: string) {
  const me = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { interests: true },
  });
  const myInterestIds = new Set(me.interests.map((i) => i.interestId));

  const swiped = await prisma.swipe.findMany({
    where: { fromUserId: userId },
    select: { toUserId: true },
  });
  const excludedIds = new Set([userId, ...swiped.map((s) => s.toUserId)]);

  const candidates = await prisma.user.findMany({
    where: { id: { notIn: [...excludedIds] } },
    include: {
      interests: { include: { interest: true } },
      photos: { orderBy: { order: "asc" } },
    },
  });

  const filtered = candidates.filter(
    (c) =>
      genderMatchesPreference(c.gender, me.interestedIn) &&
      genderMatchesPreference(me.gender, c.interestedIn)
  );

  const ranked = filtered
    .map((c) => {
      const sharedCount = c.interests.filter((i) => myInterestIds.has(i.interestId)).length;
      return { ...c, sharedCount };
    })
    .sort((a, b) => b.sharedCount - a.sharedCount || b.createdAt.getTime() - a.createdAt.getTime());

  return ranked;
}

export async function getWhoLikedMe(userId: string) {
  const likes = await prisma.swipe.findMany({
    where: { toUserId: userId, action: "LIKE" },
    include: {
      fromUser: {
        include: {
          interests: { include: { interest: true } },
          photos: { orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const matches = await prisma.match.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
  });
  const matchedIds = new Set(
    matches.map((m) => (m.userAId === userId ? m.userBId : m.userAId))
  );

  return likes
    .filter((l) => !matchedIds.has(l.fromUserId))
    .map((l) => l.fromUser);
}

export async function getLikesSent(userId: string) {
  const matches = await prisma.match.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
  });
  const matchedIds = new Set(
    matches.map((m) => (m.userAId === userId ? m.userBId : m.userAId))
  );

  const likes = await prisma.swipe.findMany({
    where: { fromUserId: userId, action: "LIKE" },
    include: {
      toUser: {
        include: {
          interests: { include: { interest: true } },
          photos: { orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return likes.map((l) => ({ ...l.toUser, matched: matchedIds.has(l.toUserId) }));
}

export async function getMatches(userId: string) {
  const matches = await prisma.match.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
    include: {
      userA: {
        include: {
          interests: { include: { interest: true } },
          photos: { orderBy: { order: "asc" } },
        },
      },
      userB: {
        include: {
          interests: { include: { interest: true } },
          photos: { orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return matches.map((m) => ({
    matchId: m.id,
    user: m.userAId === userId ? m.userB : m.userA,
  }));
}

export async function getMatchForUsers(matchId: string, userId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      userA: { include: { photos: { orderBy: { order: "asc" } } } },
      userB: { include: { photos: { orderBy: { order: "asc" } } } },
    },
  });

  if (!match || (match.userAId !== userId && match.userBId !== userId)) {
    return null;
  }

  const otherUser = match.userAId === userId ? match.userB : match.userA;
  return { match, otherUser };
}
