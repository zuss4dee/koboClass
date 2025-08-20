/*
  # Create Tickets Table

  1. New Tables
    - `tickets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `class_id` (uuid, foreign key to classes)
      - `transaction_id` (uuid, foreign key to transactions)
      - `receipt_url` (text, optional)
      - `status` (ticket_status, default 'paid')
      - `created_at` (timestamptz, auto)

  2. Security
    - Enable RLS on `tickets` table
    - Users can read their own tickets
    - Hosts can read tickets for their classes

  3. Constraints
    - One ticket per user per class
    - Links to transaction for payment tracking

  4. Indexes
    - User ID, class ID, transaction ID, status indexes
    - Unique constraint on user_id + class_id
*/

CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  receipt_url text,
  status ticket_status DEFAULT 'paid',
  created_at timestamptz DEFAULT now(),
  
  -- Business constraints
  CONSTRAINT one_ticket_per_user_per_class UNIQUE (user_id, class_id)
);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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
      WHERE id = tickets.class_id 
      AND host_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_class_id ON tickets(class_id);
CREATE INDEX IF NOT EXISTS idx_tickets_transaction_id ON tickets(transaction_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);