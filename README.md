# Reno Platforms — Notice Board

A full-stack Notice Board built with **Next.js (Pages Router)**, **Prisma**, and a hosted MySQL database. Supports full CRUD with server-side validation, responsive UI, and Urgent-first ordering.

**Live demo:** _Add your Vercel URL here after deployment_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 — Pages Router |
| Language | TypeScript |
| Database ORM | Prisma |
| Database | TiDB Cloud (MySQL-compatible, free) |
| Hosting | Vercel (Hobby tier) |
| Styling | Tailwind CSS |

---

## Features

- ✅ Create, Read, Update, Delete notices
- ✅ Server-side input validation (API routes)
- ✅ Urgent notices sorted first via `prisma orderBy`
- ✅ Visible red **Urgent** badge with pulse animation
- ✅ Delete confirmation modal
- ✅ Responsive card grid (mobile + desktop)
- ✅ Category filter (All / General / Exam / Event)
- ✅ Bonus: optional image URL per notice

---

## Notice Fields

| Field | Type | Required |
|---|---|---|
| `title` | Short text | ✅ |
| `body` | Long text | ✅ |
| `category` | `Exam` \| `Event` \| `General` | — |
| `priority` | `Normal` \| `Urgent` | — |
| `publishDate` | Date | ✅ |
| `imageUrl` | URL string | — (bonus) |

---

## Running Locally

### 1. Prerequisites

- Node.js ≥ 18
- A free hosted database (TiDB Cloud recommended — see below)

### 2. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/reno-noticeboard.git
cd reno-noticeboard
npm install
```

### 3. Set up a free database (TiDB Cloud)

1. Sign up at [tidbcloud.com](https://tidbcloud.com) (no credit card needed).
2. Create a **Serverless** cluster (free tier).
3. Click **Connect** → choose **Prisma** → copy the `DATABASE_URL`.

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and paste your `DATABASE_URL`:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/noticeboard?sslaccept=strict"
```

### 5. Push schema to database

```bash
npx prisma db push
```

This creates the `Notice` table in your hosted database.

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Useful Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build (also runs `prisma generate`) |
| `npm run start` | Start production server |
| `npm run db:push` | Sync Prisma schema → database (no migration history) |
| `npm run db:migrate` | Deploy pending migrations |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial notice board implementation"
git remote add origin https://github.com/YOUR_USERNAME/reno-noticeboard.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
2. Under **Environment Variables**, add:
   - `DATABASE_URL` → your TiDB Cloud / Neon / Supabase connection string
3. Click **Deploy**.

Vercel automatically runs `npm run build` which includes `prisma generate`.

> ⚠️ Do **not** use a local SQLite file — Vercel's filesystem is ephemeral. Always use a hosted database.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notices` | List all notices (Urgent first) |
| `POST` | `/api/notices` | Create a notice |
| `GET` | `/api/notices/:id` | Get single notice |
| `PUT` | `/api/notices/:id` | Update a notice |
| `DELETE` | `/api/notices/:id` | Delete a notice |

All mutating routes validate input server-side and return `422` with field-level errors on failure.

---

## What I Would Improve With More Time

1. **Image uploads to Cloudinary / S3** — Currently accepts an image URL. With more time I'd add drag-and-drop file upload with preview, storing files in Cloudinary (free tier) and saving the resulting URL in the database.
2. **Pagination / infinite scroll** — As notices grow, a paginated or cursor-based list would be more performant.
3. **Search** — Full-text search across title and body using MySQL `FULLTEXT` index via Prisma's `queryRaw`.
4. **Toast notifications** — Replace the current silent success with accessible toast messages for create/edit/delete feedback.
5. **Optimistic UI updates** — Remove the refetch after mutations for instant perceived performance.

---

## AI Usage

Claude (Anthropic) was used to scaffold and generate the project structure, component code, API routes, validation logic, Prisma schema, Tailwind styling, and this README. All code was reviewed and the logic (ordering, validation, HTTP semantics) was verified for correctness against the assignment spec before submission.

Specific areas where AI helped most:
- Generating boilerplate for Next.js API routes with correct HTTP methods and status codes
- Writing the Prisma `orderBy` query for Urgent-first ordering at the database level
- Tailwind component styling for responsive card grid

---

## Project Structure

```
reno-noticeboard/
├── components/
│   ├── ConfirmModal.tsx   # Delete confirmation dialog
│   ├── NoticeCard.tsx     # Individual notice card
│   └── NoticeForm.tsx     # Create / edit form (modal)
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   └── validate.ts        # Server-side validation
├── pages/
│   ├── api/
│   │   └── notices/
│   │       ├── index.ts   # GET /api/notices, POST /api/notices
│   │       └── [id].ts    # GET/PUT/DELETE /api/notices/:id
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx          # Main notice board page
├── prisma/
│   └── schema.prisma      # Database schema
├── styles/
│   └── globals.css
├── types/
│   └── notice.ts          # TypeScript types
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```
