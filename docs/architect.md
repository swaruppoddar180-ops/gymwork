# TRIDENT FITNESS — System Architecture

## 1. Current State (as-is)
```
Browser ──HTTP──▶ Node static server (server.js) ──▶ index.html / styles.css / script.js
                          │
                          ▼
              localStorage only (theme). No DB, no backend, no auth.
              External: Google Fonts, Unsplash images, Google Maps embed,
                        muscleblaze.com, wa.me, upi:// links
```
All business logic (pricing, validity math, BMI gating) lives in client JS.
Payments are UPI-intent links; verification is manual at the desk.

## 2. Target Architecture (full platform)
```
┌──────────┐      ┌──────────────┐      ┌───────────────┐      ┌───────────┐
│  Member  │─────▶│   Frontend   │─────▶│   Backend API │─────▶│ Postgres  │
│  browser │◀─────│  (web app)   │◀─────│ Node + Express│◀─────│  (Prisma) │
└──────────┘      └──────────────┘      └───────┬───────┘      └───────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    ▼                          ▼                          ▼
            ┌──────────────┐           ┌──────────────┐           ┌──────────────┐
            │ Razorpay/UPI │           │ WhatsApp     │           │ OTP (MSG91)  │
            │ (pay +       │           │ Cloud API    │           │ member login │
            │  webhooks)   │           │ (templates)  │           └──────────────┘
            └──────────────┘           └──────┬───────┘
                                              ▼
                                       ┌──────────────┐
                                       │ Cron worker  │
                                       │ (BullMQ /    │
                                       │  node-cron)  │
                                       │ expiry scans │
                                       └──────────────┘
```

## 3. Components
| Layer | Choice | Responsibility |
|---|---|---|
| Frontend | Keep HTML/CSS/JS now → Next.js later (optional) | Marketing pages, signup wizard, pay modal, validity, BMI, admin console |
| API | Node.js + Express (TypeScript) | Members, plans, subscriptions, payments, reminders, BMI records |
| DB | PostgreSQL + Prisma | Single source of truth (see §4) |
| Payments | Razorpay (UPI/cards) + keep UPI-intent fallback | Create order → verify webhook signature → activate subscription |
| WhatsApp | MVP: wa.me prefill links → Phase 2: Cloud API | Expiry templates (3-day + day-0), opt-in records |
| Auth | Phone OTP (MSG91/Twilio) | Members log in with mobile; trainers/admin with role flag |
| Jobs | BullMQ (Redis) or node-cron | Daily expiry scan, reminder queue, retries |
| Files | Local disk → S3-compatible later | logo.jpg, payment screenshots, QR |
| Hosting | VPS (Hetzner/Hostinger) or Render/Railway | API + DB + cron on one box to start; static frontend on CDN |

## 4. Data Model (core tables)
- `members(id, member_code TFXXXXXX, name, phone UNIQUE, age, gender, address, goal, created_at)`
- `plans(id, name, price_paise, validity_days, renewal_price_paise NULL, trainer_free_days=7, active)`
  - Seed: 1M ₹1500/30d · 3M ₹2900/90d · 6M ₹6000/180d renew ₹5500 · 1Y ₹8500/365d renew ₹8000
- `subscriptions(id, member_id, plan_id, start_date, expiry_date, status, trainer_addon BOOL)`
- `payments(id, subscription_id, amount_paise, mode [upi|gateway|cash], gateway_order_id, status [pending|verified|failed], screenshot_url)`
- `reminders(id, subscription_id, channel whatsapp, scheduled_for, sent_at, status)`
- `bmi_records(id, member_id, height_cm, weight_kg, bmi, category, created_at)`

## 5. Key Flows
- **Signup→Pay→Activate:** validate info → create member+subscription(pending) → Razorpay order
  (or UPI intent) → webhook/“I paid” → desk verifies (MVP) → status active.
- **Expiry job (daily 8 AM IST):** subscriptions expiring in 3 days or today → enqueue WhatsApp
  template → mark sent; failures retried 3×.
- **BMI:** require active subscription (server checks expiry) → store record → return category + plan.
- **Cash at gym:** subscription pending → trainer verifies cash + screenshot → admin marks verified.

## 6. Security & Compliance
- Webhook signature verification; never trust client “I Have Paid” alone for auto-activation.
- OTP rate limits; PII (phone/address) encrypted at rest; role-based admin routes.
- UPI ID / gym number configurable via env, not hardcoded.

## 7. Migration Path (no big bang)
1. Keep static site; add API + DB behind it (signup/pay/validity call API, fallback to local math offline).
2. Move plan prices into DB-driven config endpoint.
3. Add OTP login → gate BMI server-side.
4. Swap manual verification → Razorpay webhooks; wa.me → Cloud API templates.
