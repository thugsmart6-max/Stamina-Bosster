# VitalityPath PRO — Advanced Project Prompt (v2)

> **Purpose**: Governs all AI-assisted work on this codebase. Read before writing a single line.

---

## 1. Product Identity

**VitalityPath** is an investor-ready wellness PDF funnel for the Indian market. Users sign up, complete a multi-step health intake, preview a personalised stamina/wellness plan, pay (demo or Stripe), and receive a full PDF report. Educational only — not medical advice. Pricing: ₹799 INR. Locales: English (`/en`), Hindi (`/hi`), Tamil (`/ta`).

**Design language**: Dark, kinetic, premium — think elite sports-performance app meets Ayurvedic precision. Not a generic SaaS dashboard. Every screen should feel like it was built for serious self-optimisers.

---

## 2. Tech Stack (locked)

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.7 — App Router, webpack |
| UI | React 19, Tailwind CSS 4, Framer Motion, Lucide, Iconify |
| i18n | next-intl — `messages/{en,hi,ta}.json` + `data/i18n/` |
| Auth | Password-only, JWT in `httpOnly` cookie `vp_auth` (7d), jose + bcryptjs |
| Database | MongoDB Atlas — collections: `users`, `plan_sessions`, `orders` |
| Payments | `PAYMENT_MODE=demo` → preview checkout only (no Stripe, no charge; allowed in production for beta). `PAYMENT_MODE=stripe` + Stripe keys → Stripe Checkout |
| PDF | @react-pdf/renderer, Vercel Blob storage |
| Forms | react-hook-form + zod |
| Tests | Vitest (rules engine) |

**Do not introduce**: Neon/Drizzle, Resend OTP, SMS/MSG91, `/verify`, any email-based auth flow.

---

## 3. Architecture Rules

```
report-ai/
├── app/                    ← Runtime App Router (auto-synced — DO NOT edit directly)
│   ├── [locale]/           ← Pages: home, start, preview, checkout, signup, login, account
│   └── api/                ← auth, intake, checkout, orders, webhooks, events
├── src/                    ← ALL source lives here (@/* alias)
│   ├── components/
│   ├── lib/
│   │   ├── auth/           ← JWT, guards, users
│   │   ├── mongodb/        ← Atlas client + models
│   │   ├── payments/       ← Stripe + demo
│   │   ├── pdf/            ← Report generation
│   │   ├── rules-engine.ts
│   │   └── session-store.ts
│   └── middleware.ts
├── src_new/app/            ← EDIT routes here → synced by scripts/repair-app-router.mjs
├── data/                   ← exercises.json, foods.json, marketing.json, i18n overlays
├── messages/               ← UI translations
└── scripts/
```

**Hard rules**:
- Route files → `src_new/app/` only. Never touch `app/` directly.
- Business logic + components → `src/` only.
- MongoDB queries must be parameterised — no string interpolation.
- Zod schemas required on every API route.
- `getCurrentUser()` must return `null` on DB failure — never throw to public pages.

---

## 4. User Funnel

| Step | Route | Key action |
|---|---|---|
| 1 | `/[locale]` | Marketing hero → CTA |
| 2 | `/[locale]/signup` | Signup → JWT cookie → `/start` |
| 3 | `/[locale]/login` | Login → JWT → `/start` or `?next=` |
| 4 | `/[locale]/start` | 5-step intake wizard, draft autosave |
| 5 | `/[locale]/preview` | Readiness ring, exercise/food cards, watermarked preview |
| 6 | `/[locale]/checkout` | Demo card or Stripe Checkout |
| 7 | `/[locale]/success/[orderId]` | Full PDF download |

**Middleware-protected** (require valid JWT): `/start`, `/preview`, `/checkout`, `/account`.

---

## 5. Auth System

- **Signup**: name + email + password → bcrypt hash → MongoDB `users` → JWT immediately
- **Login**: email + password → verify bcrypt → JWT
- **Session**: `getCurrentUser()` in `src/lib/auth/guards.ts` reads JWT, loads user from MongoDB
- **Logout**: `POST /api/auth/logout` clears `vp_auth` cookie
- **Isolation**: every user's plans/orders isolated by `userId`

