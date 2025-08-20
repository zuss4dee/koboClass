@@ .. @@
 /*
   # Create whereby links table for video conference management
 
   1. New Tables
     - `whereby_links`
       - `id` (uuid, primary key)
       - `class_id` (uuid, foreign key to classes)
       - `whereby_url` (text, required, Whereby format)
       - `room_id` (text, unique, optional)
       - `status` (whereby_status enum, default 'active')
       - `created_at` (timestamptz, auto)
       - `expires_at` (timestamptz, optional)
   
   2. Security
     - Enable RLS on `whereby_links` table
     - Add policies for hosts and students to access links
   
   3. Constraints
     - One link per class
     - Valid Whereby URL format
 */
 
-CREATE TABLE IF NOT EXISTS whereby_links (
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'whereby_links' AND table_schema = 'public') THEN
+    CREATE TABLE whereby_links (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
       whereby_url text NOT NULL,
       room_id text UNIQUE,
       status whereby_status DEFAULT 'active',
       created_at timestamptz DEFAULT now(),
       expires_at timestamptz,
       
       -- Constraints
       CONSTRAINT one_link_per_class UNIQUE(class_id),
       CONSTRAINT valid_whereby_url CHECK (whereby_url ~* '^https://.*whereby\.com/.*')
-);
+    );
+  END IF;
+END$$;
 
 -- Enable RLS
-ALTER TABLE whereby_links ENABLE ROW LEVEL SECURITY;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_tables 
+    WHERE tablename = 'whereby_links' 
+    AND schemaname = 'public' 
+    AND rowsecurity = true
+  ) THEN
+    ALTER TABLE whereby_links ENABLE ROW LEVEL SECURITY;
+  END IF;
+END$$;
 
 -- Create indexes
-CREATE INDEX IF NOT EXISTS idx_whereby_links_class_id ON whereby_links(class_id);
-CREATE INDEX IF NOT EXISTS idx_whereby_links_room_id ON whereby_links(room_id);
-CREATE INDEX IF NOT EXISTS idx_whereby_links_status ON whereby_links(status);
-CREATE INDEX IF NOT EXISTS idx_whereby_links_expires_at ON whereby_links(expires_at);
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_whereby_links_class_id') THEN
+    CREATE INDEX idx_whereby_links_class_id ON whereby_links(class_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_whereby_links_room_id') THEN
+    CREATE INDEX idx_whereby_links_room_id ON whereby_links(room_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_whereby_links_status') THEN
+    CREATE INDEX idx_whereby_links_status ON whereby_links(status);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_whereby_links_expires_at') THEN
+    CREATE INDEX idx_whereby_links_expires_at ON whereby_links(expires_at);
+  END IF;
+END$$;
 
 -- RLS Policies
-CREATE POLICY "Hosts can read links for own classes"
-  ON whereby_links
-  FOR SELECT
-  TO authenticated
-  USING (
-    EXISTS (
-      SELECT 1 FROM classes 
-      WHERE id = whereby_links.class_id 
-      AND host_id = auth.uid()
-    )
-  );
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'whereby_links' 
+    AND policyname = 'Hosts can read links for own classes'
+  ) THEN
+    CREATE POLICY "Hosts can read links for own classes"
+      ON whereby_links
+      FOR SELECT
+      TO authenticated
+      USING (
+        EXISTS (
+          SELECT 1 FROM classes 
+          WHERE id = whereby_links.class_id 
+          AND host_id = auth.uid()
+        )
+      );
+  END IF;
+END$$;
 
-CREATE POLICY "Students can read links for purchased classes"
-  ON whereby_links
-  FOR SELECT
-  TO authenticated
-  USING (
-    EXISTS (
-      SELECT 1 FROM tickets 
-      WHERE class_id = whereby_links.class_id 
-      AND user_id = auth.uid() 
-      AND status = 'paid'
-    )
-  );
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'whereby_links' 
+    AND policyname = 'Students can read links for purchased classes'
+  ) THEN
+    CREATE POLICY "Students can read links for purchased classes"
+      ON whereby_links
+      FOR SELECT
+      TO authenticated
+      USING (
+        EXISTS (
+          SELECT 1 FROM tickets 
+          WHERE class_id = whereby_links.class_id 
+          AND user_id = auth.uid() 
+          AND status = 'paid'
+        )
+      );
+  END IF;
+END$$;