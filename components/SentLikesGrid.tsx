import ProfileCard, { CardUser } from "@/components/ProfileCard";

export default function SentLikesGrid({ likes }: { likes: CardUser[] }) {
  if (likes.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        You haven&apos;t liked anyone yet — head to Discover to start swiping.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {likes.map((user) => (
        <ProfileCard key={user.id} user={user} />
      ))}
    </div>
  );
}
