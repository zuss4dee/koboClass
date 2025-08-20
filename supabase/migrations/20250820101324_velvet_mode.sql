/*
  # Create Earnings Table

  1. New Tables
    - `earnings`
      - `id` (uuid, primary key)
      - `host_id` (uuid, foreign key to users)
      - `class_id` (uuid, foreign key to classes)
      - `ticket_id` (uuid, foreign key to tickets)
      - `amount` (integer, required, positive)
      - `currency` (text, default 'NGN')
      - `status` (earning_status, default 'pending')
      - `payout_date` (date, optional)
      - `stripe_transfer_id` (text, optional)
      - `created_at` (timestamptz, auto)

  2. Security
    - Enable RLS on `earnings` table
    - Hosts can read their own earnings

  3. Validation
    - Amount must be positive
    - Currency validation (NGN, USD)
    - Payout fields consistency

  4. Constraints
    - One earning per ticket
    - Payout consistency validation

  5. Indexes
    - Host ID, class ID, ticket ID, status indexes
    - Payout date index for reporting
*/

CREATE TABLE IF NOT EXISTS earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  currency text DEFAULT 'NGN',
  status earning_status DEFAULT 'pending',
  payout_date date,
  stripe_transfer_id text,
  created_at timestamptz DEFAULT now(),
  
  -- Validation constraints
  CONSTRAINT valid_amount CHECK (amount > 0),
  CONSTRAINT valid_currency CHECK (currency = ANY(ARRAY['NGN', 'USD'])),
  CONSTRAINT payout_fields_consistency CHECK (
    (status != 'paid' AND payout_date IS NULL AND stripe_transfer_id IS NULL) OR
    (status = 'paid' AND payout_date IS NOT NULL)
  ),
  
  -- Business constraints
  CONSTRAINT one_earning_per_ticket UNIQUE (ticket_id)
);

-- Enable RLS
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Hosts can read own earnings"
  ON earnings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_earnings_host_id ON earnings(host_id);
CREATE INDEX IF NOT EXISTS idx_earnings_class_id ON earnings(class_id);
CREATE INDEX IF NOT EXISTS idx_earnings_ticket_id ON earnings(ticket_id);
CREATE INDEX IF NOT EXISTS idx_earnings_status ON earnings(status);
CREATE INDEX IF NOT EXISTS idx_earnings_payout_date ON earnings(payout_date);
CREATE INDEX IF NOT EXISTS idx_earnings_created_at ON earnings(created_at);