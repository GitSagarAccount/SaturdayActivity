import { PrismaClient, Gender, Preference } from "@prisma/client";
import bcrypt from "bcryptjs";
import { writeFileSync, mkdirSync } from "fs";
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

const AVATAR_COLORS = [
  "#fb7185", "#f472b6", "#c084fc", "#818cf8", "#60a5fa",
  "#38bdf8", "#2dd4bf", "#4ade80", "#facc15", "#fb923c",
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

function makeAvatarSvg(initials: string, color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <rect width="400" height="400" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="160" fill="white"
      text-anchor="middle" dominant-baseline="central">${initials}</text>
  </svg>`;
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
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.userInterest.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.user.deleteMany();

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  mkdirSync(uploadsDir, { recursive: true });

  const interests = await Promise.all(
    PREDEFINED_INTERESTS.map((name) => prisma.interest.create({ data: { name } }))
  );

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const users = [];
  for (let i = 0; i < NAMES.length; i++) {
    const { name, gender } = NAMES[i];
    const age = 20 + Math.floor(rand() * 20);
    const interestedIn = pick([Preference.MALE, Preference.FEMALE, Preference.EVERYONE, Preference.EVERYONE]);
    const bio = pick(BIOS);
    const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
    const initials = name.slice(0, 2).toUpperCase();

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

    const filename = `${user.id}-avatar.svg`;
    writeFileSync(path.join(uploadsDir, filename), makeAvatarSvg(initials, color));
    await prisma.photo.create({
      data: { userId: user.id, url: `/uploads/${filename}`, order: 0 },
    });

    const chosenInterests = pickMany(interests, 3 + Math.floor(rand() * 4));
    await prisma.userInterest.createMany({
      data: chosenInterests.map((interest) => ({ userId: user.id, interestId: interest.id })),
    });

    users.push(user);
  }

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

  console.log("Creating matches for mutual likes...");
  const likeSwipes = await prisma.swipe.findMany({ where: { action: "LIKE" } });
  const likeSet = new Set(likeSwipes.map((s) => `${s.fromUserId}:${s.toUserId}`));
  const seenPairs = new Set<string>();
  for (const swipe of likeSwipes) {
    if (likeSet.has(`${swipe.toUserId}:${swipe.fromUserId}`)) {
      const [userAId, userBId] = [swipe.fromUserId, swipe.toUserId].sort();
      const pairKey = `${userAId}:${userBId}`;
      if (seenPairs.has(pairKey)) continue;
      seenPairs.add(pairKey);
      await prisma.match
        .create({ data: { userAId, userBId } })
        .catch(() => {});
    }
  }

  console.log(`Seeded ${users.length} demo users. Login with username "demo1".."demo${users.length}" and password "${DEMO_PASSWORD}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
