import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password, name, age, gender, interestedIn } = body;

  if (!username || !password || !name || !age || !gender || !interestedIn) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }
  const parsedAge = Number(age);
  if (!Number.isInteger(parsedAge) || parsedAge < 18 || parsedAge > 120) {
    return NextResponse.json({ error: "Age must be a number between 18 and 120." }, { status: 400 });
  }
  if (!["MALE", "FEMALE", "OTHER"].includes(gender)) {
    return NextResponse.json({ error: "Invalid gender." }, { status: 400 });
  }
  if (!["MALE", "FEMALE", "EVERYONE"].includes(interestedIn)) {
    return NextResponse.json({ error: "Invalid preference." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      name,
      age: parsedAge,
      gender,
      interestedIn,
    },
  });

  await createSession(user.id);

  return NextResponse.json({ ok: true });
}
