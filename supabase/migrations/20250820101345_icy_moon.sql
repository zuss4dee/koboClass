/*
  # Create Whereby Links Table

  1. New Tables
    - `whereby_links`
      - `id` (uuid, primary key)
      - `class_id` (uuid, foreign key to classes)
      - `whereby_url` (text, required, validated)
      - `room_id` (text, unique, optional)
      - `status` (whereby_status, default 'active')
      - `created_at` (timestamptz, auto)
      - `expires_at` (timestamptz, optional)

  2. Security
    - Enable RLS on `whereby_links` table
    - Hosts can read links for their own classes
    - Students can read links for purchased classes

  3. Validation
    - Whereby URL format validation
    - One link per class

  4. Constraints
    - One link per class
    - Unique room ID

  5. Indexes
    - Class ID, room ID, status, expires_at indexes
*/

CREATE TABLE IF NOT EXISTS whereby_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  whereby_url text NOT NULL,
  room_id text UNIQUE,
  status whereby_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  
  -- Validation constraints
  CONSTRAINT valid_whereby_url CHECK (whereby_url ~* '^https://.*whereby\.com/.*'),
  
  -- Business constraints
  CONSTRAINT one_link_per_class UNIQUE (class_id)
);

-- Enable RLS
ALTER TABLE whereby_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Hosts can read links for own classes"
  ON whereby_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE id = whereby_links.class_id 
      AND host_id = auth.uid()
    )
  );

CREATE POLICY "Students can read links for purchased classes"
  ON whereby_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE class_id = whereby_links.class_id 
      AND user_id = auth.uid() 
      AND status = 'paid'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_whereby_links_class_id ON whereby_links(class_id);
CREATE INDEX IF NOT EXISTS idx_whereby_links_room_id ON whereby_links(room_id);
CREATE INDEX IF NOT EXISTS idx_whereby_links_status ON whereby_links(status);
CREATE INDEX IF NOT EXISTS idx_whereby_links_expires_at ON whereby_links(expires_at);