import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SignupForm from "@/components/SignupForm";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/discover");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-rose-50 px-4 py-10 dark:bg-black">
      <h1 className="text-3xl font-bold text-rose-500">Spark</h1>
      <p className="text-zinc-500">Create your profile to start matching.</p>
      <SignupForm />
    </div>
  );
}
