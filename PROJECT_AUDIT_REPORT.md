# StaminaBoost — Project Audit Report

**Date:** June 2026  
**Migration:** Neon Postgres + Email OTP → **MongoDB Atlas + Password Auth**

---

## 1. Project Structure Overview

```
report-ai/
├── app/                    # Runtime Next.js App Router (synced from src_new/app)
│   ├── [locale]/           # i18n pages (en, hi, ta)
│   └── api/                # API routes (auth, intake, checkout, orders, webhooks)
├── src/                    # Application source (@/* alias)
│   ├── components/         # React UI
│   ├── lib/
│   │   ├── auth/           # JWT, password, guards, users (MongoDB)
│   │   ├── mongodb/        # Atlas client + document models
│   │   ├── payments/       # Stripe + demo checkout
│   │   ├── pdf/            # Report PDF generation
│   │   └── ...             # rules-engine, session-store, i18n, etc.
│   ├── i18n/               # next-intl routing
│   └── middleware.ts       # Auth + locale middleware
├── src_new/                # Editable App Router source (synced → app/ on dev/build)
├── data/                   # Static JSON (exercises, foods, marketing, i18n)
├── messages/               # UI translations (en, hi, ta)
├── public/media/           # Image assets
└── scripts/                # Dev repair, media sync, prestart
```

**Architecture pattern:** Next.js 16 App Router + MongoDB Atlas + JWT cookies (`vp_auth`) + in-memory cache with MongoDB persistence for plan sessions and orders.

---

## 2. Files Removed and Why

### Email OTP system (removed entirely)

| File | Reason |
|------|--------|
| `src/components/verify-otp-form.tsx` | OTP UI no longer needed |
| `app/[locale]/verify/page.tsx` | Verify page removed |
| `app/api/auth/verify-email/route.ts` | Email OTP verification API |
| `app/api/auth/resend-otp/route.ts` | OTP resend API |
| `src/lib/auth/otp.ts` | OTP generation/storage |
| `src/lib/auth/otp-response.ts` | OTP API response helpers |
| `src/lib/auth/signup-flow.ts` | Email OTP send on signup |
| `src/lib/email.ts` | Resend email integration |
| `src/lib/email-config.ts` | Resend sender config |
| `src/lib/email-validation.ts` | MX/DNS email deliverability checks |
| `src/lib/debug-log.ts` | Debug session instrumentation |

### Neon Postgres / Drizzle (replaced by MongoDB)

| File | Reason |
|------|--------|
| `src/lib/db/index.ts` | Neon connection |
| `src/lib/db/schema.ts` | Drizzle PostgreSQL schema |
| `drizzle.config.ts` | Drizzle Kit config |
| `drizzle/0000_initial.sql` | Postgres migration |

### Other cleanup

| File | Reason |
|------|--------|
| `src/lib/auth/phone.ts` | SMS OTP removed earlier; unused |
| `scripts/debug-app-dirs.mjs` | One-off diagnostic script |
| `debug-7bbb1a.log` | Debug log file |

### Dependencies removed from `package.json`

| Package | Reason |
|---------|--------|
| `@neondatabase/serverless` | Replaced by `mongodb` |
| `drizzle-orm` | No longer used |
| `drizzle-kit` | No longer used |
| `resend` | Email OTP removed |

### Environment variables removed

| Variable | Reason |
|----------|--------|
| `DATABASE_URL` | Neon Postgres — replaced by `MONGODB_URI` |
| `RESEND_API_KEY` | Email OTP removed |
| `RESEND_ACCOUNT_EMAIL` | Email OTP removed |
| `EMAIL_FROM` | Email OTP removed |
| `MSG91_*` | SMS OTP removed earlier |

### New environment variables

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | Database name (default: `StaminaBoost`) |

---

## 3. Current Authentication Flow (Post-OTP)

