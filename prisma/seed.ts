import { PrismaClient, Gender, Preference } from "@prisma/client";
import bcrypt from "bcryptjs";
import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from "fs";
import path from "path";
import { PREDEFINED_INTERESTS } from "../lib/interests";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "password123";

const NAMES: { name: string; gender: Gender }[] = [
  { name: "Aisha", gender: Gender.FEMALE },
  { name: "Priya", gender: Gender.FEMALE },
  { name: "Neha", gender: Gender.FEMALE },
  { name: "Kavya", gender: Gender.FEMALE },
  { name: "Meera", gender: Gender.FEMALE },
  { name: "Sara", gender: Gender.FEMALE },
  { name: "Riya", gender: Gender.FEMALE },
  { name: "Ananya", gender: Gender.FEMALE },
  { name: "Rohan", gender: Gender.MALE },
  { name: "Arjun", gender: Gender.MALE },
  { name: "Kabir", gender: Gender.MALE },
  { name: "Vikram", gender: Gender.MALE },
  { name: "Dev", gender: Gender.MALE },
  { name: "Aditya", gender: Gender.MALE },
  { name: "Karan", gender: Gender.MALE },
  { name: "Ishaan", gender: Gender.MALE },
  { name: "Alex", gender: Gender.OTHER },
  { name: "Sam", gender: Gender.OTHER },
];

const BIOS = [
  "Coffee first, conversation second.",
  "Looking for someone to explore the city with.",
  "Dog parent. Weekend hiker. Terrible cook.",
  "Here for good chats and better food.",
  "Trying to visit every bookstore in town.",
  "Gym in the morning, movies at night.",
  "Will trade playlist recommendations for yours.",
  "Still figuring out my bio. Ask me anything.",
  "Professional napper, amateur chef.",
  "Looking for my partner in crime.",
];

