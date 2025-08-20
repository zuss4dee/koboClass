@@ .. @@
 /*
   # Create host applications table for host approval workflow
 
   1. New Tables
     - `host_applications`
       - `id` (uuid, primary key)
       - `user_id` (uuid, foreign key to users)
       - `bio` (text, required, 50-1000 chars)
       - `social_links` (jsonb, default empty object)
       - `status` (application_status enum, default 'pending')
       - `admin_notes` (text, optional)
       - `reviewed_by` (uuid, foreign key to users)
       - `reviewed_at` (timestamptz, optional)
       - `created_at` (timestamptz, auto)
   
   2. Security
     - Enable RLS on `host_applications` table
     - Add policies for users to manage their own applications
   
   3. Constraints
     - One application per user
     - Review fields consistency
 */
 
-CREATE TABLE IF NOT EXISTS host_applications (
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'host_applications' AND table_schema = 'public') THEN
+    CREATE TABLE host_applications (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       bio text NOT NULL,
       social_links jsonb DEFAULT '{}'::jsonb,
       status application_status DEFAULT 'pending',
       admin_notes text,
       reviewed_by uuid REFERENCES users(id),
       reviewed_at timestamptz,
       created_at timestamptz DEFAULT now(),
       
       -- Constraints
       CONSTRAINT one_application_per_user UNIQUE(user_id),
       CONSTRAINT valid_bio_length CHECK (length(trim(bio)) >= 50 AND length(bio) <= 1000),
       CONSTRAINT reviewed_fields_consistency CHECK (
         (status = 'pending' AND reviewed_by IS NULL AND reviewed_at IS NULL) OR
         (status != 'pending' AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)
       )
-);
+    );
+  END IF;
+END$$;
 
 -- Enable RLS
-ALTER TABLE host_applications ENABLE ROW LEVEL SECURITY;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_tables 
+    WHERE tablename = 'host_applications' 
+    AND schemaname = 'public' 
+    AND rowsecurity = true
+  ) THEN
+    ALTER TABLE host_applications ENABLE ROW LEVEL SECURITY;
+  END IF;
+END$$;
 
 -- Create indexes
-CREATE INDEX IF NOT EXISTS idx_host_applications_user_id ON host_applications(user_id);
-CREATE INDEX IF NOT EXISTS idx_host_applications_status ON host_applications(status);
-CREATE INDEX IF NOT EXISTS idx_host_applications_created_at ON host_applications(created_at);
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_host_applications_user_id') THEN
+    CREATE INDEX idx_host_applications_user_id ON host_applications(user_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_host_applications_status') THEN
+    CREATE INDEX idx_host_applications_status ON host_applications(status);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_host_applications_created_at') THEN
+    CREATE INDEX idx_host_applications_created_at ON host_applications(created_at);
+  END IF;
+END$$;
 
 -- RLS Policies
-CREATE POLICY "Users can read own applications"
-  ON host_applications
-  FOR SELECT
-  TO authenticated
-  USING (auth.uid() = user_id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'host_applications' 
+    AND policyname = 'Users can read own applications'
+  ) THEN
+    CREATE POLICY "Users can read own applications"
+      ON host_applications
+      FOR SELECT
+      TO authenticated
+      USING (auth.uid() = user_id);
+  END IF;
+END$$;
 
-CREATE POLICY "Users can create own applications"
-  ON host_applications
-  FOR INSERT
-  TO authenticated
-  WITH CHECK (auth.uid() = user_id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'host_applications' 
+    AND policyname = 'Users can create own applications'
+  ) THEN
+    CREATE POLICY "Users can create own applications"
+      ON host_applications
+      FOR INSERT
+      TO authenticated
+      WITH CHECK (auth.uid() = user_id);
+  END IF;
+END$$;
 
-CREATE POLICY "Users can update own pending applications"
-  ON host_applications
-  FOR UPDATE
-  TO authenticated
-  USING (auth.uid() = user_id AND status = 'pending')
-  WITH CHECK (auth.uid() = user_id AND status = 'pending');
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'host_applications' 
+    AND policyname = 'Users can update own pending applications'
+  ) THEN
+    CREATE POLICY "Users can update own pending applications"
+      ON host_applications
+      FOR UPDATE
+      TO authenticated
+      USING (auth.uid() = user_id AND status = 'pending')
+      WITH CHECK (auth.uid() = user_id AND status = 'pending');
+  END IF;
+END$$;