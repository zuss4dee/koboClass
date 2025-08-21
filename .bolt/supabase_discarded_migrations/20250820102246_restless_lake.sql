@@ .. @@
 /*
   # Create admin helper functions for platform management
 
   1. Functions
     - `get_platform_statistics()` - Overall platform stats
     - `get_host_earnings_summary()` - Host earnings breakdown
     - `search_classes()` - Full-text search for classes
     - `get_trending_classes()` - Popular classes algorithm
     - `is_admin()` - Check if user is admin
   
   2. Admin Utilities
     - Platform-wide statistics
     - Host performance metrics
     - Search and discovery
 */
 
 -- Function to check if user is admin (customize email list)
-CREATE OR REPLACE FUNCTION is_admin(user_email text)
-RETURNS BOOLEAN AS $$
-BEGIN
-  RETURN user_email IN (
-    'admin@koboclass.com',
-    'support@koboclass.com'
-    -- Add more admin emails here
-  );
-END;
-$$ LANGUAGE plpgsql;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_proc 
+    WHERE proname = 'is_admin'
+  ) THEN
+    CREATE FUNCTION is_admin(user_email text)
+    RETURNS BOOLEAN AS $func$
+    BEGIN
+      RETURN user_email IN (
+        'admin@koboclass.com',
+        'support@koboclass.com'
+        -- Add more admin emails here
+      );
+    END;
+    $func$ LANGUAGE plpgsql;
+  END IF;
+END$$;
 
 -- Function to get platform statistics
-CREATE OR REPLACE FUNCTION get_platform_statistics()
-RETURNS TABLE (
-  total_users bigint,
-  total_hosts bigint,
-  total_classes bigint,
-  total_tickets bigint,
-  total_revenue bigint,
-  platform_commission bigint,
-  host_earnings bigint,
-  average_class_rating numeric
-) AS $$
-BEGIN
-  RETURN QUERY
-  SELECT 
-    (SELECT COUNT(*) FROM users) as total_users,
-    (SELECT COUNT(*) FROM users WHERE is_approved_host = true) as total_hosts,
-    (SELECT COUNT(*) FROM classes WHERE status = 'approved') as total_classes,
-    (SELECT COUNT(*) FROM tickets WHERE status = 'paid') as total_tickets,
-    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE payment_status = 'succeeded') as total_revenue,
-    (SELECT COALESCE(SUM(amount), 0) * 0.2 FROM transactions WHERE payment_status = 'succeeded') as platform_commission,
-    (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE status = 'paid') as host_earnings,
-    (SELECT COALESCE(AVG(rating), 0) FROM reviews) as average_class_rating;
-END;
-$$ LANGUAGE plpgsql;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_proc 
+    WHERE proname = 'get_platform_statistics'
+  ) THEN
+    CREATE FUNCTION get_platform_statistics()
+    RETURNS TABLE (
+      total_users bigint,
+      total_hosts bigint,
+      total_classes bigint,
+      total_tickets bigint,
+      total_revenue bigint,
+      platform_commission bigint,
+      host_earnings bigint,
+      average_class_rating numeric
+    ) AS $func$
+    BEGIN
+      RETURN QUERY
+      SELECT 
+        (SELECT COUNT(*) FROM users) as total_users,
+        (SELECT COUNT(*) FROM users WHERE is_approved_host = true) as total_hosts,
+        (SELECT COUNT(*) FROM classes WHERE status = 'approved') as total_classes,
+        (SELECT COUNT(*) FROM tickets WHERE status = 'paid') as total_tickets,
+        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE payment_status = 'succeeded') as total_revenue,
+        (SELECT COALESCE(SUM(amount), 0) * 0.2 FROM transactions WHERE payment_status = 'succeeded') as platform_commission,
+        (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE status = 'paid') as host_earnings,
+        (SELECT COALESCE(AVG(rating), 0) FROM reviews) as average_class_rating;
+    END;
+    $func$ LANGUAGE plpgsql;
+  END IF;
+END$$;
 
 -- Function to get host earnings summary
