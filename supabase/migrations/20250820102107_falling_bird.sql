@@ .. @@
 /*
   # Create tickets table for class enrollment
 
   1. New Tables
     - `tickets`
       - `id` (uuid, primary key)
       - `user_id` (uuid, foreign key to users)
       - `class_id` (uuid, foreign key to classes)
       - `transaction_id` (uuid, foreign key to transactions)
       - `receipt_url` (text, optional)
       - `status` (ticket_status enum, default 'paid')
       - `created_at` (timestamptz, auto)
   
   2. Security
     - Enable RLS on `tickets` table
     - Add policies for users and hosts to read relevant tickets
   
   3. Constraints
     - One ticket per user per class
 */
 
-CREATE TABLE IF NOT EXISTS tickets (
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tickets' AND table_schema = 'public') THEN
+    CREATE TABLE tickets (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
       transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
       receipt_url text,
       status ticket_status DEFAULT 'paid',
       created_at timestamptz DEFAULT now(),
       
       -- Constraints
       CONSTRAINT one_ticket_per_user_per_class UNIQUE(user_id, class_id)
-);
+    );
+  END IF;
+END$$;
 
 -- Enable RLS
-ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_tables 
+    WHERE tablename = 'tickets' 
+    AND schemaname = 'public' 
+    AND rowsecurity = true
+  ) THEN
+    ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
+  END IF;
+END$$;
 
 -- Create indexes
-CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
-CREATE INDEX IF NOT EXISTS idx_tickets_class_id ON tickets(class_id);
-CREATE INDEX IF NOT EXISTS idx_tickets_transaction_id ON tickets(transaction_id);
-CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
-CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tickets_user_id') THEN
+    CREATE INDEX idx_tickets_user_id ON tickets(user_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tickets_class_id') THEN
+    CREATE INDEX idx_tickets_class_id ON tickets(class_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tickets_transaction_id') THEN
+    CREATE INDEX idx_tickets_transaction_id ON tickets(transaction_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tickets_status') THEN
+    CREATE INDEX idx_tickets_status ON tickets(status);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tickets_created_at') THEN
+    CREATE INDEX idx_tickets_created_at ON tickets(created_at);
+  END IF;
+END$$;
 
 -- RLS Policies
-CREATE POLICY "Users can read own tickets"
-  ON tickets
-  FOR SELECT
-  TO authenticated
-  USING (auth.uid() = user_id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'tickets' 
+    AND policyname = 'Users can read own tickets'
+  ) THEN
+    CREATE POLICY "Users can read own tickets"
+      ON tickets
+      FOR SELECT
+      TO authenticated
+      USING (auth.uid() = user_id);
+  END IF;
+END$$;
 
-CREATE POLICY "Hosts can read tickets for their classes"
-  ON tickets
-  FOR SELECT
-  TO authenticated
-  USING (
-    EXISTS (
-      SELECT 1 FROM classes 
-      WHERE id = tickets.class_id 
-      AND host_id = auth.uid()
-    )
-  );
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'tickets' 
+    AND policyname = 'Hosts can read tickets for their classes'
+  ) THEN
+    CREATE POLICY "Hosts can read tickets for their classes"
+      ON tickets
+      FOR SELECT
+      TO authenticated
+      USING (
+        EXISTS (
+          SELECT 1 FROM classes 
+          WHERE id = tickets.class_id 
+          AND host_id = auth.uid()
+        )
+      );
+  END IF;
+END$$;