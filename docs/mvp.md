# TRIDENT FITNESS — MVP Definition

## 1. MVP Goal
Take paid memberships online and stop revenue leakage from lapsed renewals —
without changing gym operations on day one.

## 2. P0 — Must Have (MVP)
1. **Plans from config** — 1M ₹1500/30d · 3M ₹2900/90d · 6M ₹6000/180d (renew ₹5500) ·
   1Y ₹8500/365d (renew ₹8000) · trainer +₹1000 · 7 trainer-days FREE only with paid plan.
2. **Signup wizard** — name, 10-digit mobile, age, gender, address, goal, joining date,
   plan, trainer checkbox; full validation; data saved to DB.
3. **Pay with any UPI app** — UPI intent link + UPI ID copy + Cash-at-Gym option;
   "I Have Paid" creates pending payment; **front-desk verifies** before activation.
4. **Activation output** — Member ID (TFXXXXXX), plan, amount, start→expiry dates.
5. **Validity checker** — any member enters plan + joining date → expiry + days left.
6. **WhatsApp reminder opt-in (MVP)** — phone + plan + date → prefilled wa.me chat
   to gym number; reminder date = expiry − 3 days; gym follows up manually.
7. **Members-only BMI** — phone + plan + date verified (not expired) → BMI + full chart
   + category action plan (workout/diet/MuscleBlaze/trainer).
8. **Admin list (minimal)** — searchable member table, pending-payments queue,
   renewals-due (next 7 days). Can be a simple protected page.
9. **Hygiene carried over** — hours (Mon–Sat 6–12 & 4–11, Sun closed), Pursura address +
   Google Maps link/embed, trainers (8–10, 3 head coaches), rules, light/dark mode,
   no-free-trial wording.

## 3. P1 — Next (post-MVP)
- Razorpay gateway + webhook auto-activation + receipts.
- WhatsApp Cloud API auto-templates (3-day + day-0) via cron.
- OTP member login; server-side BMI gating.
- Attendance (QR at desk), diet-chart PDFs, trainer assignment.
- Plan price/schedule editor for owner (no code deploys).

## 4. Acceptance Criteria
- [ ] New member completes signup→pay→Member ID in < 5 min on mobile.
- [ ] Cash path: pending → desk verify → active; member sees correct expiry.
- [ ] Expired member is blocked from BMI with a renew link.
- [ ] Reminder opt-in produces a wa.me message with correct plan/expiry dates.
- [ ] All prices/validities match §2 table; renewal prices shown on 6M/1Y.
- [ ] Site still fully usable on desktop + mobile, light + dark.

## 5. Phased Timeline (indicative)
- Week 1–2: DB + API (members, plans, subscriptions, payments-pending) + signup wired to API.
- Week 3: Admin list + desk verify flow + validity from server.
- Week 4: WhatsApp opt-in logging + renewals-due view; pilot with 20 members.
- Month 2: Razorpay + Cloud API + OTP (P1).

## 6. Risks
- UPI-intent desktop fallback → keep UPI-ID-copy + cash path prominent.
- Fake "I Have Paid" → never auto-activate in MVP; desk verification mandatory.
- Members sharing phones → OTP login in P1; MVP gates BMI by phone+date only.