-CREATE OR REPLACE FUNCTION get_host_earnings_summary(host_user_id uuid)
-RETURNS TABLE (
-  total_earnings bigint,
-  pending_earnings bigint,
-  paid_earnings bigint,
-  total_students bigint,
-  total_classes bigint,
-  average_rating numeric
-) AS $$
-BEGIN
-  RETURN QUERY
-  SELECT 
-    (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE host_id = host_user_id) as total_earnings,
-    (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE host_id = host_user_id AND status = 'pending') as pending_earnings,
-    (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE host_id = host_user_id AND status = 'paid') as paid_earnings,
-    (SELECT COUNT(DISTINCT t.user_id) FROM tickets t JOIN classes c ON t.class_id = c.id WHERE c.host_id = host_user_id AND t.status = 'paid') as total_students,
-    (SELECT COUNT(*) FROM classes WHERE host_id = host_user_id AND status = 'approved') as total_classes,
-    (SELECT COALESCE(AVG(r.rating), 0) FROM reviews r JOIN classes c ON r.class_id = c.id WHERE c.host_id = host_user_id) as average_rating;
-END;
-$$ LANGUAGE plpgsql;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_proc 
+    WHERE proname = 'get_host_earnings_summary'
+  ) THEN
+    CREATE FUNCTION get_host_earnings_summary(host_user_id uuid)
+    RETURNS TABLE (
+      total_earnings bigint,
+      pending_earnings bigint,
+      paid_earnings bigint,
+      total_students bigint,
+      total_classes bigint,
+      average_rating numeric
+    ) AS $func$
+    BEGIN
+      RETURN QUERY
+      SELECT 
+        (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE host_id = host_user_id) as total_earnings,
+        (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE host_id = host_user_id AND status = 'pending') as pending_earnings,
+        (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE host_id = host_user_id AND status = 'paid') as paid_earnings,
+        (SELECT COUNT(DISTINCT t.user_id) FROM tickets t JOIN classes c ON t.class_id = c.id WHERE c.host_id = host_user_id AND t.status = 'paid') as total_students,
+        (SELECT COUNT(*) FROM classes WHERE host_id = host_user_id AND status = 'approved') as total_classes,
+        (SELECT COALESCE(AVG(r.rating), 0) FROM reviews r JOIN classes c ON r.class_id = c.id WHERE c.host_id = host_user_id) as average_rating;
+    END;
+    $func$ LANGUAGE plpgsql;
+  END IF;
+END$$;
 
 -- Function for full-text search of classes
-CREATE OR REPLACE FUNCTION search_classes(search_query text)
-RETURNS TABLE (
-  id uuid,
-  title text,
-  description text,
-  host_name text,
-  category_name text,
-  price integer,
-  date_time timestamptz,
-  rating numeric,
-  student_count bigint
-) AS $$
-BEGIN
-  RETURN QUERY
-  SELECT 
-    c.id,
-    c.title,
-    c.description,
-    u.full_name as host_name,
-    cat.name as category_name,
-    c.price,
-    c.date_time,
-    COALESCE(AVG(r.rating), 0) as rating,
-    COUNT(t.id) as student_count
-  FROM classes c
-  JOIN users u ON c.host_id = u.id
-  JOIN categories cat ON c.category_id = cat.id
-  LEFT JOIN reviews r ON c.id = r.class_id
-  LEFT JOIN tickets t ON c.id = t.class_id AND t.status = 'paid'
-  WHERE 
-    c.status = 'approved' AND
-    c.date_time > now() AND
-    (
-      to_tsvector('english', c.title || ' ' || c.description) @@ plainto_tsquery('english', search_query) OR
-      c.title ILIKE '%' || search_query || '%' OR
-      c.description ILIKE '%' || search_query || '%' OR
-      u.full_name ILIKE '%' || search_query || '%' OR
-      cat.name ILIKE '%' || search_query || '%'
-    )
-  GROUP BY c.id, c.title, c.description, u.full_name, cat.name, c.price, c.date_time
-  ORDER BY rating DESC, student_count DESC, c.created_at DESC;
-END;
-$$ LANGUAGE plpgsql;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_proc 
+    WHERE proname = 'search_classes'
+  ) THEN
+    CREATE FUNCTION search_classes(search_query text)
+    RETURNS TABLE (
+      id uuid,
+      title text,
+      description text,
+      host_name text,
+      category_name text,
+      price integer,
+      date_time timestamptz,
+      rating numeric,
+      student_count bigint
+    ) AS $func$
+    BEGIN
+      RETURN QUERY
+      SELECT 
+        c.id,
+        c.title,
+        c.description,
+        u.full_name as host_name,
+        cat.name as category_name,
+        c.price,
+        c.date_time,
+        COALESCE(AVG(r.rating), 0) as rating,
+        COUNT(t.id) as student_count
+      FROM classes c
+      JOIN users u ON c.host_id = u.id
+      JOIN categories cat ON c.category_id = cat.id
+      LEFT JOIN reviews r ON c.id = r.class_id
+      LEFT JOIN tickets t ON c.id = t.class_id AND t.status = 'paid'
+      WHERE 
+        c.status = 'approved' AND
+        c.date_time > now() AND
+        (
+          to_tsvector('english', c.title || ' ' || c.description) @@ plainto_tsquery('english', search_query) OR
+          c.title ILIKE '%' || search_query || '%' OR
+          c.description ILIKE '%' || search_query || '%' OR
+          u.full_name ILIKE '%' || search_query || '%' OR
+          cat.name ILIKE '%' || search_query || '%'
+        )
+      GROUP BY c.id, c.title, c.description, u.full_name, cat.name, c.price, c.date_time
+      ORDER BY rating DESC, student_count DESC, c.created_at DESC;
+    END;
+    $func$ LANGUAGE plpgsql;
+  END IF;
+END$$;
 
 -- Function to get trending classes
