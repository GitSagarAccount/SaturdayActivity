"use client";

import { useState } from "react";
import ProfileCard, { CardUser } from "@/components/ProfileCard";

export default function SwipeDeck({ initialQueue }: { initialQueue: CardUser[] }) {
  const [queue, setQueue] = useState(initialQueue);
  const [pending, setPending] = useState(false);
  const [matchName, setMatchName] = useState<string | null>(null);
  const [reloading, setReloading] = useState(false);

  const current = queue[0];

  async function reload() {
    setReloading(true);
    try {
      const res = await fetch("/api/discover");
      const data = await res.json();
      setQueue(data.queue ?? []);
    } finally {
      setReloading(false);
    }
  }

  async function swipe(action: "LIKE" | "DISLIKE") {
    if (!current || pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: current.id, action }),
      });
      const data = await res.json();
      if (data.matched) {
        setMatchName(current.name);
      }
      setQueue((q) => q.slice(1));
    } finally {
      setPending(false);
    }
  }

  if (!current) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-lg font-medium">No more profiles for now</p>
        <p className="text-sm text-zinc-500">Check back later, or reload to search again.</p>
        <button
          onClick={reload}
          disabled={reloading}
          className="rounded-full bg-rose-500 px-5 py-2 font-medium text-white transition-colors hover:bg-rose-600 disabled:opacity-60"
        >
          {reloading ? "Searching…" : "Reload search"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-4 px-4 py-6">
      {matchName && (
        <div className="rounded-xl bg-rose-500 px-4 py-3 text-center text-white">
          🎉 It&apos;s a match with {matchName}!
          <button
            onClick={() => setMatchName(null)}
            className="ml-3 underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}
      <ProfileCard user={current} />
      <div className="flex justify-center gap-6">
        <button
          onClick={() => swipe("DISLIKE")}
          disabled={pending}
          aria-label="Dislike"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-zinc-300 text-2xl text-zinc-400 transition-transform hover:scale-105 disabled:opacity-50 dark:border-zinc-700"
        >
          ✕
        </button>
        <button
          onClick={() => swipe("LIKE")}
          disabled={pending}
          aria-label="Like"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-2xl text-white transition-transform hover:scale-105 disabled:opacity-50"
        >
          ♥
        </button>
      </div>
    </div>
  );
}
