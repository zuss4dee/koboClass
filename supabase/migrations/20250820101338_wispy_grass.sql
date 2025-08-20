/*
  # Create Refund Requests Table

  1. New Tables
    - `refund_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `ticket_id` (uuid, foreign key to tickets)
      - `reason` (text, required, 10-500 chars)
      - `status` (refund_status, default 'pending')
      - `admin_notes` (text, optional)
      - `processed_by` (uuid, foreign key to users)
      - `processed_at` (timestamptz, optional)
      - `created_at` (timestamptz, auto)

  2. Security
    - Enable RLS on `refund_requests` table
    - Users can create refund requests for their own tickets
    - Users can read their own refund requests

  3. Validation
    - Reason length validation (10-500 characters)
    - Processing fields consistency

  4. Constraints
    - One refund request per ticket
    - Must own the ticket to request refund

  5. Indexes
    - User ID, ticket ID, status, created_at indexes
*/

CREATE TABLE IF NOT EXISTS refund_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status refund_status DEFAULT 'pending',
  admin_notes text,
  processed_by uuid REFERENCES users(id),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  
  -- Validation constraints
  CONSTRAINT valid_reason_length CHECK (length(trim(reason)) >= 10 AND length(reason) <= 500),
  CONSTRAINT processed_fields_consistency CHECK (
    (status = 'pending' AND processed_by IS NULL AND processed_at IS NULL) OR
    (status != 'pending' AND processed_by IS NOT NULL AND processed_at IS NOT NULL)
  ),
  
  -- Business constraints
  CONSTRAINT one_refund_request_per_ticket UNIQUE (ticket_id)
);

-- Enable RLS
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can create refund requests for own tickets"
  ON refund_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE id = refund_requests.ticket_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own refund requests"
  ON refund_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_refund_requests_user_id ON refund_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_ticket_id ON refund_requests(ticket_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests(status);
CREATE INDEX IF NOT EXISTS idx_refund_requests_created_at ON refund_requests(created_at);