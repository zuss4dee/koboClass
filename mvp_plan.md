# **🧠 MVP Plan – KoboClass**

---

Here is the updated **KoboClass MVP Plan** with **Stripe** replacing **Paystack** for all payment-related flows. Everything else remains unchanged, ensuring consistency with your current UI, backend, and monetization logic.

---

---

**KoboClass** is a mobile-first, peer-to-peer platform where Nigerian youth can host and attend live, low-cost masterclasses. It enables anyone to monetize their skills in real-time by teaching 90-minute interactive classes, while learners can gain practical, high-impact knowledge at accessible price points (₦1,000–₦5,000).

---

## **✅**

## **Finalized MVP Features (Phase 1)**

### **🧾**

### **Class Creation (Host)**

- Create class with:
    - Title, description, date/time, price (₦1k–₦5k)
    - Auto-generated Whereby video room link (after admin approval)
- Upload thumbnail (optional)

---

### **🔍**

### **Class Discovery & Purchase (Learner)**

- Browse discovery feed
- Filter/search by keyword or category
- Class detail page with host bio, reviews, and CTA
- **Stripe integration** for seamless checkout (hosted or embedded)

---

### **🎥**

### **Live Session**

- Learner and Host join via embedded Whereby link
- Access granted only after ticket purchase
- Email reminders with join link (24h & 1h before class)

---

### **📊**

### **Dashboards**

- **Host Dashboard:** Manage classes, earnings, reviews
- **Learner Dashboard:** View purchased classes, receipts, join links

---

### **⭐**

### **Ratings & Reviews**

- Post-class review prompt for Learners
- Ratings displayed on class detail and host profile

---

### **🔐**

### **User Auth & Admin Tools**

- Email/password or Google login (via NextAuth.js)
- Admin can:
    - View users, classes, transactions
    - Track disputes, manage reviews
    - Approve host applications and class listings

---

### **💸**

### **Payments & Commission**

- Ticket sold: KoboClass takes **20% commission**
- 80% payout to Host via **Stripe Connect** (automated weekly payouts)
- Multi-currency support enabled via Stripe
- Webhooks used for post-payment actions (e.g. receipt email, ticket assignment)

---

## **👣**

## **Detailed User Journey**

### **🧑🏽‍🏫**

### **Host (Teni)**

1. Signs up or logs in
2. Fills out profile (bio + social links)
3. Applies to become a Host → gets approved
4. Creates class → sets price/date → Whereby link added on approval
5. Promotes class externally (social media)
6. Views class stats and signups on dashboard
7. Hosts class using embedded Whereby
8. Receives reviews + gets paid

---

### **🎓**

### **Learner (Samuel)**

1. Signs up or logs in
2. Browses discovery feed → clicks on class
3. Reviews details → pays via **Stripe Checkout**
4. Receives confirmation + dashboard entry + email reminder
5. Joins class at scheduled time
6. Leaves review after class

---

## **⚠️**

## **Edge Case Notes**

- ❗ Learner buys ticket 5 mins before class → still receives join link, but may miss reminder email
- ❗ Host no-shows → Admin flags account, refund may be issued
- ❗ Learner joins with poor internet → fallback message, retry logic via Whereby
- ❗ Duplicate accounts (same person as Host & Learner) → allowed; roles managed on dashboard
- ❗ Payment fails → error message shown; retry enabled with Stripe fallback
- ❗ Class gets oversubscribed → No limit in MVP, unlimited attendance assumed

---

## **🛠️**

## **Tech Stack + Monetization Plan**

### **Tech Stack**

- **Frontend:** Next.js 14 + Tailwind CSS
- **Backend:** Next.js API Routes + Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Auth:** NextAuth.js (Email + Google)
- **Payments:** **Stripe (Checkout + Connect)**
- **Video:** Whereby Embedded API
- **Email:** Resend
- **Deployment:** Vercel

---

### **Monetization Plan**

- **Core Model:** 20% commission on every ticket sold
- **Host Earnings:** 80% via **Stripe Connect payouts**
- **No subscriptions or upfront costs**
- **Revenue Example:** ₦3,000 ticket → ₦600 revenue for KoboClass
- **Path to ₦1.5 Billion/year:** ~274 classes/day nationally

---