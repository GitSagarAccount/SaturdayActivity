# Spark — Dating App MVP

A web dating app MVP built with Next.js (App Router, TypeScript, Tailwind), Prisma + SQLite, and a lightweight cookie-session auth (username + password, bcrypt-hashed).

## MVP Features

- **Sign up / log in** — username + password only (no email/phone verification).
- **Profile** — name, age, gender, preference, bio, up to 6 uploaded photos, and interest tags.
- **Discover / matchmaking** — a swipe deck of candidates filtered by gender preference and ranked by number of shared interests (most-in-common first). Once you've swiped everyone, a "Reload search" button re-fetches the queue.
- **Like / Dislike** — swiping records a decision; mutual likes create a Match.
- **Likes page** — two sections: "People who liked you" (with a quick Like back/Pass) and "People you've liked" (everyone you've swiped Like on, with a "Matched" badge where it became mutual).
- **Matches** — everyone you've mutually liked, each opening into a real chat thread.
- **Messaging** — click a match to open a chat thread and send/receive text messages.

## Getting Started

```bash
npm install
npx prisma migrate dev   # creates the local SQLite DB (prisma/dev.db)
npm run seed             # populates ~18 demo profiles + your "sagar" profile for testing
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

The seed script creates `demo1` through `demo18` plus a `sagar` account (all password `password123`), each with real stock placeholder photos (2-4 per profile, fetched from randomuser.me), interests, and some existing swipes/matches between them. The `sagar` account additionally gets 2 guaranteed matches with a seeded sample conversation in each, so logging in as `sagar` immediately shows a populated discover deck, likes, matches, and chat history without manually creating anything.

Re-running `npm run seed` wipes and regenerates all data (including any accounts you created via the signup form) and re-downloads photos, so treat it as a full reset — it needs network access to fetch the placeholder photos.

### Testing the match flow with your own account

Since there's no email/phone verification, you can sign up for as many accounts as you like directly from the UI. To see a full match happen between two *new* accounts: sign up as user A in one browser tab, sign up as user B in an incognito/private tab, swipe-like each other, and you'll see the match banner, the Matches tab update, and be able to open a chat thread between them.

## Tech notes

- **Database**: SQLite via Prisma (`prisma/schema.prisma`, `prisma/dev.db`). Easy to swap to Postgres later by changing the `datasource` provider/URL — the rest of the code is unaffected.
- **Auth**: Custom session-cookie auth (`lib/auth.ts`) — a random token stored in a `Session` table, set as an httpOnly cookie. Passwords are hashed with bcrypt. No NextAuth/OAuth — kept intentionally simple per MVP scope.
- **Photo uploads**: Real file uploads (JPEG/PNG/WEBP/GIF, up to 5MB, up to 6 per user), stored on local disk under `public/uploads/` (gitignored) and referenced by URL in the `Photo` table. Seeded demo photos are real stock placeholder portraits downloaded from randomuser.me at seed time (not uploaded through the API, but stored the same way).
- **Matchmaking**: `lib/matchmaking.ts` computes the discover queue, "who liked me" / "who I liked" lists, and matches list. Ranking is a simple count of shared predefined interest tags — no ML/embedding-based scoring.
- **Messaging**: A `Message` model belongs to a `Match`; `/api/matches/[matchId]/messages` handles reading and posting messages, gated by checking the requester is one of the two matched users. The chat page polls nothing — it's a simple send-and-append UI, no real-time updates across browser tabs/sessions.

## Possible next steps (not yet built)

- Real-time chat updates (e.g. polling or websockets) so a message from the other side of a match shows up without a page reload.
- Location-based filtering/distance sorting.
- Pagination/infinite-scroll for the discover queue and likes list (currently loads the full filtered set at once — fine at MVP scale, would need attention at real scale).
- Email/phone verification and password reset if this ever needs to move beyond local/demo use.
- Reporting/blocking users.
- Unmatching / unliking.
