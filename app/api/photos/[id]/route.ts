import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo || photo.userId !== me.id) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  await prisma.photo.delete({ where: { id } });

  const filePath = path.join(process.cwd(), "public", photo.url);
  await unlink(filePath).catch(() => {});

  return NextResponse.json({ ok: true });
}
