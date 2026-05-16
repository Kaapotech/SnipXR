# SnipXR — Premium Link Management

A full-stack link shortener built with Next.js 16, PostgreSQL (Supabase), and NextAuth.js.

## Features

- **Link shortening** — generates a unique 6-character code with collision-safe retry logic
- **Automatic expiration** — all links expire after 30 days
- **Click analytics** — tracks total clicks, country, browser, and device per link
- **QR code generator** — generates and downloads QR codes client-side (no server needed)
- **Link templates** — pre-built URL templates for common use cases
- **Authentication** — email/password login (bcrypt) and GitHub OAuth
- **Dashboard** — view, manage, and delete your links with analytics breakdown
- **Anonymous link claiming** — links created without an account are automatically associated after login
- **Rate limiting** — powered by Upstash Redis (10 req/min on `/api/shorten`, 5 req/15min on `/api/auth/register`)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Auth | NextAuth.js v4 |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion, GSAP |
| Icons | Phosphor Icons, Lucide |
| QR codes | `qrcode.react` |

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd link_shortener
npm install
```

### 2. Configure environment variables

Create a `.env.local` file:

```env
# Database (Supabase)
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

### 3. Push database schema

```bash
npx prisma db push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── [code]/         # Redirect handler (checks expiry, tracks click)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/  # NextAuth route handler
│   │   │   └── register/       # Registration endpoint
│   │   ├── links/
│   │   │   └── claim/          # Claim anonymous links after login
│   │   └── shorten/            # Link creation endpoint
│   ├── dashboard/      # User dashboard with link management
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── link_shortener/ # Link shortener tool page
│   ├── qr_codes/       # QR code generator page
│   └── templates/      # Link templates page
├── components/
│   ├── ClaimLinks.tsx      # Claims anonymous links on login
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Providers.tsx       # SessionProvider wrapper
│   ├── QRGenerator.tsx     # Client-side QR generator
│   ├── ShortenForm.tsx     # Link shortener form
│   └── TemplatePicker.tsx
├── lib/
│   ├── auth.ts         # NextAuth config (credentials + OAuth providers)
│   ├── db.ts           # Prisma client singleton
│   ├── rate-limit.ts   # Upstash Redis rate limiters
│   └── ua-parser.ts    # User-agent parser for analytics
prisma/
└── schema.prisma       # Database schema
```

## API Endpoints

| Method | Endpoint | Description | Rate limit |
|---|---|---|---|
| POST | `/api/shorten` | Create a shortened link | 10 req/min |
| POST | `/api/auth/register` | Register a new account | 5 req/15min |
| POST | `/api/links/claim` | Associate anonymous links with account | — |

## Database Schema

- **User** — id, name, email, password (hashed), emailVerified, image
- **Link** — id, originalUrl, shortCode (unique), clicks, userId, createdAt, expiresAt
- **ClickEvent** — linkId, country, browser, device, createdAt
- **Account** — OAuth provider accounts (GitHub, Google)
- **Session** — JWT sessions
- **VerificationToken** — email verification tokens (prepared, not yet active)

## Deployment (Vercel)

1. Connect repo to Vercel
2. Add all environment variables from `.env.local` to Vercel → Settings → Environment Variables
3. Set `NEXTAUTH_URL` to your production URL (e.g. `https://snip-xr.vercel.app`)
4. Deploy — `prisma generate` runs automatically via the build script

## Known Limitations

- Email verification is prepared in the schema but not yet active
- Google OAuth requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to be configured
- `NEXTAUTH_SECRET` should be a strong random value (`openssl rand -base64 32`)