const SAMPLE_CONVERSATION = [
  { from: "them", body: "Hey! I saw we matched 🎉 how's your week going?" },
  { from: "me", body: "Pretty good! Just got back from the gym. You?" },
  { from: "them", body: "Nice! I'm just relaxing with some coffee. What kind of stuff are you into?" },
  { from: "me", body: "Mostly music and traveling, trying to plan a trip soon actually" },
  { from: "them", body: "No way, that's my favorite combo. Where are you thinking of going?" },
  { from: "me", body: "Not sure yet, open to ideas. Any recommendations?" },
  { from: "them", body: "You should ask me out for coffee and we can talk about it properly 😄" },
];

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function downloadPhoto(uploadsDir: string, userId: string, index: number, gender: Gender, portraitIndex: number) {
  const genderPath = gender === Gender.FEMALE ? "women" : "men";
  const sourceUrl = `https://randomuser.me/api/portraits/${genderPath}/${portraitIndex}.jpg`;

  try {
    const res = await fetch(sourceUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = `${userId}-${index}.jpg`;
    writeFileSync(path.join(uploadsDir, filename), buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.warn(`  ! Failed to fetch photo for user (falling back to none): ${err}`);
    return null;
  }
}

async function main() {
  const rand = mulberry32(42);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const pickMany = <T,>(arr: T[], count: number) => {
    const shuffled = [...arr].sort(() => rand() - 0.5);
    return shuffled.slice(0, count);
  };

  console.log("Clearing existing data...");
  await prisma.session.deleteMany();
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.userInterest.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.user.deleteMany();

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  mkdirSync(uploadsDir, { recursive: true });
  for (const file of readdirSync(uploadsDir)) {
    if (file !== ".gitkeep") unlinkSync(path.join(uploadsDir, file));
  }

  const interests = await Promise.all(
    PREDEFINED_INTERESTS.map((name) => prisma.interest.create({ data: { name } }))
  );

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // Track which randomuser.me portrait indices we've used per gender so photos don't repeat.
  const usedPortraits: Record<string, number> = { men: 0, women: 0 };
  function nextPortraitIndex(gender: Gender) {
    const key = gender === Gender.FEMALE ? "women" : "men";
    const index = usedPortraits[key];
    usedPortraits[key] += 1;
    return index % 100;
  }

  console.log("Creating demo users with real stock photos (this takes a bit)...");
  const users = [];
  for (let i = 0; i < NAMES.length; i++) {
    const { name, gender } = NAMES[i];
    const age = 20 + Math.floor(rand() * 20);
    const interestedIn = pick([Preference.MALE, Preference.FEMALE, Preference.EVERYONE, Preference.EVERYONE]);
    const bio = pick(BIOS);

    const user = await prisma.user.create({
      data: {
        username: `demo${i + 1}`,
        passwordHash,
        name,
        age,
        gender,
        interestedIn,
        bio,
      },
    });

    const photoCount = 2 + Math.floor(rand() * 3); // 2-4 photos
    for (let p = 0; p < photoCount; p++) {
      const portraitIndex = nextPortraitIndex(gender);
      const url = await downloadPhoto(uploadsDir, user.id, p, gender, portraitIndex);
      if (url) {
        await prisma.photo.create({ data: { userId: user.id, url, order: p } });
      }
    }

    const chosenInterests = pickMany(interests, 3 + Math.floor(rand() * 4));
    await prisma.userInterest.createMany({
      data: chosenInterests.map((interest) => ({ userId: user.id, interestId: interest.id })),
    });

    users.push(user);
  }

  console.log("Creating your profile (sagar)...");
  const sagarPasswordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const sagar = await prisma.user.create({
    data: {
      username: "sagar",
      passwordHash: sagarPasswordHash,
      name: "Sagar",
      age: 28,
      gender: Gender.MALE,
      interestedIn: Preference.EVERYONE,
      bio: "Building things, exploring cities, always up for good food.",
    },
  });
  for (let p = 0; p < 3; p++) {
    const portraitIndex = nextPortraitIndex(Gender.MALE);
    const url = await downloadPhoto(uploadsDir, sagar.id, p, Gender.MALE, portraitIndex);
    if (url) {
      await prisma.photo.create({ data: { userId: sagar.id, url, order: p } });
    }
  }
  const sagarInterests = pickMany(interests, 5);
  await prisma.userInterest.createMany({
    data: sagarInterests.map((interest) => ({ userId: sagar.id, interestId: interest.id })),
  });
  users.push(sagar);

  console.log("Seeding swipes between demo users...");
  for (const fromUser of users) {
    const others = users.filter((u) => u.id !== fromUser.id);
    const swipeTargets = pickMany(others, 4 + Math.floor(rand() * 5));
    for (const toUser of swipeTargets) {
      const action = rand() < 0.6 ? "LIKE" : "DISLIKE";
      await prisma.swipe
        .create({ data: { fromUserId: fromUser.id, toUserId: toUser.id, action } })
        .catch(() => {});
    }
  }

  // Guarantee sagar has a couple of matches to chat with, regardless of random swipes above.
  const sagarMatchPartners = pickMany(
    users.filter((u) => u.id !== sagar.id),
    2
  );
  for (const partner of sagarMatchPartners) {
    await prisma.swipe.upsert({
      where: { fromUserId_toUserId: { fromUserId: sagar.id, toUserId: partner.id } },
      update: { action: "LIKE" },
      create: { fromUserId: sagar.id, toUserId: partner.id, action: "LIKE" },
    });
    await prisma.swipe.upsert({
      where: { fromUserId_toUserId: { fromUserId: partner.id, toUserId: sagar.id } },
      update: { action: "LIKE" },
      create: { fromUserId: partner.id, toUserId: sagar.id, action: "LIKE" },
    });
  }

  console.log("Creating matches for mutual likes...");
  const likeSwipes = await prisma.swipe.findMany({ where: { action: "LIKE" } });
  const likeSet = new Set(likeSwipes.map((s) => `${s.fromUserId}:${s.toUserId}`));
  const seenPairs = new Set<string>();
  const createdMatches = [];
  for (const swipe of likeSwipes) {
    if (likeSet.has(`${swipe.toUserId}:${swipe.fromUserId}`)) {
      const [userAId, userBId] = [swipe.fromUserId, swipe.toUserId].sort();
      const pairKey = `${userAId}:${userBId}`;
      if (seenPairs.has(pairKey)) continue;
      seenPairs.add(pairKey);
      const match = await prisma.match
        .create({ data: { userAId, userBId } })
        .catch(() => null);
      if (match) createdMatches.push(match);
    }
  }

  console.log("Seeding sample chat history for your matches...");
  const sagarMatches = createdMatches.filter(
    (m) => m.userAId === sagar.id || m.userBId === sagar.id
  );
  for (const match of sagarMatches) {
    let ts = Date.now() - SAMPLE_CONVERSATION.length * 5 * 60 * 1000;
    for (const line of SAMPLE_CONVERSATION) {
      const senderId = line.from === "me" ? sagar.id : match.userAId === sagar.id ? match.userBId : match.userAId;
      await prisma.message.create({
        data: { matchId: match.id, senderId, body: line.body, createdAt: new Date(ts) },
      });
      ts += 5 * 60 * 1000;
    }
  }

  console.log(
    `Seeded ${users.length - 1} demo users (demo1..demo${users.length - 1}) and your account "sagar". Password for all: "${DEMO_PASSWORD}".`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
