/*
  # Create Classes Table

  1. New Tables
    - `classes`
      - `id` (uuid, primary key)
      - `title` (text, required, 5-200 chars)
      - `description` (text, required, 20-2000 chars)
      - `host_id` (uuid, foreign key to users)
      - `category_id` (uuid, foreign key to categories)
      - `price` (integer, required, ₦1k-₦5k in kobo)
      - `currency` (text, default 'NGN')
      - `date_time` (timestamptz, required, future date)
      - `duration_minutes` (integer, default 90, 30-240 mins)
      - `whereby_link` (text, optional)
      - `status` (class_status, default 'draft')
      - `cover_image_url` (text, optional)
      - `max_students` (integer, optional, positive)
      - `admin_notes` (text, optional)
      - `approved_by` (uuid, foreign key to users)
      - `approved_at` (timestamptz, optional)
      - `created_at` (timestamptz, auto)
      - `updated_at` (timestamptz, auto)

  2. Security
    - Enable RLS on `classes` table
    - Approved classes are publicly readable
    - Hosts can create, read, and update their own classes
    - Only approved hosts can create classes

  3. Validation
    - Title and description length validation
    - Price range validation (₦1k-₦5k in kobo)
    - Duration validation (30-240 minutes)
    - Future date validation
    - Approval fields consistency

  4. Indexes
    - Host ID, category ID, status, date_time, price indexes
    - Full-text search index for title and description
*/

CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  host_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id),
  price integer NOT NULL,
  currency text DEFAULT 'NGN',
  date_time timestamptz NOT NULL,
  duration_minutes integer DEFAULT 90,
  whereby_link text,
  status class_status DEFAULT 'draft',
  cover_image_url text,
  max_students integer,
  admin_notes text,
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Validation constraints
  CONSTRAINT valid_title_length CHECK (length(trim(title)) >= 5 AND length(title) <= 200),
  CONSTRAINT valid_description_length CHECK (length(trim(description)) >= 20 AND length(description) <= 2000),
  CONSTRAINT valid_price_range CHECK (price >= 100000 AND price <= 500000), -- ₦1k-₦5k in kobo
  CONSTRAINT valid_duration CHECK (duration_minutes >= 30 AND duration_minutes <= 240),
  CONSTRAINT future_date_time CHECK (date_time > now()),
  CONSTRAINT valid_max_students CHECK (max_students IS NULL OR max_students > 0),
  CONSTRAINT approved_fields_consistency CHECK (
    (status != 'approved' AND approved_by IS NULL AND approved_at IS NULL) OR
    (status = 'approved' AND approved_by IS NOT NULL AND approved_at IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Approved classes are publicly readable"
  ON classes
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Hosts can read own classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can create classes"
  ON classes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND is_host = true 
      AND is_approved_host = true
    )
  );

CREATE POLICY "Hosts can update own classes"
  ON classes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_classes_host_id ON classes(host_id);
CREATE INDEX IF NOT EXISTS idx_classes_category_id ON classes(category_id);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);
CREATE INDEX IF NOT EXISTS idx_classes_date_time ON classes(date_time);
CREATE INDEX IF NOT EXISTS idx_classes_price ON classes(price);
CREATE INDEX IF NOT EXISTS idx_classes_created_at ON classes(created_at);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_classes_search ON classes 
USING gin(to_tsvector('english', title || ' ' || description));