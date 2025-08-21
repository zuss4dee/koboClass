/*
  # Create Notifications Table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text, required, 1-200 chars)
      - `message` (text, required, 1-500 chars)
      - `type` (notification_type, default 'general')
      - `class_id` (uuid, foreign key to classes, optional)
      - `read` (boolean, default false)
      - `action_required` (boolean, default false)
      - `created_at` (timestamptz, auto)

  2. Security
    - Enable RLS on `notifications` table
    - Users can read and update their own notifications

  3. Validation
    - Title and message length validation

  4. Indexes
    - User ID, type, read status, class ID, created_at indexes
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type DEFAULT 'general',
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  read boolean DEFAULT false,
  action_required boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  
  -- Validation constraints
  CONSTRAINT valid_title_length CHECK (length(trim(title)) >= 1 AND length(title) <= 200),
  CONSTRAINT valid_message_length CHECK (length(trim(message)) >= 1 AND length(message) <= 500)
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_class_id ON notifications(class_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);