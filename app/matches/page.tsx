import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMatches } from "@/lib/matchmaking";
import ProfileCard from "@/components/ProfileCard";

export default async function MatchesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const matches = await getMatches(user.id);

  if (matches.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-lg font-medium">No matches yet</p>
        <p className="text-sm text-zinc-500">
          Matches happen when you and someone else both like each other.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Your matches</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {matches.map((m) => (
          <ProfileCard
            key={m.id}
            user={{ ...m, interests: [], photos: m.photos }}
          />
        ))}
      </div>
    </div>
  );
}
