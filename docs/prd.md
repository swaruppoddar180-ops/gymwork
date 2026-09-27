# TRIDENT FITNESS — Product Requirements Document (PRD)

## 1. Overview
TRIDENT FITNESS is a gym in Pursura, Hooghly (WB) — opened 1 Sep 2025, 250+ members, 8–10 trainers.
This PRD covers evolving the current static marketing site into a **full gym-management platform**:
marketing site + member signup + online payments + membership validity + WhatsApp reminders +
members-only BMI/action plans + admin console.

- Location: Pursura Amarpur Road, Pursura, Hooghly, 712401, West Bengal, India
- Hours: Mon–Sat 6 AM–12 PM & 4 PM–11 PM. **Sunday CLOSED.**
- Contact: +91 62945 93283 (call + WhatsApp), Instagram / Facebook / YouTube
- Sponsor: MuscleBlaze (whey protein + creatine, links to muscleblaze.com)

## 2. Users & Roles
| Role | Who | Needs |
|---|---|---|
| Visitor | Prospective member | Plans, timings, trainers, location, rules, signup |
| Member | Paying customer | Pay online, see validity, BMI + action plan, WhatsApp expiry alerts |
| Trainer | 8–10 staff (3 head coaches) | Member list, assign workouts/diets, verify payments at desk |
| Admin/Owner | Swarnendu Pal (Founder) | Revenue, renewals due, member records, content edits |

## 3. Functional Requirements

### 3.1 Marketing site (exists — keep)
Hero, programs (Strength, HIIT, Boxing, CrossFit, Yoga, Personal+Nutrition),
trainers, schedule (Mon–Sat batches), supplements, rules, FAQ, contact, Google Maps link + embed,
light/dark mode, mobile responsive.

### 3.2 Membership plans (source of truth)
| Plan | Price | Validity | Renewal |
|---|---|---|---|
| 1 Month | ₹1500 | 30 days | — |
| 3 Months | ₹2900 | 90 days | — |
| 6 Months | ₹6000 | 180 days | ₹5500 |
| 1 Year | ₹8500 | 365 days | ₹8000 |
- Personal Trainer add-on: ₹1000. **7 days trainer FREE only with a paid membership** (no free gym trial).
- Prices editable by admin without code changes.

### 3.3 Signup (personal information)
Collect: full name, 10-digit mobile (Indian validation), age (12–100), gender,
address, goal, joining date, plan, trainer opt-in.
Validate all fields client + server side before payment step.

### 3.4 Payments (all UPI apps)
- Pay via any UPI app (GPay / PhonePe / Paytm / BHIM) using a UPI intent link
  (`upi://pay?pa=6294593283@upi&pn=TRIDENT FITNESS&am=<total>&cu=INR`).
- UPI ID displayed with copy button; works on mobile (app opens) with manual fallback on desktop.
- "Pay Cash at Gym" option → status = pending, activated at front desk.
- MVP: payment status recorded on "I Have Paid" + desk verification.
  Phase 2: gateway (Razorpay) with webhook verification + receipts.
- On success: Member ID generated (e.g. `TFXXXXXX`), validity start→expiry shown.

### 3.5 Validity
- Member view: plan + joining date → expiry date, days left, expired/today states.
- Strict day counts (30/90/180/365). No grace days without renewal.

### 3.6 WhatsApp expiry reminders
- Member opts in with WhatsApp number in validity section.
- MVP: opens `wa.me/916294593283` chat with prefilled plan/expiry details (gym follows up manually).
- Phase 2: automated WhatsApp Cloud API template messages 3 days before expiry + on expiry day
  (requires member opt-in record + cron job).

### 3.7 Members-only BMI + action plans
- Locked until membership verified (phone + plan + joining date, not expired).
- On calculate: BMI value + category + full chart (Underweight <18.5 / Fit 18.5–24.9 /
  Overweight 25–29.9 / Obese 30+) with highlighted row + personalized plan
  (workouts per gym schedule, diet, MuscleBlaze guidance, trainer advice).

### 3.8 Admin console (Phase 2)
Member search, renewals-due list, payment verification queue, plan price editor,
schedule editor, broadcast WhatsApp reminders.

## 4. Non-Functional Requirements
- Mobile-first (most members on phones; UPI pay happens on mobile).
- Page load < 3s on 4G; works without JS for core info.
- Light + dark mode, persisted choice.
- Hindi/Bengali labels for key CTAs (Phase 2).
- Data: Indian phone validation, IST dates, ₹ formatting (en-IN).

## 5. Out of Scope (v1)
No attendance biometrics, no trainer mobile app, no auto-debit mandates,
no supplement e-commerce checkout (external MuscleBlaze links only).

## 6. Success Metrics
- Online signup conversion (visitors → paid members).
- Renewal rate (esp. 6M/1Y renewals at ₹5500/₹8000).
- Expired-before-renewal gap (target: WhatsApp reminders shrink it).
- Front-desk time per admission (target: < 5 min with prefilled data).
