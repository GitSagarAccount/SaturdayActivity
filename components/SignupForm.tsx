"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    age: "",
    gender: "MALE",
    interestedIn: "EVERYONE",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push("/profile");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Username</label>
        <input
          value={form.username}
          onChange={(e) => update("username", e.target.value)}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-rose-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          required
          minLength={6}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-rose-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Display name</label>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-rose-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Age</label>
        <input
          type="number"
          min={18}
          max={120}
          value={form.age}
          onChange={(e) => update("age", e.target.value)}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-rose-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">I am</label>
        <select
          value={form.gender}
          onChange={(e) => update("gender", e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-rose-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Interested in</label>
        <select
          value={form.interestedIn}
          onChange={(e) => update("interestedIn", e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-rose-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="MALE">Men</option>
          <option value="FEMALE">Women</option>
          <option value="EVERYONE">Everyone</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-rose-500 px-4 py-2 font-medium text-white transition-colors hover:bg-rose-600 disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-rose-500">
          Log in
        </Link>
      </p>
    </form>
  );
}
