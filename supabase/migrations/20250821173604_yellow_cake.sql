/*
  # Create tickets and transactions tables for checkout functionality

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `class_id` (uuid, foreign key to classes)
      - `amount` (integer, in kobo)
      - `currency` (text, default 'NGN')
      - `stripe_session_id` (text, unique)
      - `stripe_payment_intent_id` (text, unique)
      - `payment_status` (enum: pending, succeeded, failed, refunded)
      - `payment_method_type` (text)
      - `receipt_url` (text)
      - `created_at` (timestamp)
    
    - `tickets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `class_id` (uuid, foreign key to classes)
      - `transaction_id` (uuid, foreign key to transactions)
      - `receipt_url` (text)
      - `status` (enum: paid, refunded)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to read their own data
    - Add policies for hosts to read tickets for their classes

  3. Constraints
    - Unique constraint on user_id + class_id for tickets (one ticket per user per class)
    - Unique constraints on Stripe IDs
    - Check constraints for valid amounts and currencies
*/

-- Create payment_status enum
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ticket_status enum
DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('paid', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'NGN' CHECK (currency IN ('NGN', 'USD')),
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text UNIQUE,
  payment_status payment_status DEFAULT 'pending',
  payment_method_type text,
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  receipt_url text,
  status ticket_status DEFAULT 'paid',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, class_id) -- One ticket per user per class
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
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
      WHERE classes.id = transactions.class_id 
      AND classes.host_id = auth.uid()
    )
  );

-- Create policies for tickets
CREATE POLICY "Users can read own tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Hosts can read tickets for their classes"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = tickets.class_id 
      AND classes.host_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_class_id ON transactions(class_id);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_session_id ON transactions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_status ON transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_class_id ON tickets(class_id);
CREATE INDEX IF NOT EXISTS idx_tickets_transaction_id ON tickets(transaction_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);