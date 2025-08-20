@@ .. @@
 /*
   # Create Custom Enum Types
   
   1. Custom Types
     - `user_role` - User role types (learner, host, both)
     - `application_status` - Host application status
     - `class_status` - Class approval status  
     - `payment_status` - Payment transaction status
     - `ticket_status` - Ticket status
     - `earning_status` - Earning payout status
     - `refund_status` - Refund request status
     - `whereby_status` - Whereby link status
     - `notification_type` - Notification categories
 */
 
--- Create user role enum
-CREATE TYPE user_role AS ENUM ('learner', 'host', 'both');
+-- Create user role enum
+DO $$
+BEGIN
+    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
+        CREATE TYPE user_role AS ENUM ('learner', 'host', 'both');
+    END IF;
+END$$;
 
--- Create application status enum
-CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
+-- Create application status enum
+DO $$
+BEGIN
+    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
+        CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
+    END IF;
+END$$;
 
--- Create class status enum
-CREATE TYPE class_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected');
+-- Create class status enum
+DO $$
+BEGIN
+    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'class_status') THEN
+        CREATE TYPE class_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected');
+    END IF;
+END$$;
 
--- Create payment status enum
-CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
+-- Create payment status enum
+DO $$
+BEGIN
+    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
+        CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
+    END IF;
+END$$;
 
--- Create ticket status enum
-CREATE TYPE ticket_status AS ENUM ('paid', 'refunded');
+-- Create ticket status enum
+DO $$
+BEGIN
+    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
+        CREATE TYPE ticket_status AS ENUM ('paid', 'refunded');
+    END IF;
+END$$;
 
--- Create earning status enum
-CREATE TYPE earning_status AS ENUM ('pending', 'paid', 'refunded');
+-- Create earning status enum
+DO $$
+BEGIN
+    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'earning_status') THEN
+        CREATE TYPE earning_status AS ENUM ('pending', 'paid', 'refunded');
+    END IF;
+END$$;
 
--- Create refund status enum
-CREATE TYPE refund_status AS ENUM ('pending', 'approved', 'declined', 'refunded');
+-- Create refund status enum
+DO $$
+BEGIN
+    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'refund_status') THEN
+        CREATE TYPE refund_status AS ENUM ('pending', 'approved', 'declined', 'refunded');
+    END IF;
+END$$;
 
--- Create whereby status enum
-CREATE TYPE whereby_status AS ENUM ('active', 'expired');
+-- Create whereby status enum
+DO $$
+BEGIN
+    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'whereby_status') THEN
+        CREATE TYPE whereby_status AS ENUM ('active', 'expired');
+    END IF;
+END$$;
 
--- Create notification type enum
-CREATE TYPE notification_type AS ENUM ('reminder', 'final_call', 'rating', 'general');
+-- Create notification type enum
+DO $$
+BEGIN
+    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
+        CREATE TYPE notification_type AS ENUM ('reminder', 'final_call', 'rating', 'general');
+    END IF;
+END$$;