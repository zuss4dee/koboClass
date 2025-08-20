@@ .. @@
 /*
   # Create reviews table for class ratings and feedback
 
   1. New Tables
     - `reviews`
       - `id` (uuid, primary key)
       - `user_id` (uuid, foreign key to users)
       - `class_id` (uuid, foreign key to classes)
       - `rating` (integer, 1-5 stars)
       - `comment` (text, optional, max 1000 chars)
       - `created_at` (timestamptz, auto)
   
   2. Security
     - Enable RLS on `reviews` table
     - Add policies for users to manage their reviews
     - Add policy for public to read reviews
   
   3. Constraints
     - One review per user per class
     - Valid rating range (1-5)
     - User must have attended class (has paid ticket)
 */
 
 -- Create validation function
-CREATE OR REPLACE FUNCTION user_attended_class(p_user_id uuid, p_class_id uuid)
-RETURNS BOOLEAN AS $$
-BEGIN
-  RETURN EXISTS (
-    SELECT 1 FROM tickets 
-    WHERE user_id = p_user_id 
-    AND class_id = p_class_id 
-    AND status = 'paid'
-  );
-END;
-$$ LANGUAGE plpgsql;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_proc 
+    WHERE proname = 'user_attended_class'
+  ) THEN
+    CREATE FUNCTION user_attended_class(p_user_id uuid, p_class_id uuid)
+    RETURNS BOOLEAN AS $func$
+    BEGIN
+      RETURN EXISTS (
+        SELECT 1 FROM tickets 
+        WHERE user_id = p_user_id 
+        AND class_id = p_class_id 
+        AND status = 'paid'
+      );
+    END;
+    $func$ LANGUAGE plpgsql;
+  END IF;
+END$$;
 
-CREATE TABLE IF NOT EXISTS reviews (
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews' AND table_schema = 'public') THEN
+    CREATE TABLE reviews (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
       rating integer NOT NULL,
       comment text,
       created_at timestamptz DEFAULT now(),
       
       -- Constraints
       CONSTRAINT one_review_per_user_per_class UNIQUE(user_id, class_id),
       CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
       CONSTRAINT valid_comment_length CHECK (comment IS NULL OR length(comment) <= 1000),
       CONSTRAINT user_must_have_attended CHECK (user_attended_class(user_id, class_id))
-);
+    );
+  END IF;
+END$$;
 
 -- Enable RLS
-ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_tables 
+    WHERE tablename = 'reviews' 
+    AND schemaname = 'public' 
+    AND rowsecurity = true
+  ) THEN
+    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
+  END IF;
+END$$;
 
 -- Create indexes
-CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
-CREATE INDEX IF NOT EXISTS idx_reviews_class_id ON reviews(class_id);
-CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
-CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reviews_user_id') THEN
+    CREATE INDEX idx_reviews_user_id ON reviews(user_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reviews_class_id') THEN
+    CREATE INDEX idx_reviews_class_id ON reviews(class_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reviews_rating') THEN
+    CREATE INDEX idx_reviews_rating ON reviews(rating);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reviews_created_at') THEN
+    CREATE INDEX idx_reviews_created_at ON reviews(created_at);
+  END IF;
+END$$;
 
 -- RLS Policies
-CREATE POLICY "Reviews are publicly readable"
-  ON reviews
-  FOR SELECT
-  TO public
-  USING (true);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'reviews' 
+    AND policyname = 'Reviews are publicly readable'
+  ) THEN
+    CREATE POLICY "Reviews are publicly readable"
+      ON reviews
+      FOR SELECT
+      TO public
+      USING (true);
+  END IF;
+END$$;
 
-CREATE POLICY "Users can create reviews for attended classes"
-  ON reviews
-  FOR INSERT
-  TO authenticated
-  WITH CHECK (
-    auth.uid() = user_id AND
-    user_attended_class(user_id, class_id)
-  );
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'reviews' 
+    AND policyname = 'Users can create reviews for attended classes'
+  ) THEN
+    CREATE POLICY "Users can create reviews for attended classes"
+      ON reviews
+      FOR INSERT
+      TO authenticated
+      WITH CHECK (
+        auth.uid() = user_id AND
+        user_attended_class(user_id, class_id)
+      );
+  END IF;
+END$$;
 
-CREATE POLICY "Users can update own reviews"
-  ON reviews
-  FOR UPDATE
-  TO authenticated
-  USING (auth.uid() = user_id)
-  WITH CHECK (auth.uid() = user_id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'reviews' 
+    AND policyname = 'Users can update own reviews'
+  ) THEN
+    CREATE POLICY "Users can update own reviews"
+      ON reviews
+      FOR UPDATE
+      TO authenticated
+      USING (auth.uid() = user_id)
+      WITH CHECK (auth.uid() = user_id);
+  END IF;
+END$$;