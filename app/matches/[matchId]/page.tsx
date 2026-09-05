import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMatchForUsers } from "@/lib/matchmaking";
import ChatThread from "@/components/ChatThread";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { matchId } = await params;
  const found = await getMatchForUsers(matchId, user.id);
  if (!found) notFound();

  const { otherUser } = found;
  const messages = await prisma.message.findMany({
    where: { matchId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-rose-100 px-4 py-3 dark:border-rose-950">
        <Link href="/matches" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          ←
        </Link>
        <div className="relative h-9 w-9 overflow-hidden rounded-full bg-rose-100 dark:bg-rose-950">
          {otherUser.photos[0] && (
            <Image src={otherUser.photos[0].url} alt={otherUser.name} fill className="object-cover" unoptimized />
          )}
        </div>
        <span className="font-medium">{otherUser.name}</span>
      </div>
      <ChatThread
        matchId={matchId}
        meId={user.id}
        otherName={otherUser.name}
        initialMessages={messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))}
      />
    </div>
  );
}
