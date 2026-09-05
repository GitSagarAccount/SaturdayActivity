import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/discover");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-rose-50 px-4 dark:bg-black">
      <h1 className="text-3xl font-bold text-rose-500">Spark</h1>
      <p className="text-zinc-500">Welcome back. Log in to keep swiping.</p>
      <LoginForm />
    </div>
  );
}
