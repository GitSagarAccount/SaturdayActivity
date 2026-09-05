"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/likes", label: "Likes" },
  { href: "/matches", label: "Matches" },
  { href: "/profile", label: "Profile" },
];

export default function Nav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-rose-100 bg-white/80 px-4 py-3 backdrop-blur dark:border-rose-950 dark:bg-black/60 sm:px-8">
      <div className="flex items-center gap-6">
        <span className="text-lg font-bold text-rose-500">Spark</span>
        <div className="hidden gap-1 sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-rose-500 text-white"
                  : "text-zinc-600 hover:bg-rose-50 dark:text-zinc-300 dark:hover:bg-rose-950"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-zinc-500 sm:inline">Hi, {userName}</span>
        <button
          onClick={handleLogout}
          className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Log out
        </button>
      </div>
      <div className="flex gap-1 border-t border-rose-100 pt-2 sm:hidden fixed bottom-0 left-0 right-0 bg-white px-4 pb-2 dark:bg-black dark:border-rose-950">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 rounded-full px-2 py-1.5 text-center text-xs font-medium ${
              pathname === link.href
                ? "bg-rose-500 text-white"
                : "text-zinc-600 dark:text-zinc-300"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
