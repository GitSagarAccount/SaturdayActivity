import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_PHOTOS = 6;

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const existingCount = await prisma.photo.count({ where: { userId: me.id } });
  if (existingCount >= MAX_PHOTOS) {
    return NextResponse.json({ error: `You can upload up to ${MAX_PHOTOS} photos.` }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Only JPEG, PNG, WEBP, or GIF images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File must be 5MB or smaller." }, { status: 400 });
  }

  const filename = `${me.id}-${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const maxOrder = await prisma.photo.aggregate({
    where: { userId: me.id },
    _max: { order: true },
  });

  const photo = await prisma.photo.create({
    data: {
      userId: me.id,
      url: `/uploads/${filename}`,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json({ ok: true, photo });
}