-CREATE OR REPLACE FUNCTION get_trending_classes(limit_count integer DEFAULT 10)
-RETURNS TABLE (
-  id uuid,
-  title text,
-  description text,
-  host_name text,
-  category_name text,
-  price integer,
-  date_time timestamptz,
-  rating numeric,
-  student_count bigint,
-  trend_score numeric
-) AS $$
-BEGIN
-  RETURN QUERY
-  SELECT 
-    c.id,
-    c.title,
-    c.description,
-    u.full_name as host_name,
-    cat.name as category_name,
-    c.price,
-    c.date_time,
-    COALESCE(AVG(r.rating), 0) as rating,
-    COUNT(t.id) as student_count,
-    -- Trend score: recent tickets + rating + recency
-    (
-      COUNT(CASE WHEN t.created_at > now() - interval '7 days' THEN 1 END) * 2 +
-      COALESCE(AVG(r.rating), 0) * 10 +
-      (7 - EXTRACT(days FROM now() - c.created_at)) * 0.5
-    ) as trend_score
-  FROM classes c
-  JOIN users u ON c.host_id = u.id
-  JOIN categories cat ON c.category_id = cat.id
-  LEFT JOIN reviews r ON c.id = r.class_id
-  LEFT JOIN tickets t ON c.id = t.class_id AND t.status = 'paid'
-  WHERE 
-    c.status = 'approved' AND
-    c.date_time > now()
-  GROUP BY c.id, c.title, c.description, u.full_name, cat.name, c.price, c.date_time, c.created_at
-  ORDER BY trend_score DESC, c.created_at DESC
-  LIMIT limit_count;
-END;
-$$ LANGUAGE plpgsql;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_proc 
+    WHERE proname = 'get_trending_classes'
+  ) THEN
+    CREATE FUNCTION get_trending_classes(limit_count integer DEFAULT 10)
+    RETURNS TABLE (
+      id uuid,
+      title text,
+      description text,
+      host_name text,
+      category_name text,
+      price integer,
+      date_time timestamptz,
+      rating numeric,
+      student_count bigint,
+      trend_score numeric
+    ) AS $func$
+    BEGIN
+      RETURN QUERY
+      SELECT 
+        c.id,
+        c.title,
+        c.description,
+        u.full_name as host_name,
+        cat.name as category_name,
+        c.price,
+        c.date_time,
+        COALESCE(AVG(r.rating), 0) as rating,
+        COUNT(t.id) as student_count,
+        -- Trend score: recent tickets + rating + recency
+        (
+          COUNT(CASE WHEN t.created_at > now() - interval '7 days' THEN 1 END) * 2 +
+          COALESCE(AVG(r.rating), 0) * 10 +
+          (7 - EXTRACT(days FROM now() - c.created_at)) * 0.5
+        ) as trend_score
+      FROM classes c
+      JOIN users u ON c.host_id = u.id
+      JOIN categories cat ON c.category_id = cat.id
+      LEFT JOIN reviews r ON c.id = r.class_id
+      LEFT JOIN tickets t ON c.id = t.class_id AND t.status = 'paid'
+      WHERE 
+        c.status = 'approved' AND
+        c.date_time > now()
+      GROUP BY c.id, c.title, c.description, u.full_name, cat.name, c.price, c.date_time, c.created_at
+      ORDER BY trend_score DESC, c.created_at DESC
+      LIMIT limit_count;
+    END;
+    $func$ LANGUAGE plpgsql;
+  END IF;
+END$$;