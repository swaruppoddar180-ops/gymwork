# TRIDENT FITNESS — Tech Stack

## 1. Recommendation (low-cost, indie-friendly)
| Layer | Pick | Why | Alternative |
|---|---|---|---|
| Frontend | **Keep HTML/CSS/vanilla JS** (current site) | Zero build step, already responsive + themed; team knows it | Next.js if admin console grows complex |
| Backend API | **Node.js + Express + TypeScript** | Same language as `server.js`; huge UPI/WhatsApp lib support | Fastify (faster) |
| ORM | **Prisma** | Typed models, easy migrations for plans/payments | Drizzle |
| Database | **PostgreSQL 16** | Relational data (members↔subscriptions↔payments), reliable cron queries | SQLite only for local dev |
| Jobs/Queue | **node-cron** (MVP) → **BullMQ+Redis** (P1) | Daily expiry scan is simple; queue when WhatsApp volume grows | pg-boss (no Redis) |
| Payments | **UPI intent + manual verify** (MVP) → **Razorpay** (P1) | Works today with zero integration; Razorpay adds UPI/cards + webhooks | Cashfree |
| WhatsApp | **wa.me links** (MVP) → **WhatsApp Cloud API** (P1) | Free, no approval needed now; templates later need Meta approval | Interakt/WATI (paid BSP) |
| Auth/OTP | **MSG91 or Twilio Verify** (P1) | Indian OTP delivery, pay-per-use | Firebase Auth |
| Hosting | **VPS (Hostinger/Hetzner)** or **Render/Railway** | API+DB+cron on one box; static assets via CDN | Vercel (frontend) + Neon (DB) |
| Storage | **Local disk** → S3-compatible (P1) | Payment screenshots, logo | Cloudflare R2 |
| Analytics | **Plausible/Umami** | Privacy-friendly signup-funnel stats | GA4 |

## 2. Environments
- `local`: `server.js` static + `docker compose` (postgres) for API dev.
- `staging`: Render/Railway preview per PR.
- `prod`: VPS, `PORT` env (today 5500), daily Postgres backups, UptimeRobot ping.

## 3. Key Config (env, not hardcoded)
`DATABASE_URL, RAZORPAY_KEY_ID/SECRET, WHATSAPP_TOKEN/PHONE_NUMBER_ID,
OTP_PROVIDER_KEY, GYM_UPI_ID (=6294593283@upi), GYM_WHATSAPP (=916294593283),
REMINDER_DAYS_BEFORE (=3), TZ (=Asia/Kolkata)`

## 4. Conventions
- Money in **paise** (integers) in DB/API; format en-IN (₹) at display.
- Dates in **Asia/Kolkata**; validity = start_date + validity_days (no time-of-day tricks).
- Member codes `TF + base36 timestamp` (keep current scheme).
- Indian mobile regex `^[6-9][0-9]{9}$` shared client + server.
