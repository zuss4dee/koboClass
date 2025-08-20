/*
  # Update Classes Schema for Approval Flow

  1. Schema Updates
    - Ensure classes table has all required columns for approval flow
    - Add proper constraints and indexes
    - Update status enum if needed

  2. Security
    - Verify RLS policies are in place
    - Ensure proper access controls

  3. Indexes
    - Add indexes for performance on status and approval fields
*/

-- Ensure the class_status enum has all required values
DO $$
BEGIN
  -- Check if the enum type exists and has the required values
  IF NOT EXISTS (
    SELECT 1 FROM pg_type 
    WHERE typname = 'class_status'
  ) THEN
    CREATE TYPE class_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected');
  ELSE
    -- Add missing enum values if they don't exist
    BEGIN
      ALTER TYPE class_status ADD VALUE IF NOT EXISTS 'pending_approval';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- Ensure classes table has all required columns
DO $$
BEGIN
  -- Add admin_notes column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE classes ADD COLUMN admin_notes text;
  END IF;

  -- Add approved_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE classes ADD COLUMN approved_by uuid REFERENCES users(id);
  END IF;

  -- Add approved_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE classes ADD COLUMN approved_at timestamptz;
  END IF;

  -- Add max_students column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'max_students'
  ) THEN
    ALTER TABLE classes ADD COLUMN max_students integer;
  END IF;
END $$;

-- Add constraint to ensure approval fields are consistent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'classes' AND constraint_name = 'approved_fields_consistency'
  ) THEN
    ALTER TABLE classes ADD CONSTRAINT approved_fields_consistency 
    CHECK (
      (status != 'approved' AND approved_by IS NULL AND approved_at IS NULL) OR
      (status = 'approved' AND approved_by IS NOT NULL AND approved_at IS NOT NULL)
    );
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);
CREATE INDEX IF NOT EXISTS idx_classes_approved_by ON classes(approved_by);
CREATE INDEX IF NOT EXISTS idx_classes_approved_at ON classes(approved_at);

-- Ensure RLS is enabled
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Add policy for admins to manage all classes (this would need to be customized based on your admin role system)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'classes' AND policyname = 'Admins can manage all classes'
  ) THEN
    CREATE POLICY "Admins can manage all classes"
      ON classes
      FOR ALL
      TO authenticated
      USING (
        -- This is a placeholder - you'll need to implement proper admin role checking
        -- For now, we'll allow the policy to be created but it won't be functional
        -- until you implement admin role management
        false
      )
      WITH CHECK (
        false
      );
  END IF;
END $$;

-- Update the existing host policy to allow reading pending classes
DROP POLICY IF EXISTS "Hosts can read own classes" ON classes;
CREATE POLICY "Hosts can read own classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

-- Allow hosts to update their own draft and pending classes
DROP POLICY IF EXISTS "Hosts can update own classes" ON classes;
CREATE POLICY "Hosts can update own classes"
  ON classes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id AND status IN ('draft', 'pending_approval'))
  WITH CHECK (auth.uid() = host_id);