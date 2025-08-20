/*
  # Create Reviews Table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `class_id` (uuid, foreign key to classes)
      - `rating` (integer, required, 1-5)
      - `comment` (text, optional, max 1000 chars)
      - `created_at` (timestamptz, auto)

  2. Security
    - Enable RLS on `reviews` table
    - Users can create reviews for classes they attended
    - Reviews are publicly readable for approved classes

  3. Validation
    - Rating must be between 1 and 5
    - Comment length validation
    - Users can only review classes they have tickets for

  4. Constraints
    - One review per user per class
    - Must have attended class to review

  5. Indexes
    - User ID, class ID, rating, created_at indexes
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now(),
  
  -- Validation constraints
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT valid_comment_length CHECK (comment IS NULL OR length(comment) <= 1000),
  
  -- Business constraints
  CONSTRAINT one_review_per_user_per_class UNIQUE (user_id, class_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can create reviews for attended classes"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE user_id = auth.uid() 
      AND class_id = reviews.class_id 
      AND status = 'paid'
    )
  );

CREATE POLICY "Users can read own reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Reviews are publicly readable for approved classes"
  ON reviews
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE id = reviews.class_id 
      AND status = 'approved'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_class_id ON reviews(class_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);