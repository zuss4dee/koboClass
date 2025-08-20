@@ .. @@
 /*
   # Create transactions table for Stripe payment tracking
 
   1. New Tables
     - `transactions`
       - `id` (uuid, primary key)
       - `user_id` (uuid, foreign key to users)
       - `class_id` (uuid, foreign key to classes)
       - `amount` (integer, in kobo)
       - `currency` (text, default 'NGN')
       - `stripe_session_id` (text, unique)
       - `stripe_payment_intent_id` (text, unique)
       - `payment_status` (payment_status enum, default 'pending')
       - `payment_method_type` (text, optional)
       - `receipt_url` (text, optional)
       - `created_at` (timestamptz, auto)
   
   2. Security
     - Enable RLS on `transactions` table
     - Add policies for users and hosts to read relevant transactions
   
   3. Constraints
     - Unique Stripe identifiers
     - Valid amount and currency
 */
 
-CREATE TABLE IF NOT EXISTS transactions (
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transactions' AND table_schema = 'public') THEN
+    CREATE TABLE transactions (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
       amount integer NOT NULL,
       currency text DEFAULT 'NGN',
       stripe_session_id text UNIQUE,
       stripe_payment_intent_id text UNIQUE,
       payment_status payment_status DEFAULT 'pending',
       payment_method_type text,
       receipt_url text,
       created_at timestamptz DEFAULT now(),
       
       -- Constraints
       CONSTRAINT valid_amount CHECK (amount > 0),
       CONSTRAINT valid_currency CHECK (currency IN ('NGN', 'USD'))
-);
+    );
+  END IF;
+END$$;
 
 -- Enable RLS
-ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_tables 
+    WHERE tablename = 'transactions' 
+    AND schemaname = 'public' 
+    AND rowsecurity = true
+  ) THEN
+    ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
+  END IF;
+END$$;
 
 -- Create indexes
-CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
-CREATE INDEX IF NOT EXISTS idx_transactions_class_id ON transactions(class_id);
-CREATE INDEX IF NOT EXISTS idx_transactions_payment_status ON transactions(payment_status);
-CREATE INDEX IF NOT EXISTS idx_transactions_stripe_session_id ON transactions(stripe_session_id);
-CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_user_id') THEN
+    CREATE INDEX idx_transactions_user_id ON transactions(user_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_class_id') THEN
+    CREATE INDEX idx_transactions_class_id ON transactions(class_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_payment_status') THEN
+    CREATE INDEX idx_transactions_payment_status ON transactions(payment_status);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_stripe_session_id') THEN
+    CREATE INDEX idx_transactions_stripe_session_id ON transactions(stripe_session_id);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_created_at') THEN
+    CREATE INDEX idx_transactions_created_at ON transactions(created_at);
+  END IF;
+END$$;
 
 -- RLS Policies
-CREATE POLICY "Users can read own transactions"
-  ON transactions
-  FOR SELECT
-  TO authenticated
-  USING (auth.uid() = user_id);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'transactions' 
+    AND policyname = 'Users can read own transactions'
+  ) THEN
+    CREATE POLICY "Users can read own transactions"
+      ON transactions
+      FOR SELECT
+      TO authenticated
+      USING (auth.uid() = user_id);
+  END IF;
+END$$;
 
-CREATE POLICY "Hosts can read transactions for their classes"
-  ON transactions
-  FOR SELECT
-  TO authenticated
-  USING (
-    EXISTS (
-      SELECT 1 FROM classes 
-      WHERE id = transactions.class_id 
-      AND host_id = auth.uid()
-    )
-  );
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'transactions' 
+    AND policyname = 'Hosts can read transactions for their classes'
+  ) THEN
+    CREATE POLICY "Hosts can read transactions for their classes"
+      ON transactions
+      FOR SELECT
+      TO authenticated
+      USING (
+        EXISTS (
+          SELECT 1 FROM classes 
+          WHERE id = transactions.class_id 
+          AND host_id = auth.uid()
+        )
+      );
+  END IF;
+END$$;