@@ .. @@
 /*
   # Create notifications table for in-app messaging
 
   1. New Tables
     - `notifications`
       - `id` (uuid, primary key)
       - `user_id` (uuid, foreign key to users)
       - `title` (text, required, 1-200 chars)
       - `message` (text, required, 1-500 chars)
       - `type` (notification_type enum, default 'general')
       - `class_id` (uuid, foreign key to classes, optional)
       - `read` (boolean, default false)
       - `action_required` (boolean, default false)
       - `created_at` (timestamptz, auto)
   
   2. Security
     - Enable RLS on `notifications` table
     - Add policies for users to manage their notifications
   
   3. Constraints
     - Valid title and message lengths
 */
 
-CREATE TABLE IF NOT EXISTS notifications (
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications' AND table_schema = 'public') THEN
+    CREATE TABLE notifications (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       title text NOT NULL,
       message text NOT NULL,
       type notification_type DEFAULT 'general',
       class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
       read boolean DEFAULT false,
       action_required boolean DEFAULT false,
       created_at timestamptz DEFAULT now(),
       
       -- Constraints
       CONSTRAINT valid_title_length CHECK (length(trim(title)) >= 1 AND length(title) <= 200),
       CONSTRAINT valid_message_length CHECK (length(trim(message)) >= 1 AND length(message) <= 500)
-);
+    );
+  END IF;
+END$$;
 
 -- Enable RLS
-ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_tables 
+    WHERE tablename = 'notifications' 
+    AND schemaname = 'public' 
+    AND rowsecurity = true
+  ) THEN
+    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
+  END IF;
+END$$;
 
 -- Create indexes
-CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
-CREATE INDEX IF NOT EXISTS idx_notifications_class_id ON notifications(class_id);
-CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
-CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
-CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_user_id') THEN
+    CREATE INDEX idx_notifications_user_id ON notifications(user_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_class_id') THEN
+    CREATE INDEX idx_notifications_class_id ON notifications(class_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_type') THEN
+    CREATE INDEX idx_notifications_type ON notifications(type);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_read') THEN
+    CREATE INDEX idx_notifications_read ON notifications(read);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_created_at') THEN
+    CREATE INDEX idx_notifications_created_at ON notifications(created_at);
+  END IF;
+END$$;
 
 -- RLS Policies
-CREATE POLICY "Users can read own notifications"
-  ON notifications
-  FOR SELECT
-  TO authenticated
-  USING (auth.uid() = user_id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'notifications' 
+    AND policyname = 'Users can read own notifications'
+  ) THEN
+    CREATE POLICY "Users can read own notifications"
+      ON notifications
+      FOR SELECT
+      TO authenticated
+      USING (auth.uid() = user_id);
+  END IF;
+END$$;
 
-CREATE POLICY "Users can update own notifications"
-  ON notifications
-  FOR UPDATE
-  TO authenticated
-  USING (auth.uid() = user_id)
-  WITH CHECK (auth.uid() = user_id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'notifications' 
+    AND policyname = 'Users can update own notifications'
+  ) THEN
+    CREATE POLICY "Users can update own notifications"
+      ON notifications
+      FOR UPDATE
+      TO authenticated
+      USING (auth.uid() = user_id)
+      WITH CHECK (auth.uid() = user_id);
+  END IF;
+END$$;