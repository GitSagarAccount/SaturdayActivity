"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard, { CardUser } from "@/components/ProfileCard";

export default function LikesGrid({ initialLikes }: { initialLikes: CardUser[] }) {
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [matchName, setMatchName] = useState<string | null>(null);

  async function respond(user: CardUser, action: "LIKE" | "DISLIKE") {
    setPendingId(user.id);
    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: user.id, action }),
      });
      const data = await res.json();
      if (data.matched) {
        setMatchName(user.name);
        router.refresh();
      }
      setLikes((l) => l.filter((u) => u.id !== user.id));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section>
      {matchName && (
        <div className="mb-4 rounded-xl bg-rose-500 px-4 py-3 text-center text-white">
          🎉 It&apos;s a match with {matchName}! Check your Matches tab.
          <button
            onClick={() => setMatchName(null)}
            className="ml-3 underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}
      <h1 className="mb-4 text-2xl font-semibold">People who liked you</h1>
      {likes.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Keep swiping — you&apos;ll show up here once someone likes you.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {likes.map((user) => (
            <div key={user.id} className="flex flex-col gap-2">
              <ProfileCard user={user} />
              <div className="flex gap-2">
                <button
                  onClick={() => respond(user, "DISLIKE")}
                  disabled={pendingId === user.id}
                  className="flex-1 rounded-full border border-zinc-300 py-1.5 text-sm font-medium text-zinc-500 disabled:opacity-50 dark:border-zinc-700"
                >
                  Pass
                </button>
                <button
                  onClick={() => respond(user, "LIKE")}
                  disabled={pendingId === user.id}
                  className="flex-1 rounded-full bg-rose-500 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                >
                  Like back
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
