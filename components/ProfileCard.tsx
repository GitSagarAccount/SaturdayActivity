import Image from "next/image";

export type CardUser = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: { url: string }[];
  interests: { interest: { name: string } }[];
  sharedCount?: number;
  matched?: boolean;
};

export default function ProfileCard({ user }: { user: CardUser }) {
  const photo = user.photos[0]?.url;

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm dark:border-rose-950 dark:bg-zinc-900">
      <div className="relative aspect-[4/5] w-full bg-rose-100 dark:bg-rose-950">
        {photo ? (
          <Image src={photo} alt={user.name} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-rose-300">
            No photo
          </div>
        )}
        {user.matched && (
          <span className="absolute left-2 top-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
            Matched
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {user.name}, {user.age}
          </h2>
          {typeof user.sharedCount === "number" && user.sharedCount > 0 && (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600 dark:bg-rose-950 dark:text-rose-300">
              {user.sharedCount} shared interest{user.sharedCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
        {user.bio && <p className="text-sm text-zinc-500">{user.bio}</p>}
        {user.interests.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {user.interests.map(({ interest }) => (
              <span
                key={interest.name}
                className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {interest.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
