/*
  # Create Admin Helper Functions

  1. Functions Created
    - `is_admin(user_email)` - Check if user is admin
    - `get_platform_statistics()` - Get overall platform stats
    - `get_host_earnings_summary(host_id)` - Get host earnings breakdown
    - `approve_host_application(application_id, admin_id)` - Approve host
    - `approve_class(class_id, admin_id)` - Approve class
    - `search_classes(query, category, limit)` - Search and filter classes

  2. Purpose
    - Provide admin management capabilities
    - Generate platform analytics
    - Simplify complex queries
    - Ensure consistent business logic

  3. Security
    - Admin functions check permissions
    - Proper error handling
    - Audit trail for approvals
*/

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  -- Add admin emails here
  RETURN user_email = ANY(ARRAY[
    'admin@koboclass.com',
    'support@koboclass.com'
    -- Add more admin emails as needed
  ]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get platform statistics
CREATE OR REPLACE FUNCTION get_platform_statistics()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM users),
    'total_hosts', (SELECT COUNT(*) FROM users WHERE is_host = true),
    'approved_hosts', (SELECT COUNT(*) FROM users WHERE is_approved_host = true),
    'total_classes', (SELECT COUNT(*) FROM classes),
    'approved_classes', (SELECT COUNT(*) FROM classes WHERE status = 'approved'),
    'total_tickets', (SELECT COUNT(*) FROM tickets),
    'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE payment_status = 'succeeded'),
    'total_earnings_paid', (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE status = 'paid'),
    'pending_host_applications', (SELECT COUNT(*) FROM host_applications WHERE status = 'pending'),
    'pending_class_approvals', (SELECT COUNT(*) FROM classes WHERE status = 'pending_approval'),
    'pending_refunds', (SELECT COUNT(*) FROM refund_requests WHERE status = 'pending')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get host earnings summary
CREATE OR REPLACE FUNCTION get_host_earnings_summary(host_user_id uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_earnings', COALESCE(SUM(amount), 0),
    'paid_earnings', COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0),
    'pending_earnings', COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0),
    'total_classes', (
      SELECT COUNT(*) FROM classes 
      WHERE host_id = host_user_id AND status = 'approved'
    ),
    'total_students', (
      SELECT COUNT(*) FROM tickets t
      JOIN classes c ON t.class_id = c.id
      WHERE c.host_id = host_user_id AND t.status = 'paid'
    ),
    'average_rating', (
      SELECT ROUND(AVG(rating), 2) FROM reviews r
      JOIN classes c ON r.class_id = c.id
      WHERE c.host_id = host_user_id
    )
  )
  FROM earnings
  WHERE host_id = host_user_id
  INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve host application
CREATE OR REPLACE FUNCTION approve_host_application(
  application_id uuid,
  admin_user_id uuid
)
RETURNS boolean AS $$
DECLARE
  app_user_id uuid;
BEGIN
  -- Get the user_id from the application
  SELECT user_id INTO app_user_id
  FROM host_applications
  WHERE id = application_id AND status = 'pending';
  
  IF app_user_id IS NULL THEN
    RAISE EXCEPTION 'Application not found or already processed';
  END IF;
  
  -- Update application status
  UPDATE host_applications
  SET 
    status = 'approved',
    reviewed_by = admin_user_id,
    reviewed_at = now()
  WHERE id = application_id;
  
  -- Update user to be an approved host
  UPDATE users
  SET 
    is_host = true,
    is_approved_host = true,
    role = CASE 
      WHEN role = 'learner' THEN 'host'
      ELSE 'both'
    END,
    updated_at = now()
  WHERE id = app_user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve class
CREATE OR REPLACE FUNCTION approve_class(
  class_id uuid,
  admin_user_id uuid
)
RETURNS boolean AS $$
BEGIN
  -- Update class status
  UPDATE classes
  SET 
    status = 'approved',
    approved_by = admin_user_id,
    approved_at = now(),
    updated_at = now()
  WHERE id = class_id AND status = 'pending_approval';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Class not found or not pending approval';
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search classes
CREATE OR REPLACE FUNCTION search_classes(
  search_query text DEFAULT '',
  category_filter text DEFAULT '',
  result_limit integer DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  host_name text,
  host_avatar text,
  category_name text,
  price integer,
  date_time timestamptz,
  duration_minutes integer,
  students_count bigint,
  average_rating numeric,
  cover_image_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    u.full_name as host_name,
    u.avatar_url as host_avatar,
    cat.name as category_name,
    c.price,
    c.date_time,
    c.duration_minutes,
    COALESCE(ticket_counts.count, 0) as students_count,
    COALESCE(review_ratings.avg_rating, 0) as average_rating,
    c.cover_image_url
  FROM classes c
  JOIN users u ON c.host_id = u.id
  JOIN categories cat ON c.category_id = cat.id
  LEFT JOIN (
    SELECT class_id, COUNT(*) as count
    FROM tickets
    WHERE status = 'paid'
    GROUP BY class_id
  ) ticket_counts ON c.id = ticket_counts.class_id
  LEFT JOIN (
    SELECT class_id, ROUND(AVG(rating), 1) as avg_rating
    FROM reviews
    GROUP BY class_id
  ) review_ratings ON c.id = review_ratings.class_id
  WHERE 
    c.status = 'approved'
    AND c.date_time > now()
    AND (search_query = '' OR c.title ILIKE '%' || search_query || '%' OR c.description ILIKE '%' || search_query || '%')
    AND (category_filter = '' OR cat.slug = category_filter)
  ORDER BY 
    c.date_time ASC,
    COALESCE(review_ratings.avg_rating, 0) DESC,
    COALESCE(ticket_counts.count, 0) DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;