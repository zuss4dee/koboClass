@@ .. @@
 /*
   # Create triggers and automation functions
 
   1. Functions
     - `update_updated_at_column()` - Auto-update timestamps
     - `handle_new_user()` - Create user profile on signup
     - `create_host_earning()` - Auto-create earnings on ticket purchase
   
   2. Triggers
     - Update timestamps on users and classes tables
     - Create user profile on auth.users insert
     - Create earnings on ticket creation
 */
 
 -- Function to update updated_at column
-CREATE OR REPLACE FUNCTION update_updated_at_column()
-RETURNS TRIGGER AS $$
-BEGIN
-  NEW.updated_at = now();
-  RETURN NEW;
-END;
-$$ LANGUAGE plpgsql;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_proc 
+    WHERE proname = 'update_updated_at_column'
+  ) THEN
+    CREATE FUNCTION update_updated_at_column()
+    RETURNS TRIGGER AS $func$
+    BEGIN
+      NEW.updated_at = now();
+      RETURN NEW;
+    END;
+    $func$ LANGUAGE plpgsql;
+  END IF;
+END$$;
 
 -- Function to handle new user creation
-CREATE OR REPLACE FUNCTION handle_new_user()
-RETURNS TRIGGER AS $$
-BEGIN
-  INSERT INTO public.users (id, email, full_name)
-  VALUES (
-    NEW.id,
-    NEW.email,
-    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
-  );
-  RETURN NEW;
-END;
-$$ LANGUAGE plpgsql SECURITY DEFINER;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_proc 
+    WHERE proname = 'handle_new_user'
+  ) THEN
+    CREATE FUNCTION handle_new_user()
+    RETURNS TRIGGER AS $func$
+    BEGIN
+      INSERT INTO public.users (id, email, full_name)
+      VALUES (
+        NEW.id,
+        NEW.email,
+        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
+      );
+      RETURN NEW;
+    END;
+    $func$ LANGUAGE plpgsql SECURITY DEFINER;
+  END IF;
+END$$;
 
 -- Function to create host earning when ticket is purchased
-CREATE OR REPLACE FUNCTION create_host_earning()
-RETURNS TRIGGER AS $$
-DECLARE
-  class_price integer;
-  class_host_id uuid;
-  host_earning integer;
-BEGIN
-  -- Get class price and host_id
-  SELECT price, host_id INTO class_price, class_host_id
-  FROM classes 
-  WHERE id = NEW.class_id;
-  
-  -- Calculate 80% for host (20% platform fee)
-  host_earning := ROUND(class_price * 0.8);
-  
-  -- Create earning record
-  INSERT INTO earnings (
-    host_id,
-    class_id,
-    ticket_id,
-    amount,
-    currency,
-    status
-  ) VALUES (
-    class_host_id,
-    NEW.class_id,
-    NEW.id,
-    host_earning,
-    'NGN',
-    'pending'
-  );
-  
-  RETURN NEW;
-END;
-$$ LANGUAGE plpgsql;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_proc 
+    WHERE proname = 'create_host_earning'
+  ) THEN
+    CREATE FUNCTION create_host_earning()
+    RETURNS TRIGGER AS $func$
+    DECLARE
+      class_price integer;
+      class_host_id uuid;
+      host_earning integer;
+    BEGIN
+      -- Get class price and host_id
+      SELECT price, host_id INTO class_price, class_host_id
+      FROM classes 
+      WHERE id = NEW.class_id;
+      
+      -- Calculate 80% for host (20% platform fee)
+      host_earning := ROUND(class_price * 0.8);
+      
+      -- Create earning record
+      INSERT INTO earnings (
+        host_id,
+        class_id,
+        ticket_id,
+        amount,
+        currency,
+        status
+      ) VALUES (
+        class_host_id,
+        NEW.class_id,
+        NEW.id,
+        host_earning,
+        'NGN',
+        'pending'
+      );
+      
+      RETURN NEW;
+    END;
+    $func$ LANGUAGE plpgsql;
+  END IF;
+END$$;
 
 -- Create triggers
-DROP TRIGGER IF EXISTS update_users_updated_at ON users;
-CREATE TRIGGER update_users_updated_at
-  BEFORE UPDATE ON users
-  FOR EACH ROW
-  EXECUTE FUNCTION update_updated_at_column();
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_trigger 
+    WHERE tgname = 'update_users_updated_at'
+  ) THEN
+    CREATE TRIGGER update_users_updated_at
+      BEFORE UPDATE ON users
+      FOR EACH ROW
+      EXECUTE FUNCTION update_updated_at_column();
+  END IF;
+END$$;
 
-DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
-CREATE TRIGGER update_classes_updated_at
-  BEFORE UPDATE ON classes
-  FOR EACH ROW
-  EXECUTE FUNCTION update_updated_at_column();
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_trigger 
+    WHERE tgname = 'update_classes_updated_at'
+  ) THEN
+    CREATE TRIGGER update_classes_updated_at
+      BEFORE UPDATE ON classes
+      FOR EACH ROW
+      EXECUTE FUNCTION update_updated_at_column();
+  END IF;
+END$$;
 
-DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-CREATE TRIGGER on_auth_user_created
-  AFTER INSERT ON auth.users
-  FOR EACH ROW
-  EXECUTE FUNCTION handle_new_user();
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_trigger 
+    WHERE tgname = 'on_auth_user_created'
+  ) THEN
+    CREATE TRIGGER on_auth_user_created
+      AFTER INSERT ON auth.users
+      FOR EACH ROW
+      EXECUTE FUNCTION handle_new_user();
+  END IF;
+END$$;
 
-DROP TRIGGER IF EXISTS create_earning_on_ticket_creation ON tickets;
-CREATE TRIGGER create_earning_on_ticket_creation
-  AFTER INSERT ON tickets
-  FOR EACH ROW
-  EXECUTE FUNCTION create_host_earning();
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_trigger 
+    WHERE tgname = 'create_earning_on_ticket_creation'
+  ) THEN
+    CREATE TRIGGER create_earning_on_ticket_creation
+      AFTER INSERT ON tickets
+      FOR EACH ROW
+      EXECUTE FUNCTION create_host_earning();
+  END IF;
+END$$;