### MongoDB Schema

```ts
// users
{ _id, fullName, email: unique, phone?, passwordHash, locale, createdAt, updatedAt }

// plan_sessions
{ _id: UUID, userId, intake, plan, locale, expiresAt? }

// orders
{ orderId, userId, planSessionId, stripeSessionId?, status, blobUrl? }
```

---

## 6. Security Requirements (ENFORCE ALL)

### 6.1 Input & API
- All API routes: Zod parse request body before any processing — reject with 400 on failure
- MongoDB: use parameterised queries only — no template literals with user data
- Rate-limit all auth routes (`/api/auth/signup`, `/api/auth/login`): max 10 req/min per IP using `src/lib/rate-limit.ts`
- CSRF: SameSite=Strict on `vp_auth` cookie. Verify `Origin` header on all state-changing API routes
- Validate `Content-Type: application/json` on all POST/PUT/PATCH routes before parsing

### 6.2 Auth & Session
- Passwords: bcryptjs with cost factor ≥ 12
- JWT: sign with AUTH_SECRET (≥ 32 bytes, random), HS256, 7-day expiry
- Cookie flags: `httpOnly`, `secure` (production), `sameSite: strict`, `path: /`
- Rotate JWT on sensitive actions (password change, account deletion)
- `getCurrentUser()` must be side-effect-free — only read, never write

### 6.3 HTTP & Headers

Add these via `next.config.ts` `headers()` for ALL routes:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; frame-src https://js.stripe.com; connect-src 'self' https://api.stripe.com; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline';
```

(Adjust CSP as needed for Next.js inline scripts, analytics, and fonts — test after changes.)

### 6.4 Payments & Webhooks
- Stripe webhook: verify `stripe-signature` header with `STRIPE_WEBHOOK_SECRET` before processing
- Demo mode: no actual charge — return a mock orderId, still create order in DB
- Never log full Stripe objects — strip card data before any logging
- Idempotency: check `orders` collection before fulfilling — prevent double-delivery on webhook retry

### 6.5 PDF & Blob
- Sign Blob URLs with short TTL (1h) for download links — never expose raw public URLs
- Watermark preview PDF server-side — never send unlock logic to client

### 6.6 Environment & Secrets
- All secrets via `process.env` — no hardcoded values, no `.env.local` in git
- Validate required env vars at startup in `src/lib/env.ts` — fail fast with clear error message
- NEXT_PUBLIC_* vars: only safe-to-expose values (app URL, Stripe publishable key, analytics IDs)

---

## 7. Advanced Frontend — Pro Design System

### 7.1 Visual Identity
- **Palette**: Warm oatmeal background (`#F3EEE4`), berry red (`#D42B2B`), pool teal (`#0E8F9C`), sunset gold (`#E8B84A`), espresso type (`#1C1814`)
- **Typography**: Display — `Sora` (semibold/bold). Body — `Inter`. Hindi/Tamil — Noto Sans. Load via `next/font`
- **Signature element**: A pulsing "Readiness Ring" SVG on the preview page — animated arc showing the user's personalised score, colour-shifts from amber → green as score increases
- **Motion**: Framer Motion orchestrated page transitions (`AnimatePresence` with `layoutId`), staggered card reveals on scroll, micro-interactions on CTA buttons (scale + glow). Respect `prefers-reduced-motion`

### 7.2 Landing Page (`/[locale]`)
Must include:
- **Hero**: Full-viewport, dark — bold stat ("87% of Indian men are nutritionally deficient"), animated counter, single CTA
- **Social proof strip**: Marquee of logos / testimonial chips — auto-scroll, pause on hover
- **How it works**: 3-step visual (Intake → AI Plan → PDF Report) with animated connector lines
- **Plan preview teaser**: Blurred/watermarked screenshot of a real report section
- **Pricing block**: Single card, ₹799, feature list, urgency element (limited slots or timer)
- **FAQ accordion**: Framer Motion expand/collapse
- **Footer**: Language switcher, legal links, "Not medical advice" disclaimer
- **18+ age gate**: Modal on first load, store acceptance in localStorage

