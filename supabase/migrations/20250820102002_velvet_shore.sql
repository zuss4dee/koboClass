@@ .. @@
 /*
   # Create categories table for class organization
 
   1. New Tables
     - `categories`
       - `id` (uuid, primary key)
       - `name` (text, unique, min 2 chars)
       - `slug` (text, unique, lowercase with hyphens)
       - `description` (text, optional)
       - `created_at` (timestamptz, auto)
   
   2. Security
     - Enable RLS on `categories` table
     - Add policy for public read access
   
   3. Data
     - Seed with 12 predefined categories
 */
 
-CREATE TABLE IF NOT EXISTS categories (
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories' AND table_schema = 'public') THEN
+    CREATE TABLE categories (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       name text UNIQUE NOT NULL,
       slug text UNIQUE NOT NULL,
       description text,
       created_at timestamptz DEFAULT now(),
       
       -- Constraints
       CONSTRAINT valid_name_length CHECK (length(trim(name)) >= 2),
       CONSTRAINT valid_slug_format CHECK (slug ~* '^[a-z0-9-]+$')
-);
+    );
+  END IF;
+END$$;
 
 -- Enable RLS
-ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_tables 
+    WHERE tablename = 'categories' 
+    AND schemaname = 'public' 
+    AND rowsecurity = true
+  ) THEN
+    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
+  END IF;
+END$$;
 
 -- Create indexes
-CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
-CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_categories_name') THEN
+    CREATE INDEX idx_categories_name ON categories(name);
+  END IF;
+  
+  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_categories_slug') THEN
+    CREATE INDEX idx_categories_slug ON categories(slug);
+  END IF;
+END$$;
 
 -- RLS Policies
-CREATE POLICY "Categories are publicly readable"
-  ON categories
-  FOR SELECT
-  TO public
-  USING (true);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'categories' 
+    AND policyname = 'Categories are publicly readable'
+  ) THEN
+    CREATE POLICY "Categories are publicly readable"
+      ON categories
+      FOR SELECT
+      TO public
+      USING (true);
+  END IF;
+END$$;
 
 -- Seed categories
-INSERT INTO categories (name, slug, description) VALUES
-  ('Design', 'design', 'UI/UX design, graphic design, and visual arts'),
-  ('Tech', 'tech', 'Programming, web development, and software skills'),
-  ('Business', 'business', 'Entrepreneurship, marketing, and business strategy'),
-  ('Career', 'career', 'Professional development and career advancement'),
-  ('Creative', 'creative', 'Art, crafts, and creative expression'),
-  ('Music', 'music', 'Music production, instruments, and audio skills'),
-  ('Fashion', 'fashion', 'Fashion design, styling, and textile arts'),
-  ('Photography', 'photography', 'Photography techniques and visual storytelling'),
-  ('Cooking', 'cooking', 'Culinary arts and food preparation'),
-  ('Writing', 'writing', 'Creative writing, copywriting, and content creation'),
-  ('Dance', 'dance', 'Dance styles, choreography, and movement'),
-  ('Makeup', 'makeup', 'Makeup artistry and beauty techniques')
-ON CONFLICT (name) DO NOTHING;
+DO $$
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Design') THEN
+    INSERT INTO categories (name, slug, description) VALUES
+      ('Design', 'design', 'UI/UX design, graphic design, and visual arts'),
+      ('Tech', 'tech', 'Programming, web development, and software skills'),
+      ('Business', 'business', 'Entrepreneurship, marketing, and business strategy'),
+      ('Career', 'career', 'Professional development and career advancement'),
+      ('Creative', 'creative', 'Art, crafts, and creative expression'),
+      ('Music', 'music', 'Music production, instruments, and audio skills'),
+      ('Fashion', 'fashion', 'Fashion design, styling, and textile arts'),
+      ('Photography', 'photography', 'Photography techniques and visual storytelling'),
+      ('Cooking', 'cooking', 'Culinary arts and food preparation'),
+      ('Writing', 'writing', 'Creative writing, copywriting, and content creation'),
+      ('Dance', 'dance', 'Dance styles, choreography, and movement'),
+      ('Makeup', 'makeup', 'Makeup artistry and beauty techniques');
+  END IF;
+END$$;