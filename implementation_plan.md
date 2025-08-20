# **✅**

# **KoboClass MVP Backend Implementation Plan**

---

## **🔧 PHASE 1: INITIAL BACKEND SETUP**

### **1. ☐**

### **Set Up Supabase Project**

- Create a new Supabase project.
- Configure project settings: database region, project name, and API key access.
- Enable email/password auth and optionally social OAuth (Google).
- Set up JWT secret key (for session validation with NextAuth).

### **2. ☐**

### **Connect Your Frontend to Supabase**

- Install @supabase/supabase-js in your Next.js frontend project.
- Initialize Supabase client with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.

### **3. ☐**

### **Configure Environment Variables**

In your .env.local:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONNECT_CLIENT_ID=
NEXTAUTH_SECRET=
RESEND_API_KEY=
WHEREBY_API_KEY=
```

---

## **🔐 PHASE 2: AUTHENTICATION & USER SYSTEM**

### **4. ☐**

### **Implement NextAuth + Supabase**

- Use NextAuth.js with the Supabase adapter or JWT.
- Configure providers (email/password at minimum).
- Sync user table in Supabase with users table (or use auth.user()).
- On sign up:
    - Auto-create profile in profiles table (includes name, avatar, role = learner by default).

### **5. ☐**

### **Set Up Middleware for Role Access**

- Protect routes based on role (admin, host, learner).
- Only allow approved hosts to access /host/* routes.

---

## **🗃️ PHASE 3: DATABASE SCHEMA CREATION**

### **6. ☐**

### **Create All Tables in Supabase**

Use SQL or Prisma (optional). Create the following tables:

- users: Extended user profile
- classes: Class listing (by hosts)
- categories: Predefined class topics
- host_applications: Application process for becoming a host
- tickets: Class ticket purchases by learners
- transactions: Stripe transactions for tracking all payments
- earnings: Track how much each host earned (automatically from transactions)
- reviews: Learner reviews of classes
- refund_requests: Ticket refund process
- whereby_links: Class link mapping
- stripe_accounts: For storing stripe_account_id for each host

> ✅ Add foreign keys, indexing, and constraints.
> 

> ✅ Seed categories with tags like "Design", "Business", "Career", "Tech".
> 

---

## **🧑‍🏫 PHASE 4: HOST APPLICATION FLOW**

### **7. ☐**

### **Build Host Application API**

- API to submit a new host application with bio, portfolio links, and reason to teach.
- Status: pending, approved, or rejected.

### **8. ☐**

### **Admin Approval API**

- Admin route to approve/reject applications.
- On approval:
    - Update user's role = host, is_approved = true.
    - Trigger host onboarding email using Resend.

---

## **🎓 PHASE 5: CLASS CREATION + APPROVAL FLOW**

### **9. ☐**

### **Build Class Creation Endpoint**

- Hosts submit class form: title, description, price, date/time, category, banner image.
- Class status: pending.

### **10. ☐**

### **Admin Class Approval Flow**

- Admin endpoint to approve/reject class.
- On approval:
    - Generate whereby_link using Whereby API.
    - Store in whereby_links table.
    - Update class status to approved.
    - Notify host via email.

---

## **💳 PHASE 6: STRIPE PAYMENTS INTEGRATION**

### **11. ☐**

### **Stripe Connect (Host Onboarding)**

- Host clicks "Enable Payments" → redirected to Stripe Connect onboarding.
- On success:
    - Save stripe_account_id in stripe_accounts table.

### **12. ☐**

### **Create Stripe Checkout Session (Buy Ticket)**

- Create server-side checkout session with:
    - Class title, price, learner email, metadata (class_id, user_id).
    - Mode: payment
    - Success/Cancel URLs.
- Redirect user to Stripe-hosted page.

### **13. ☐**

### **Handle Stripe Webhooks**

- Set up webhook handler for:
    - checkout.session.completed
        - Create transaction record.
        - Create ticket for learner.
        - Create earning for host (80% of price).
        - Send ticket email with receipt + class link.
    - charge.refunded
        - Update ticket and transaction status to refunded.

---

## **🎟️ PHASE 7: TICKET SYSTEM**

### **14. ☐**

### **Ticket Access Control**

- Show "Buy Ticket" button if:
    - User is logged in.
    - Has not bought this class before.
- After payment:
    - "Join Class" button becomes active (pulls from whereby_links table).

### **15. ☐**

### **User Ticket History Page**

- Learner dashboard shows all classes they've purchased with:
    - Status, date, downloadable receipt, join button (if upcoming).

---

## **💸 PHASE 8: EARNINGS & PAYOUTS**

### **16. ☐**

### **Track Host Earnings**

- On successful payment:
    - Calculate 80% earning → store in earnings table.
    - Status = pending_payout.

### **17. ☐**

### **Automated Weekly Payouts**

- Every Friday:
    - Query pending_payout for all hosts.
    - Transfer to their Stripe accounts.
    - Update status = paid, add payout_date.

(Use CRON + Supabase Functions or a background task via Vercel Edge.)

---

## **📤 PHASE 9: REFUND FLOW (Optional but MVP-Aligned)**

### **18. ☐**

### **Submit Refund Request**

- Learner fills reason + ticket ID.
- Create refund_request record → status: pending.

### **19. ☐**

### **Admin Refund API**

- Admin approves request:
    - Call Stripe to refund.
    - Update transaction + ticket + refund_request statuses.
    - Notify learner via Resend.

---

## **⭐ PHASE 10: CLASS REVIEWS**

### **20. ☐**

### **Leave Review API**

- After class end date, allow learner to submit:
    - Rating (1–5 stars), Comment.

### **21. ☐**

### **Display Reviews on Class Pages**

- Endpoint to fetch all reviews for a class.
- Average rating + review count visible.

---

## **📧 PHASE 11: TRANSACTIONAL EMAILS (RESEND)**

### **22. ☐**

### **Email Templates**

- Use Resend SDK to send emails on:
    - Host approval
    - Class approval
    - Ticket purchase confirmation
    - Class reminder (24hrs before)
    - Payout success
    - Refund processed

---

## **🧠 PHASE 12: SMART SEARCH PREP (haystack-ready)**

### **23. ☐**

### **Embed Class Metadata for AI Search**

- Store classes.title + description + tags as a JSON object.
- Export for future use in vector DB.
- Plan for haystack integration post-MVP.

---

## **🛠️ PHASE 13: ADMIN API BACKEND (NO UI YET)**

### **24. ☐**

### **Admin Endpoints**

- Approve/reject hosts
- Approve/reject classes
- Approve/reject refunds
- View all users, classes, payouts
- Access stats (total users, ticket sales, revenue)

Protect with admin-only auth middleware.

---

## **✅ FINAL PHASE: TESTING & DEPLOYMENT**

### **25. ☐**

### **Test All Flows**

- User signup, profile update
- Host application
- Class creation → approval
- Buy ticket → Stripe flow
- Ticket access → join link
- Refund + admin decision
- Earnings → payout
- Admin endpoints
- Emails sent properly
- Mobile view for every screen

---

Let me know if you want:

- All API endpoint specifications (with method, route, payload)
- Prisma models for every table
- Supabase SQL dump
- Stripe webhook handler code

You're ready to implement and ship MVP once this checklist is complete ✅