```
┌─────────────┐     POST /api/auth/signup      ┌──────────────────┐
│  /signup    │ ─────────────────────────────► │ MongoDB users    │
│  (form)     │   name, email, password        │ collection       │
└─────────────┘                                └────────┬─────────┘
       │                                                │
       │         bcrypt hash + insert document          │
       │         JWT cookie (vp_auth, 7 days)           │
       ▼                                                ▼
┌─────────────┐                              ┌──────────────────┐
│  /start     │ ◄── redirect immediately     │ Each user = one  │
│  (intake)   │     (no email verify step)   │ isolated document│
└─────────────┘                              └──────────────────┘

┌─────────────┐     POST /api/auth/login       ┌──────────────────┐
│  /login     │ ─────────────────────────────► │ Find user by     │
│  (form)     │   email + password             │ email, verify    │
└─────────────┘                                │ bcrypt, set JWT  │
       │                                       └──────────────────┘
       ▼
  /start or ?next= path

Protected routes (middleware + API guards):
  /start, /preview, /checkout, /account
  → require valid JWT cookie
  → unauthenticated users redirect to /login
```

**Logout:** `POST /api/auth/logout` clears `vp_auth` cookie.

**Session isolation:** Each user's plans and orders are stored with their `userId` (MongoDB ObjectId string). Users can only access their own sessions/orders via auth checks on API routes.

---

## 4. MongoDB Database Schema

### Collection: `users`

```typescript
{
  _id: ObjectId,           // Unique user ID
  fullName: string,
  email: string,           // Unique index
  phone?: string | null,   // Sparse unique index
  passwordHash: string,    // bcrypt (cost factor 12)
  locale: "en" | "hi" | "ta",
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: `plan_sessions`

```typescript
{
  _id: string,             // UUID session ID
  userId: string,          // Owner — isolated per user
  intake: IntakeData,      // Questionnaire answers
  plan: PlanResult,        // Generated wellness plan
  locale: string,
  createdAt: Date,
  expiresAt?: Date
}
```

### Collection: `orders`

```typescript
{
  _id: ObjectId,
  orderId: string,         // Unique order identifier
  userId: string,          // Owner — isolated per user
  planSessionId: string,
  stripeSessionId?: string,
  email?: string,
  name: string,
  status: "pending" | "paid" | "failed",
  blobUrl?: string,        // Vercel Blob PDF URL
  createdAt: Date
}
```

**Indexes recommended (created on first signup):**
- `users.email` — unique
- `users.phone` — unique, sparse
- `orders.userId` + `orders.createdAt` — for account history
- `plan_sessions.userId` — for user session lookup

---

## 5. Security Analysis & Recommendations

### Current protections

| Measure | Status |
|---------|--------|
| Password hashing (bcrypt) | ✅ Implemented |
| JWT in httpOnly cookie | ✅ Implemented |
| Input validation (Zod) | ✅ Signup, login, intake |
| Auth middleware on protected pages | ✅ Implemented |
| API auth guards | ✅ intake, checkout, download |
| Order ownership check | ✅ download route |

### Recommended hardening steps

#### Authentication & authorization
1. **Rate limiting** — Add per-IP limits on `/api/auth/login` and `/api/auth/signup` (e.g. `@upstash/ratelimit` or middleware) to prevent brute force.
2. **Stronger JWT** — Rotate `AUTH_SECRET` in production; consider shorter token TTL + refresh tokens for sensitive apps.
3. **Password policy** — Enforce complexity rules (uppercase, number, symbol) beyond min 8 chars.
4. **Account lockout** — Lock after N failed login attempts per email/IP.

#### Injection & XSS
5. **NoSQL injection** — Always use MongoDB driver parameterized queries (already done); never concatenate user input into queries.
6. **XSS** — React escapes by default; avoid `dangerouslySetInnerHTML`; sanitize any user-generated content in PDFs.
7. **CSRF** — SameSite=Lax cookies help; for state-changing APIs consider CSRF tokens if supporting cross-origin forms.

#### MongoDB Atlas security
8. **Network access** — Restrict Atlas IP allowlist to Vercel/deployment IPs in production.
9. **Database user** — Use least-privilege DB user (readWrite on `StaminaBoost` only, not admin).
10. **Encryption** — Atlas encrypts at rest by default; always use `mongodb+srv://` with TLS.
11. **Connection pooling** — `MongoClient` singleton in `src/lib/mongodb/client.ts` reuses connections (already implemented).
12. **Never commit** `MONGODB_URI` — keep in `.env.local` / Vercel env vars only.

