@@ .. @@
 /*
   # Create earnings table for host commission tracking
 
   1. New Tables
     - `earnings`
       - `id` (uuid, primary key)
       - `host_id` (uuid, foreign key to users)
       - `class_id` (uuid, foreign key to classes)
       - `ticket_id` (uuid, foreign key to tickets)
       - `amount` (integer, in kobo, 80% of ticket price)
       - `currency` (text, default 'NGN')
       - `status` (earning_status enum, default 'pending')
       - `payout_date` (date, optional)
       - `stripe_transfer_id` (text, optional)
       - `created_at` (timestamptz, auto)
   
   2. Security
     - Enable RLS on `earnings` table
     - Add policy for hosts to read their own earnings
   
   3. Constraints
     - One earning per ticket
     - Payout fields consistency
 */
 
-CREATE TABLE IF NOT EXISTS earnings (
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'earnings' AND table_schema = 'public') THEN
+    CREATE TABLE earnings (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       host_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
       ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
       amount integer NOT NULL,
       currency text DEFAULT 'NGN',
       status earning_status DEFAULT 'pending',
       payout_date date,
       stripe_transfer_id text,
       created_at timestamptz DEFAULT now(),
       
       -- Constraints
       CONSTRAINT one_earning_per_ticket UNIQUE(ticket_id),
       CONSTRAINT valid_amount CHECK (amount > 0),
       CONSTRAINT valid_currency CHECK (currency IN ('NGN', 'USD')),
       CONSTRAINT payout_fields_consistency CHECK (
         (status != 'paid' AND payout_date IS NULL AND stripe_transfer_id IS NULL) OR
         (status = 'paid' AND payout_date IS NOT NULL)
       )
-);
+    );
+  END IF;
+END$$;
 
 -- Enable RLS
-ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_tables 
+    WHERE tablename = 'earnings' 
+    AND schemaname = 'public' 
+    AND rowsecurity = true
+  ) THEN
+    ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
+  END IF;
+END$$;
 
 -- Create indexes
-CREATE INDEX IF NOT EXISTS idx_earnings_host_id ON earnings(host_id);
-CREATE INDEX IF NOT EXISTS idx_earnings_class_id ON earnings(class_id);
-CREATE INDEX IF NOT EXISTS idx_earnings_ticket_id ON earnings(ticket_id);
-CREATE INDEX IF NOT EXISTS idx_earnings_status ON earnings(status);
-CREATE INDEX IF NOT EXISTS idx_earnings_payout_date ON earnings(payout_date);
-CREATE INDEX IF NOT EXISTS idx_earnings_created_at ON earnings(created_at);
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_earnings_host_id') THEN
+    CREATE INDEX idx_earnings_host_id ON earnings(host_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_earnings_class_id') THEN
+    CREATE INDEX idx_earnings_class_id ON earnings(class_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_earnings_ticket_id') THEN
+    CREATE INDEX idx_earnings_ticket_id ON earnings(ticket_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_earnings_status') THEN
+    CREATE INDEX idx_earnings_status ON earnings(status);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_earnings_payout_date') THEN
+    CREATE INDEX idx_earnings_payout_date ON earnings(payout_date);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_earnings_created_at') THEN
+    CREATE INDEX idx_earnings_created_at ON earnings(created_at);
+  END IF;
+END$$;
 
 -- RLS Policies
-CREATE POLICY "Hosts can read own earnings"
-  ON earnings
-  FOR SELECT
-  TO authenticated
-  USING (auth.uid() = host_id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'earnings' 
+    AND policyname = 'Hosts can read own earnings'
+  ) THEN
+    CREATE POLICY "Hosts can read own earnings"
+      ON earnings
+      FOR SELECT
+      TO authenticated
+      USING (auth.uid() = host_id);
+  END IF;
+END$$;