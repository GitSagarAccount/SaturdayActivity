import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";
import PhotoManager from "@/components/PhotoManager";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const full = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    include: {
      interests: { include: { interest: true } },
      photos: { orderBy: { order: "asc" } },
    },
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Your profile</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-zinc-500">Photos</h2>
        <PhotoManager initialPhotos={full.photos.map((p) => ({ id: p.id, url: p.url }))} />
      </section>

      <section>
        <ProfileForm
          initial={{
            name: full.name,
            age: full.age,
            bio: full.bio,
            gender: full.gender,
            interestedIn: full.interestedIn,
            interests: full.interests.map((i) => i.interest.name),
          }}
        />
      </section>
    </div>
  );
}
