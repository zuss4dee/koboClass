@@ .. @@
 /*
   # Create classes table for masterclass listings
 
   1. New Tables
     - `classes`
       - `id` (uuid, primary key)
       - `title` (text, required, 5-200 chars)
       - `description` (text, required, 20-2000 chars)
       - `host_id` (uuid, foreign key to users)
       - `category_id` (uuid, foreign key to categories)
       - `price` (integer, in kobo, 100000-500000)
       - `currency` (text, default 'NGN')
       - `date_time` (timestamptz, must be future)
       - `duration_minutes` (integer, 30-240, default 90)
       - `whereby_link` (text, optional)
       - `status` (class_status enum, default 'draft')
       - `cover_image_url` (text, optional)
       - `max_students` (integer, optional, positive)
       - `admin_notes` (text, optional)
       - `approved_by` (uuid, foreign key to users)
       - `approved_at` (timestamptz, optional)
       - `created_at` (timestamptz, auto)
       - `updated_at` (timestamptz, auto)
   
   2. Security
     - Enable RLS on `classes` table
     - Add policies for hosts to manage their classes
     - Add policy for public to read approved classes
   
   3. Validation Functions
     - Function to check if user is approved host
 */
 
 -- Create validation function
-CREATE OR REPLACE FUNCTION is_approved_host(user_id uuid)
-RETURNS BOOLEAN AS $$
-BEGIN
-  RETURN EXISTS (
-    SELECT 1 FROM users 
-    WHERE id = user_id 
-    AND is_host = true 
-    AND is_approved_host = true
-  );
-END;
-$$ LANGUAGE plpgsql;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_proc 
+    WHERE proname = 'is_approved_host'
+  ) THEN
+    CREATE FUNCTION is_approved_host(user_id uuid)
+    RETURNS BOOLEAN AS $func$
+    BEGIN
+      RETURN EXISTS (
+        SELECT 1 FROM users 
+        WHERE id = user_id 
+        AND is_host = true 
+        AND is_approved_host = true
+      );
+    END;
+    $func$ LANGUAGE plpgsql;
+  END IF;
+END$$;
 
-CREATE TABLE IF NOT EXISTS classes (
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'classes' AND table_schema = 'public') THEN
+    CREATE TABLE classes (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       title text NOT NULL,
       description text NOT NULL,
       host_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       category_id uuid NOT NULL REFERENCES categories(id),
       price integer NOT NULL,
       currency text DEFAULT 'NGN',
       date_time timestamptz NOT NULL,
       duration_minutes integer DEFAULT 90,
       whereby_link text,
       status class_status DEFAULT 'draft',
       cover_image_url text,
       max_students integer,
       admin_notes text,
       approved_by uuid REFERENCES users(id),
       approved_at timestamptz,
       created_at timestamptz DEFAULT now(),
       updated_at timestamptz DEFAULT now(),
       
       -- Constraints
       CONSTRAINT valid_title_length CHECK (length(trim(title)) >= 5 AND length(title) <= 200),
       CONSTRAINT valid_description_length CHECK (length(trim(description)) >= 20 AND length(description) <= 2000),
       CONSTRAINT valid_price_range CHECK (price >= 100000 AND price <= 500000),
       CONSTRAINT valid_currency CHECK (currency IN ('NGN', 'USD')),
       CONSTRAINT future_date_time CHECK (date_time > now()),
       CONSTRAINT valid_duration CHECK (duration_minutes >= 30 AND duration_minutes <= 240),
       CONSTRAINT valid_max_students CHECK (max_students IS NULL OR max_students > 0),
       CONSTRAINT approved_fields_consistency CHECK (
         (status != 'approved' AND approved_by IS NULL AND approved_at IS NULL) OR
         (status = 'approved' AND approved_by IS NOT NULL AND approved_at IS NOT NULL)
       )
-);
+    );
+  END IF;
+END$$;
 
 -- Enable RLS
-ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_tables 
+    WHERE tablename = 'classes' 
+    AND schemaname = 'public' 
+    AND rowsecurity = true
+  ) THEN
+    ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
+  END IF;
+END$$;
 
 -- Create indexes
-CREATE INDEX IF NOT EXISTS idx_classes_host_id ON classes(host_id);
-CREATE INDEX IF NOT EXISTS idx_classes_category_id ON classes(category_id);
-CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);
-CREATE INDEX IF NOT EXISTS idx_classes_date_time ON classes(date_time);
-CREATE INDEX IF NOT EXISTS idx_classes_price ON classes(price);
-CREATE INDEX IF NOT EXISTS idx_classes_created_at ON classes(created_at);
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_classes_host_id') THEN
+    CREATE INDEX idx_classes_host_id ON classes(host_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_classes_category_id') THEN
+    CREATE INDEX idx_classes_category_id ON classes(category_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_classes_status') THEN
+    CREATE INDEX idx_classes_status ON classes(status);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_classes_date_time') THEN
+    CREATE INDEX idx_classes_date_time ON classes(date_time);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_classes_price') THEN
+    CREATE INDEX idx_classes_price ON classes(price);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_classes_created_at') THEN
+    CREATE INDEX idx_classes_created_at ON classes(created_at);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_classes_search') THEN
+    CREATE INDEX idx_classes_search ON classes USING gin(to_tsvector('english', title || ' ' || description));
+  END IF;
+END$$;
 
--- Full-text search index
-CREATE INDEX IF NOT EXISTS idx_classes_search ON classes USING gin(to_tsvector('english', title || ' ' || description));
-
 -- RLS Policies
-CREATE POLICY "Approved classes are publicly readable"
-  ON classes
-  FOR SELECT
-  TO public
-  USING (status = 'approved');
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'classes' 
+    AND policyname = 'Approved classes are publicly readable'
+  ) THEN
+    CREATE POLICY "Approved classes are publicly readable"
+      ON classes
+      FOR SELECT
+      TO public
+      USING (status = 'approved');
+  END IF;
+END$$;
 
-CREATE POLICY "Hosts can read own classes"
-  ON classes
-  FOR SELECT
-  TO authenticated
-  USING (auth.uid() = host_id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'classes' 
+    AND policyname = 'Hosts can read own classes'
+  ) THEN
+    CREATE POLICY "Hosts can read own classes"
+      ON classes
+      FOR SELECT
+      TO authenticated
+      USING (auth.uid() = host_id);
+  END IF;
+END$$;
 
-CREATE POLICY "Hosts can create classes"
-  ON classes
-  FOR INSERT
-  TO authenticated
-  WITH CHECK (
-    auth.uid() = host_id AND
-    EXISTS (
-      SELECT 1 FROM users 
-      WHERE id = auth.uid() 
-      AND is_host = true 
-      AND is_approved_host = true
-    )
-  );
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'classes' 
+    AND policyname = 'Hosts can create classes'
+  ) THEN
+    CREATE POLICY "Hosts can create classes"
+      ON classes
+      FOR INSERT
+      TO authenticated
+      WITH CHECK (
+        auth.uid() = host_id AND
+        EXISTS (
+          SELECT 1 FROM users 
+          WHERE id = auth.uid() 
+          AND is_host = true 
+          AND is_approved_host = true
+        )
+      );
+  END IF;
+END$$;
 
-CREATE POLICY "Hosts can update own classes"
-  ON classes
-  FOR UPDATE
-  TO authenticated
-  USING (auth.uid() = host_id)
-  WITH CHECK (auth.uid() = host_id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'classes' 
+    AND policyname = 'Hosts can update own classes'
+  ) THEN
+    CREATE POLICY "Hosts can update own classes"
+      ON classes
+      FOR UPDATE
+      TO authenticated
+      USING (auth.uid() = host_id)
+      WITH CHECK (auth.uid() = host_id);
+  END IF;
+END$$;