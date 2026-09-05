import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDiscoverQueue } from "@/lib/matchmaking";
import SwipeDeck from "@/components/SwipeDeck";

export default async function DiscoverPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const queue = await getDiscoverQueue(user.id);

  return <SwipeDeck initialQueue={queue} />;
}
