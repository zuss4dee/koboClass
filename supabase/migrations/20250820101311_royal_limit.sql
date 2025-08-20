/*
  # Create Transactions Table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `class_id` (uuid, foreign key to classes)
      - `amount` (integer, required, positive)
      - `currency` (text, default 'NGN')
      - `stripe_session_id` (text, unique, optional)
      - `stripe_payment_intent_id` (text, unique, optional)
      - `payment_status` (payment_status, default 'pending')
      - `payment_method_type` (text, optional)
      - `receipt_url` (text, optional)
      - `created_at` (timestamptz, auto)

  2. Security
    - Enable RLS on `transactions` table
    - Users can read their own transactions
    - Hosts can read transactions for their classes

  3. Validation
    - Amount must be positive
    - Currency validation (NGN, USD)

  4. Indexes
    - User ID, class ID, payment status indexes
    - Stripe session and payment intent indexes
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  currency text DEFAULT 'NGN',
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text UNIQUE,
  payment_status payment_status DEFAULT 'pending',
  payment_method_type text,
  receipt_url text,
  created_at timestamptz DEFAULT now(),
  
  -- Validation constraints
  CONSTRAINT valid_amount CHECK (amount > 0),
  CONSTRAINT valid_currency CHECK (currency = ANY(ARRAY['NGN', 'USD']))
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Hosts can read transactions for their classes"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE id = transactions.class_id 
      AND host_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_class_id ON transactions(class_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_status ON transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_session_id ON transactions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);