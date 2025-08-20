@@ .. @@
 /*
   # Create refund requests table for ticket refund management
 
   1. New Tables
     - `refund_requests`
       - `id` (uuid, primary key)
       - `user_id` (uuid, foreign key to users)
       - `ticket_id` (uuid, foreign key to tickets)
       - `reason` (text, required, 10-500 chars)
       - `status` (refund_status enum, default 'pending')
       - `admin_notes` (text, optional)
       - `processed_by` (uuid, foreign key to users)
       - `processed_at` (timestamptz, optional)
       - `created_at` (timestamptz, auto)
   
   2. Security
     - Enable RLS on `refund_requests` table
     - Add policies for users to manage their refund requests
   
   3. Constraints
     - One refund request per ticket
     - User must own the ticket
 */
 
 -- Create validation function
-CREATE OR REPLACE FUNCTION user_owns_ticket(p_user_id uuid, p_ticket_id uuid)
-RETURNS BOOLEAN AS $$
-BEGIN
-  RETURN EXISTS (
-    SELECT 1 FROM tickets 
-    WHERE id = p_ticket_id 
-    AND user_id = p_user_id
-  );
-END;
-$$ LANGUAGE plpgsql;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_proc 
+    WHERE proname = 'user_owns_ticket'
+  ) THEN
+    CREATE FUNCTION user_owns_ticket(p_user_id uuid, p_ticket_id uuid)
+    RETURNS BOOLEAN AS $func$
+    BEGIN
+      RETURN EXISTS (
+        SELECT 1 FROM tickets 
+        WHERE id = p_ticket_id 
+        AND user_id = p_user_id
+      );
+    END;
+    $func$ LANGUAGE plpgsql;
+  END IF;
+END$$;
 
-CREATE TABLE IF NOT EXISTS refund_requests (
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'refund_requests' AND table_schema = 'public') THEN
+    CREATE TABLE refund_requests (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
       reason text NOT NULL,
       status refund_status DEFAULT 'pending',
       admin_notes text,
       processed_by uuid REFERENCES users(id),
       processed_at timestamptz,
       created_at timestamptz DEFAULT now(),
       
       -- Constraints
       CONSTRAINT one_refund_request_per_ticket UNIQUE(ticket_id),
       CONSTRAINT valid_reason_length CHECK (length(trim(reason)) >= 10 AND length(reason) <= 500),
       CONSTRAINT processed_fields_consistency CHECK (
         (status = 'pending' AND processed_by IS NULL AND processed_at IS NULL) OR
         (status != 'pending' AND processed_by IS NOT NULL AND processed_at IS NOT NULL)
       )
-);
+    );
+  END IF;
+END$$;
 
 -- Enable RLS
-ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_tables 
+    WHERE tablename = 'refund_requests' 
+    AND schemaname = 'public' 
+    AND rowsecurity = true
+  ) THEN
+    ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;
+  END IF;
+END$$;
 
 -- Create indexes
-CREATE INDEX IF NOT EXISTS idx_refund_requests_user_id ON refund_requests(user_id);
-CREATE INDEX IF NOT EXISTS idx_refund_requests_ticket_id ON refund_requests(ticket_id);
-CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests(status);
-CREATE INDEX IF NOT EXISTS idx_refund_requests_created_at ON refund_requests(created_at);
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_refund_requests_user_id') THEN
+    CREATE INDEX idx_refund_requests_user_id ON refund_requests(user_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_refund_requests_ticket_id') THEN
+    CREATE INDEX idx_refund_requests_ticket_id ON refund_requests(ticket_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_refund_requests_status') THEN
+    CREATE INDEX idx_refund_requests_status ON refund_requests(status);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_refund_requests_created_at') THEN
+    CREATE INDEX idx_refund_requests_created_at ON refund_requests(created_at);
+  END IF;
+END$$;
 
 -- RLS Policies
-CREATE POLICY "Users can read own refund requests"
-  ON refund_requests
-  FOR SELECT
-  TO authenticated
-  USING (auth.uid() = user_id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'refund_requests' 
+    AND policyname = 'Users can read own refund requests'
+  ) THEN
+    CREATE POLICY "Users can read own refund requests"
+      ON refund_requests
+      FOR SELECT
+      TO authenticated
+      USING (auth.uid() = user_id);
+  END IF;
+END$$;
 
-CREATE POLICY "Users can create refund requests for own tickets"
-  ON refund_requests
-  FOR INSERT
-  TO authenticated
-  WITH CHECK (
-    auth.uid() = user_id AND
-    EXISTS (
-      SELECT 1 FROM tickets 
-      WHERE id = refund_requests.ticket_id 
-      AND user_id = auth.uid()
-    )
-  );
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'refund_requests' 
+    AND policyname = 'Users can create refund requests for own tickets'
+  ) THEN
+    CREATE POLICY "Users can create refund requests for own tickets"
+      ON refund_requests
+      FOR INSERT
+      TO authenticated
+      WITH CHECK (
+        auth.uid() = user_id AND
+        EXISTS (
+          SELECT 1 FROM tickets 
+          WHERE id = refund_requests.ticket_id 
+          AND user_id = auth.uid()
+        )
+      );
+  END IF;
+END$$;