"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PREDEFINED_INTERESTS } from "@/lib/interests";

type InitialData = {
  name: string;
  age: number;
  bio: string;
  gender: string;
  interestedIn: string;
  interests: string[];
};

export default function ProfileForm({ initial }: { initial: InitialData }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof InitialData>(key: K, value: InitialData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function toggleInterest(name: string) {
    update(
      "interests",
      form.interests.includes(name)
        ? form.interests.filter((i) => i !== name)
        : [...form.interests, name]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setSaved(true);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
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
            onChange={(e) => update("age", Number(e.target.value))}
            required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-rose-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-rose-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Interests</label>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_INTERESTS.map((name) => {
            const active = form.interests.includes(name);
            return (
              <button
                type="button"
                key={name}
                onClick={() => toggleInterest(name)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-rose-500 bg-rose-500 text-white"
                    : "border-zinc-300 text-zinc-600 hover:border-rose-300 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-rose-500 px-5 py-2 font-medium text-white transition-colors hover:bg-rose-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>
    </form>
  );
}
