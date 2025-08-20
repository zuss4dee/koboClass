@@ .. @@
 /*
   # Create users table with extended profile information
 
   1. New Tables
     - `users`
       - `id` (uuid, primary key)
       - `email` (text, unique, validated)
       - `full_name` (text, required, min 2 chars)
       - `avatar_url` (text, optional)
       - `phone_number` (text, optional, Nigerian format)
       - `bio` (text, optional, max 1000 chars)
       - `social_links` (jsonb, default empty object)
       - `role` (user_role enum, default 'learner')
       - `is_host` (boolean, default false)
       - `is_approved_host` (boolean, default false)
       - `stripe_account_id` (text, optional)
       - `created_at` (timestamptz, auto)
       - `updated_at` (timestamptz, auto)
   
   2. Security
     - Enable RLS on `users` table
     - Add policies for users to manage their own data
   
   3. Indexes
     - Email, role, host status for fast queries
 */
 
-CREATE TABLE IF NOT EXISTS users (
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
+    CREATE TABLE users (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       email text UNIQUE NOT NULL,
       full_name text NOT NULL,
       avatar_url text,
       phone_number text,
       bio text,
       social_links jsonb DEFAULT '{}'::jsonb,
       role user_role DEFAULT 'learner',
       is_host boolean DEFAULT false,
       is_approved_host boolean DEFAULT false,
       stripe_account_id text,
       created_at timestamptz DEFAULT now(),
       updated_at timestamptz DEFAULT now(),
       
       -- Constraints
       CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
       CONSTRAINT valid_full_name CHECK (length(trim(full_name)) >= 2),
       CONSTRAINT valid_phone CHECK (phone_number IS NULL OR phone_number ~* '^\+?[0-9]{10,15}$'),
       CONSTRAINT valid_bio_length CHECK (bio IS NULL OR length(bio) <= 1000)
-);
+    );
+  END IF;
+END$$;
 
 -- Enable RLS
-ALTER TABLE users ENABLE ROW LEVEL SECURITY;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_tables 
+    WHERE tablename = 'users' 
+    AND schemaname = 'public' 
+    AND rowsecurity = true
+  ) THEN
+    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
+  END IF;
+END$$;
 
 -- Create indexes
-CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
-CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
-CREATE INDEX IF NOT EXISTS idx_users_is_host ON users(is_host);
-CREATE INDEX IF NOT EXISTS idx_users_is_approved_host ON users(is_approved_host);
-CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
+    CREATE INDEX idx_users_email ON users(email);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_role') THEN
+    CREATE INDEX idx_users_role ON users(role);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_is_host') THEN
+    CREATE INDEX idx_users_is_host ON users(is_host);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_is_approved_host') THEN
+    CREATE INDEX idx_users_is_approved_host ON users(is_approved_host);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_created_at') THEN
+    CREATE INDEX idx_users_created_at ON users(created_at);
+  END IF;
+END$$;
 
 -- RLS Policies
-CREATE POLICY "Users can read own data"
-  ON users
-  FOR SELECT
-  TO authenticated
-  USING (auth.uid() = id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'users' 
+    AND policyname = 'Users can read own data'
+  ) THEN
+    CREATE POLICY "Users can read own data"
+      ON users
+      FOR SELECT
+      TO authenticated
+      USING (auth.uid() = id);
+  END IF;
+END$$;
 
-CREATE POLICY "Users can insert own data"
-  ON users
-  FOR INSERT
-  TO authenticated
-  WITH CHECK (auth.uid() = id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'users' 
+    AND policyname = 'Users can insert own data'
+  ) THEN
+    CREATE POLICY "Users can insert own data"
+      ON users
+      FOR INSERT
+      TO authenticated
+      WITH CHECK (auth.uid() = id);
+  END IF;
+END$$;
 
-CREATE POLICY "Users can update own data"
-  ON users
-  FOR UPDATE
-  TO authenticated
-  USING (auth.uid() = id)
-  WITH CHECK (auth.uid() = id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'users' 
+    AND policyname = 'Users can update own data'
+  ) THEN
+    CREATE POLICY "Users can update own data"
+      ON users
+      FOR UPDATE
+      TO authenticated
+      USING (auth.uid() = id)
+      WITH CHECK (auth.uid() = id);
+  END IF;
+END$$;