# TRIDENT FITNESS — Workflows

## 1. Member Journeys
### A. New signup → payment → activation
1. Visitor views plans → clicks Choose → signup modal (info validated).
2. Chooses UPI (any app) or Cash at Gym → pays / taps “I Have Paid”.
3. Sees Member ID + validity dates → shows it (+ payment screenshot) at desk Mon–Sat.
4. Trainer verifies → subscription active → 7 trainer-days FREE included.

### B. Renewal (6M → ₹5500, 1Y → ₹8000)
1. Validity page shows days left; WhatsApp reminder arrives ~3 days before expiry.
2. Member taps renew → pays (UPI/cash) → new subscription chained from old expiry (if renewed early) or today.

### C. Members-only BMI
Verify (phone + plan + joining date, active only) → enter height/weight →
BMI + highlighted chart + category action plan → recheck every 15–30 days.

### D. Expiry reminder (operations)
Daily 8 AM IST cron: expiring in ≤3 days → WhatsApp template queued → sent → logged.
MVP fallback: member’s wa.me opt-in creates a manual follow-up task for the desk.

## 2. Front-Desk Workflows
- **Admission (< 5 min):** find pending signup by phone → verify payment/screenshot →
  mark verified → confirm start date → hand diet-chart + batch slot.
- **Cash payment:** create/record cash payment → activate → receipt on WhatsApp.
- **Lapsed member:** renewals-due list → send wa.me nudge → record renewal.

## 3. Owner Workflows (weekly)
- Review revenue by plan, pending verifications, expiring-this-week count.
- Update schedule/prices (DB config in P1; code edit today + redeploy).
- Check MuscleBlaze stock + supplement queries from site.

## 4. Build & Release Workflow (repo: gymwork, branch: main)
```
code → git commit → git push origin main → deploy (static: copy files / VPS: pull + pm2 restart)
→ smoke test: home, plans, signup modal, validity math, wa.me link, BMI gate
```
- PRs for anything touching prices, payment text, or validation regex.
- Back up member exports (CSV) weekly until admin console lands.

## 5. Support / Escalation
- Payment done but not active → desk verifies screenshot → manual activate.
- Wrong plan/date → admin edits subscription (audit-logged).
- WhatsApp not received → check opt-in number, resend wa.me link, verify block settings.
