# Spark — Dating App MVP

A web dating app MVP built with Next.js (App Router, TypeScript, Tailwind), Prisma + SQLite, and a lightweight cookie-session auth (username + password, bcrypt-hashed).

## MVP Features

- **Sign up / log in** — username + password only (no email/phone verification).
- **Profile** — name, age, gender, preference, bio, up to 6 uploaded photos, and interest tags.
- **Discover / matchmaking** — a swipe deck of candidates filtered by gender preference and ranked by number of shared interests (most-in-common first).
- **Like / Dislike** — swiping records a decision; mutual likes create a Match.
- **Who liked you** — a dedicated tab showing everyone who liked you but you haven't responded to yet, with a quick "Like back" / "Pass".
- **Matches** — everyone you've mutually liked.

## Getting Started

```bash
npm install
npx prisma migrate dev   # creates the local SQLite DB (prisma/dev.db)
npm run seed             # populates ~18 demo profiles for testing
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

The seed script creates `demo1` through `demo18`, all with password `password123`, pre-populated with interests, an avatar photo, and some existing swipes/matches between them — so you can log in as one demo user and immediately see people who liked you, matches, and a ranked discover deck without manually creating accounts.

Re-running `npm run seed` wipes and regenerates all data (including any accounts you created via the signup form), so treat it as a full reset.

### Testing the match flow with your own account

Since there's no email/phone verification, you can sign up for as many accounts as you like directly from the UI. To see a full match happen between two *new* accounts: sign up as user A in one browser tab, sign up as user B in an incognito/private tab, swipe-like each other, and you'll see the match banner and the Matches tab update for both.

## Tech notes

- **Database**: SQLite via Prisma (`prisma/schema.prisma`, `prisma/dev.db`). Easy to swap to Postgres later by changing the `datasource` provider/URL — the rest of the code is unaffected.
- **Auth**: Custom session-cookie auth (`lib/auth.ts`) — a random token stored in a `Session` table, set as an httpOnly cookie. Passwords are hashed with bcrypt. No NextAuth/OAuth — kept intentionally simple per MVP scope.
- **Photo uploads**: Real file uploads (JPEG/PNG/WEBP/GIF, up to 5MB, up to 6 per user), stored on local disk under `public/uploads/` (gitignored) and referenced by URL in the `Photo` table.
- **Matchmaking**: `lib/matchmaking.ts` computes the discover queue, "who liked me" list, and matches list. Ranking is a simple count of shared predefined interest tags — no ML/embedding-based scoring.

## Possible next steps (not yet built)

- Messaging between matches.
- Location-based filtering/distance sorting.
- Pagination/infinite-scroll for the discover queue and likes list (currently loads the full filtered set at once — fine at MVP scale, would need attention at real scale).
- Email/phone verification and password reset if this ever needs to move beyond local/demo use.
- Reporting/blocking users.