### 7.3 Intake Wizard (`/[locale]/start`)
- 5 steps: basics → body/BMI → lifestyle → screening → goals
- Progress bar with step labels, animated fill
- Draft autosave: debounced 800ms write to `plan_sessions` via `PATCH /api/intake/draft`
- BMI auto-calculation with visual indicator (underweight/normal/overweight/obese) — no judgment language
- Smooth step transitions with Framer Motion (`AnimatePresence`, slide direction aware)
- Keyboard-navigable: Enter advances, Escape exits modal elements
- Mobile-first: single-column, large touch targets (min 44×44px)

### 7.4 Preview Page (`/[locale]/preview`)
- **Readiness Ring**: SVG animated arc, score 0–100, personalised label ("Strong Foundation", "Needs Work", etc.)
- **Exercise cards**: Grid of 3–6 cards, each with icon (Iconify), name, duration, intensity badge
- **Food cards**: Grid of recommended foods with category chips
- **Watermark overlay**: Semi-transparent diagonal "PREVIEW" text, `pointer-events: none`, CSS only — no canvas
- **Upgrade CTA**: Sticky bottom bar with price, benefits list, CTA button — disappears when user scrolls to checkout section

### 7.5 Global Components
- **SiteHeader**: Sticky, blur-backdrop (`backdrop-filter: blur(12px)`), auth-aware nav (show "My Account" / logout when logged in, "Sign up" / "Log in" when not)
- **Language switcher**: Floating bottom-left, pill with flag + locale code, popover with options, persists locale in cookie
- **Toast system**: Global, accessible, auto-dismiss — success/error/info variants
- **Error boundaries**: Per-route, friendly UI with retry button
- **Loading skeletons**: Match layout of target content — never show raw spinners for content areas

---

## 8. i18n Rules

- All user-facing strings must exist in `messages/{en,hi,ta}.json` — no hardcoded English in JSX
- Locale-specific number formatting: use `Intl.NumberFormat` with `locale` prop for currency and numbers
- RTL not required for current locales but avoid directional CSS (`left`, `right`) — use logical properties (`inline-start`, `inline-end`)
- Exercise/food data localised via `data/i18n/` overlays — merge at runtime in `rules-engine.ts`

---

## 9. Analytics Events

Fire via `POST /api/events` (internal) + Vercel Analytics:

| Event | When |
|---|---|
| `page_view` | Every route change |
| `intake_started` | Step 1 of wizard |
| `intake_step_completed` | Each step completion with `{ step: 1-5 }` |
| `intake_abandoned` | User leaves mid-wizard (beforeunload) |
| `preview_viewed` | Preview page load |
| `checkout_initiated` | Checkout page load |
| `purchase_completed` | Order fulfilled, with `{ orderId, amount }` |
| `pdf_downloaded` | Success page PDF click |
| `age_gate_accepted` | 18+ modal acceptance |

No PII in events — use `userId` hash, not email or name.

---

## 10. Performance Targets

- Lighthouse score: ≥ 90 on all categories for landing page
- LCP: < 2.5s on 4G mobile
- CLS: < 0.1
- Images: `next/image` everywhere, WebP with fallbacks, lazy load below fold
- Fonts: `next/font` with `display: swap`, preload critical weights
- Bundle: dynamic import heavy components (`react-pdf`, chart libraries, Stripe.js)
- API routes: respond in < 500ms for auth, < 2s for plan generation

---

## 11. PDF Report (Full Version)

Structure (The Start layout — night cover, paper interiors, numbered hairline sections):
1. Cover — stacked VITALITY / PATH, name, wellness index, goal
2. Profile — BMI, activity, screening notes, medical flag if any
3. Move — personalised exercise photo cards
4. Fuel — eat / limit foods with portions
5. Recover — sample day, timeline, compact four-week log
6–9. Reference guide — exercises, foods, routine, clinician signs

Generated by `src/lib/pdf/FullReportDocument.tsx` using `@react-pdf/renderer`. Store result on Vercel Blob. Signed URL returned to client on success page.

---

## 12. Upgrade Features (implement in this order)

