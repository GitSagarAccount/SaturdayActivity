import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getWhoLikedMe } from "@/lib/matchmaking";
import LikesGrid from "@/components/LikesGrid";

export default async function LikesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const likes = await getWhoLikedMe(user.id);

  return <LikesGrid initialLikes={likes} />;
}
