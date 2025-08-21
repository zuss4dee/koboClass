/*
  # Ensure Whereby Links Table Exists

  1. New Tables
    - `whereby_links` table for storing video conference links
      - `id` (uuid, primary key)
      - `class_id` (uuid, foreign key to classes)
      - `whereby_url` (text, the video conference URL)
      - `room_id` (text, unique room identifier)
      - `status` (enum: active, expired)
      - `created_at` (timestamp)
      - `expires_at` (timestamp, when the link expires)

  2. Security
    - Enable RLS on whereby_links table
    - Add policies for hosts and students to access links

  3. Indexes
    - Add indexes for performance
*/

-- Create whereby_status enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'whereby_status') THEN
    CREATE TYPE whereby_status AS ENUM ('active', 'expired');
  END IF;
END $$;

-- Create whereby_links table if it doesn't exist
CREATE TABLE IF NOT EXISTS whereby_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  whereby_url text NOT NULL,
  room_id text UNIQUE,
  status whereby_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Add constraint to ensure one link per class
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'whereby_links' AND constraint_name = 'one_link_per_class'
  ) THEN
    ALTER TABLE whereby_links ADD CONSTRAINT one_link_per_class UNIQUE (class_id);
  END IF;
END $$;

-- Add constraint to validate whereby URL format
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'whereby_links' AND constraint_name = 'valid_whereby_url'
  ) THEN
    ALTER TABLE whereby_links ADD CONSTRAINT valid_whereby_url 
    CHECK (whereby_url ~* '^https://.*whereby\.com/.*');
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_whereby_links_class_id ON whereby_links(class_id);
CREATE INDEX IF NOT EXISTS idx_whereby_links_room_id ON whereby_links(room_id);
CREATE INDEX IF NOT EXISTS idx_whereby_links_status ON whereby_links(status);
CREATE INDEX IF NOT EXISTS idx_whereby_links_expires_at ON whereby_links(expires_at);

-- Enable RLS
ALTER TABLE whereby_links ENABLE ROW LEVEL SECURITY;

-- Policy: Hosts can read links for their own classes
CREATE POLICY IF NOT EXISTS "Hosts can read links for own classes"
  ON whereby_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = whereby_links.class_id 
      AND classes.host_id = auth.uid()
    )
  );

-- Policy: Students can read links for classes they have tickets for
CREATE POLICY IF NOT EXISTS "Students can read links for purchased classes"
  ON whereby_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE tickets.class_id = whereby_links.class_id 
      AND tickets.user_id = auth.uid()
      AND tickets.status = 'paid'
    )
  );