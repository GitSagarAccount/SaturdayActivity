import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PREDEFINED_INTERESTS } from "@/lib/interests";

export async function PATCH(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { name, age, bio, gender, interestedIn, interests } = await req.json();

  const data: Record<string, unknown> = {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
    }
    data.name = name.trim();
  }
  if (age !== undefined) {
    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge < 18 || parsedAge > 120) {
      return NextResponse.json({ error: "Age must be a number between 18 and 120." }, { status: 400 });
    }
    data.age = parsedAge;
  }
  if (bio !== undefined) {
    if (typeof bio !== "string" || bio.length > 500) {
      return NextResponse.json({ error: "Bio must be 500 characters or fewer." }, { status: 400 });
    }
    data.bio = bio;
  }
  if (gender !== undefined) {
    if (!["MALE", "FEMALE", "OTHER"].includes(gender)) {
      return NextResponse.json({ error: "Invalid gender." }, { status: 400 });
    }
    data.gender = gender;
  }
  if (interestedIn !== undefined) {
    if (!["MALE", "FEMALE", "EVERYONE"].includes(interestedIn)) {
      return NextResponse.json({ error: "Invalid preference." }, { status: 400 });
    }
    data.interestedIn = interestedIn;
  }

  if (interests !== undefined) {
    if (!Array.isArray(interests) || !interests.every((i) => PREDEFINED_INTERESTS.includes(i))) {
      return NextResponse.json({ error: "Invalid interests." }, { status: 400 });
    }
  }

  await prisma.$transaction(async (tx) => {
    if (Object.keys(data).length > 0) {
      await tx.user.update({ where: { id: me.id }, data });
    }
    if (interests !== undefined) {
      const interestRows = await Promise.all(
        interests.map((name: string) =>
          tx.interest.upsert({ where: { name }, update: {}, create: { name } })
        )
      );
      await tx.userInterest.deleteMany({ where: { userId: me.id } });
      if (interestRows.length > 0) {
        await tx.userInterest.createMany({
          data: interestRows.map((i) => ({ userId: me.id, interestId: i.id })),
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}