#### API & headers
13. Add security headers via `next.config.ts`: `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`.
14. Validate and sanitize all webhook payloads (Stripe signature verification — check if implemented).
15. Audit `BLOB_READ_WRITE_TOKEN` — ensure download URLs are auth-gated (already done).

---

## 6. Performance & Scalability Recommendations

### High traffic / backend

| Recommendation | Detail |
|----------------|--------|
| **MongoDB indexes** | Add compound indexes on `orders.userId`, `plan_sessions.userId` |
| **Redis caching** | Cache plan preview JSON, session lookups; use Upstash Redis on Vercel |
| **Connection pooling** | MongoDB Atlas M10+ for dedicated pools at scale |
| **Load balancing** | Vercel auto-scales; for self-hosted use nginx/ALB + multiple Next.js instances |
| **API response caching** | `Cache-Control` on static marketing data; ISR for locale homepages |
| **Async operations** | PDF generation + Blob upload already async; move to background job queue (Inngest/BullMQ) at scale |
| **Database query optimization** | Project only needed fields; paginate order history |

### Frontend

| Recommendation | Detail |
|----------------|--------|
| **Code splitting** | `next/dynamic` for `framer-motion`, PDF preview, heavy sections |
| **Lazy loading** | Images via `next/image` with `loading="lazy"` |
| **Image optimization** | Serve WebP/AVIF from `public/media/`; use Vercel Image Optimization |
| **Bundle analysis** | Run `@next/bundle-analyzer` to trim unused icon packs |
| **CDN** | Vercel Edge Network for static assets; Cloudflare in front for global cache |

### Caching layers (recommended stack)

```
Browser → CDN (static) → Vercel Edge → Redis (sessions/preview) → MongoDB Atlas
```

---

## 7. User Onboarding Questions

Answer these to guide the next development phase:

### Product & roles
1. **What user roles are needed?** (e.g. admin, standard user, premium subscriber)
2. **Should admins manage users, view all orders, or edit plan content?**
3. **Is there a free tier vs paid tier with different feature access?**

### Authentication
4. **Is email/password sufficient, or do you need social login?** (Google, GitHub, Apple)
5. **Do you want password reset via email link?** (would need transactional email — Resend/SendGrid)
6. **Should users verify email at all in the future?** (optional, not blocking)

### Features & access control
7. **Which features require authentication?** (currently: intake, preview, checkout, account, download)
8. **Can users have multiple wellness plans, or one active plan at a time?**
9. **Should plan history be permanent or expire after N days?**

### Scale & infrastructure
10. **What is the expected user base in year 1?** (100 / 10K / 100K+)
11. **Expected peak concurrent users?**
12. **Geographic focus?** (India only vs global — affects CDN, payment methods)

### Compliance & legal
13. **GDPR compliance needed?** (EU users — data export, deletion, consent)
14. **HIPAA or health-data regulations?** (wellness vs medical claims)
15. **Data retention policy?** How long to keep user data and PDFs?
16. **Age verification requirements?** (currently 18+ age gate on intake)

### Payments & delivery
17. **Stripe only, or also Razorpay/UPI for India?**
18. **Should purchase confirmation emails be re-added?** (without OTP — order receipt only)
19. **PDF storage: Vercel Blob vs S3 vs MongoDB GridFS?**

### MongoDB Atlas setup
20. **Do you have a MongoDB Atlas cluster created?** Paste `MONGODB_URI` into `.env.local`:
    ```env
    MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority
    MONGODB_DB_NAME=StaminaBoost
    ```

---

## 8. Quick Start (After Migration)

```bash
# 1. Add MongoDB Atlas URI to .env.local
# 2. Install dependencies (already done)
npm install

# 3. Run dev server
npm run dev

# 4. Test flow
# → /en/signup → create account → redirects to /start
# → complete intake → preview → checkout → account
```

---

## Summary

| Before | After |
|--------|-------|
| Neon Postgres + Drizzle | **MongoDB Atlas** |
| Email OTP verification (Resend) | **Password-only auth** |
| Signup → verify email → intake | **Signup → intake immediately** |
| `DATABASE_URL`, `RESEND_*` env vars | **`MONGODB_URI`, `MONGODB_DB_NAME`** |

Each user is stored as an isolated MongoDB document with their own `userId` linking plans and orders. The app builds successfully with the new auth stack.
