import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getWhoLikedMe, getLikesSent } from "@/lib/matchmaking";
import LikesGrid from "@/components/LikesGrid";
import SentLikesGrid from "@/components/SentLikesGrid";

export default async function LikesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [received, sent] = await Promise.all([
    getWhoLikedMe(user.id),
    getLikesSent(user.id),
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <LikesGrid initialLikes={received} />

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold">People you&apos;ve liked</h2>
        <SentLikesGrid likes={sent} />
      </section>
    </div>
  );
}
