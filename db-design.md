# **📦 KoboClass MVP — Database Design**

---

---

---

## **1. Users Table**

Holds all registered users — both learners and potential hosts.

**Fields:**

- id (UUID, PK)
- email (String, unique)
- full_name (String)
- avatar_url (String, optional)
- is_host (Boolean, default: false)
- is_approved_host (Boolean, default: false)
- stripe_account_id (String, optional) — for Stripe Connect
- created_at (Timestamp)

**Purpose & Relationships:**

- Primary actor on the platform.
- Can book classes or become hosts.
- One-to-many with classes (as creator).
- One-to-many with tickets (as buyer).
- One-to-many with transactions and earnings.

---

## **2. Classes Table**

Represents each individual masterclass posted by a host.

**Fields:**

- id (UUID, PK)
- title (String)
- description (Text)
- host_id (FK → users.id)
- category_id (FK → categories.id)
- price (Integer, in kobo for Stripe compatibility)
- currency (String, e.g., NGN, USD — for multi-currency support)
- date_time (Timestamp)
- whereby_link (String, optional)
- status (Enum: draft | pending_approval | approved | rejected)
- cover_image_url (String)
- created_at (Timestamp)

**Purpose & Relationships:**

- Created by hosts, discovered by learners.
- Must be approved before becoming visible.
- One-to-many with tickets, reviews.
- Connects to categories for filtering.

---

## **3. Tickets Table**

Represents a learner's enrollment in a class. One ticket = one seat.

**Fields:**

- id (UUID, PK)
- user_id (FK → users.id)
- class_id (FK → classes.id)
- transaction_id (FK → transactions.id)
- receipt_url (String) — from Stripe
- status (Enum: paid | refunded)
- created_at (Timestamp)

**Purpose & Relationships:**

- Purchased via Stripe Checkout.
- Used to unlock access to Whereby link.
- One-to-one with transactions.

---

## **4. Transactions Table**

Records every payment processed via Stripe.

**Fields:**

- id (UUID, PK)
- user_id (FK → users.id)
- class_id (FK → classes.id)
- amount (Integer, in kobo)
- currency (String)
- stripe_session_id (String)
- stripe_payment_intent_id (String)
- payment_status (Enum: succeeded | failed | refunded)
- payment_method_type (String)
- created_at (Timestamp)

**Purpose & Relationships:**

- Linked directly to Stripe events.
- Triggers ticket and earning creation.
- One-to-one with ticket.

---

## **5. Earnings Table**

Tracks the host's earnings for each ticket purchase.

**Fields:**

- id (UUID, PK)
- host_id (FK → users.id)
- class_id (FK → classes.id)
- ticket_id (FK → tickets.id)
- amount (Integer) — KoboClass takes 20% before saving here
- currency (String)
- status (Enum: pending | paid | refunded)
- payout_date (Date, optional)
- created_at (Timestamp)

**Purpose & Relationships:**

- Allows weekly payout aggregation per host.
- Supports Stripe Connect transfers.
- Linked to ticket and class for traceability.

---

## **6. Categories Table**

Used to tag and filter classes (e.g., Design, Tech, Business, etc.).

**Fields:**

- id (UUID, PK)
- name (String)
- slug (String, unique)

**Purpose & Relationships:**

- One-to-many with classes.

---

## **7. Reviews Table**

Learners can leave reviews after attending a class.

**Fields:**

- id (UUID, PK)
- user_id (FK → users.id)
- class_id (FK → classes.id)
- rating (Integer 1–5)
- comment (Text)
- created_at (Timestamp)

**Purpose & Relationships:**

- Optional for MVP, but lays the groundwork for future social proof.
- One-to-one with class per user.

---

## **8. Refund Requests Table**

If a user is unsatisfied, they can request a refund.

**Fields:**

- id (UUID, PK)
- user_id (FK → users.id)
- ticket_id (FK → tickets.id)
- reason (Text)
- status (Enum: pending | approved | declined | refunded)
- created_at (Timestamp)

**Purpose & Relationships:**

- Admin-triggered Stripe refund after approval.
- One-to-one with ticket.

---

## **9. Host Applications Table**

Tracks users requesting host status.

**Fields:**

- id (UUID, PK)
- user_id (FK → users.id)
- bio (Text)
- social_links (JSON)
- status (Enum: pending | approved | rejected)
- created_at (Timestamp)

**Purpose & Relationships:**

- Ensures quality control by approving hosts before they go live.

---

## **10. Whereby Links Table**

Optional but allows tracking generated Whereby links.

**Fields:**

- id (UUID, PK)
- class_id (FK → classes.id)
- whereby_url (String)
- status (Enum: active | expired)
- created_at (Timestamp)

**Purpose & Relationships:**

- Generated after class approval.
- Can be useful for audit trails or deletion logic.

---

## **11. Notifications Table (Optional MVP Feature)**

Tracks system events for user dashboard alerts.

**Fields:**

- id (UUID, PK)
- user_id (FK → users.id)
- message (String)
- type (Enum: class_approved | ticket_confirmed | payout_sent | refund_processed)
- read (Boolean)
- created_at (Timestamp)

---

# **🔄 Key Table Relationships Summary**

- **User → Classes** (1-to-many): A host can create many classes.
- **User → Tickets** (1-to-many): A learner can buy many tickets.
- **Class → Tickets** (1-to-many): Each class can have many learners.
- **Ticket → Transaction** (1-to-1): Every ticket is tied to a Stripe payment.
- **Ticket → Earnings** (1-to-1): Each ticket contributes to host earnings.
- **Class → Category** (many-to-1): Classes are categorized for search.
- **Class → Whereby Link** (1-to-1): A generated video link for each class.
- **User → Reviews** (1-to-many): Learners review classes.
- **User → Refund Requests** (1-to-many): One per ticket if eligible.
- **User → Earnings** (1-to-many): All revenue a host has earned.
- **User → Host Applications** (1-to-1): Request to become a host.

---

# **🧾 Stripe-Specific Notes**

1. **Prices stored in kobo (₦) or minor unit** for Stripe compatibility.
2. **Stripe Checkout** for ticket purchases → returns session ID, payment intent.
3. **Stripe Connect Express** to onboard hosts and manage payouts.
4. **Transactions table** stores all webhooks related to payments.
5. **Earnings table** supports future logic for **weekly payouts** and tracking.
6. **Multi-currency Support**: Add currency to classes, transactions, earnings.