### Priority 1 — Core experience
- [ ] **BMI visual indicator** in intake step 2 with auto-calc
- [ ] **Draft autosave** with "Saved" indicator in intake header
- [ ] **Readiness Ring animation** on preview page
- [ ] **Watermark overlay** on preview PDF section
- [ ] **Sticky upgrade CTA** on preview page

### Priority 2 — Conversion
- [ ] **Social proof marquee** on landing page
- [ ] **Exit-intent modal** (desktop only) — "Wait! Your plan is ready" CTA
- [ ] **Email capture** on landing (non-blocking) — store in `users` if not signed up
- [ ] **Order confirmation email** (transactional) — send PDF download link
- [ ] **Referral code system** — `?ref=CODE` tracked in orders collection

### Priority 3 — Retention & trust
- [ ] **Account page** — view past orders, re-download PDFs
- [ ] **Plan comparison** — show what paid vs preview unlocks
- [ ] **Progress tracker** — check off exercises/meals (localStorage, no auth required)
- [ ] **WhatsApp share** — pre-filled message with readiness score teaser

### Priority 4 — Internationalisation
- [ ] **Hindi content** — full translation of all messages
- [ ] **Tamil content** — full translation of all messages
- [ ] **Locale-specific food/exercise data** — regional Indian options per locale

---

## 13. Key Files Reference

| File | Purpose |
|---|---|
| `src/lib/mongodb/client.ts` | MongoClient singleton |
| `src/lib/auth/guards.ts` | `getCurrentUser()`, route protection |
| `src/lib/auth/users.ts` | User CRUD |
| `src/lib/auth/session.ts` | JWT sign/verify, cookie |
| `src/components/intake-wizard.tsx` | 5-step intake UI |
| `src/lib/rules-engine.ts` | Plan generation from intake data |
| `src/lib/fulfill-order.ts` | PDF + Blob + fulfillment logic |
| `src/lib/payments/stripe-provider.ts` | Stripe Checkout + webhook |
| `src/lib/env.ts` | Env var validation at startup |
| `src/lib/rate-limit.ts` | IP-based rate limiting for auth routes |
| `PROJECT_AUDIT_REPORT.md` | Full audit — source of truth |
| `.env.example` | Canonical env var reference |

---

## 14. Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vitalitypath?retryWrites=true&w=majority
MONGODB_DB_NAME=vitalitypath

# Auth
AUTH_SECRET=<random 64-char string>

# Payments
PAYMENT_MODE=demo                        # preview checkout only; or: stripe (+ Stripe env keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

---

## 15. Commands

```bash
npm install
cp .env.example .env.local          # configure before running
npm run dev                          # runs repair-app-router + media sync first
npm run build
npm test
```

---

## 16. Known Constraints

- MongoDB Atlas: whitelist your IP in Network Access; `ReplicaSetNoPrimary` = connectivity/credentials issue
- Windows: ghost `src/app/preview` folders break routing — `repair-app-router.mjs` fixes this
- PDF content is still largely English — UI is localised for en/hi/ta; full content translation is Priority 4
- README is partially outdated — trust `PROJECT_AUDIT_REPORT.md`, `.env.example`, and this document

---

## 17. Coding Conventions

1. Minimise scope — match existing patterns in `src/`
2. Zod on every API route, parameterised MongoDB queries only
3. Routes → `src_new/app/`, logic → `src/lib/`, UI → `src/components/`
4. Never commit `.env.local` or any secret
5. Only commit code when explicitly asked
6. TypeScript strict mode — no `any` without comment justification
7. Named exports for components, default exports for pages
8. Co-locate component styles — no global CSS except design tokens
9. All async operations must handle errors — no unhandled promise rejections
10. Log errors with context (route, userId hash, timestamp) — never log PII

---

## 18. Spec vs codebase (maintenance)

When implementing §6–§12, reconcile with the repo: cookie `sameSite`, global security headers, `env.ts`, `rate-limit.ts`, CSP, and analytics event parity may lag this spec until explicitly built. Prefer bringing the code up to this document over silently weakening the document.

---

*Last updated: refactor to v2 — security hardening, pro design system, upgrade feature roadmap added.*
