/*
  # Create Database Functions and Triggers

  1. Functions Created
    - `handle_new_user()` - Auto-create user profile on signup
    - `update_updated_at_column()` - Auto-update timestamps
    - `create_host_earning()` - Auto-create earnings on ticket purchase

  2. Triggers Created
    - Auto-create user profile on auth.users insert
    - Auto-update updated_at on users and classes tables
    - Auto-create earnings when tickets are created

  3. Purpose
    - Automate common database operations
    - Ensure data consistency
    - Reduce application logic complexity
*/

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create host earning when ticket is created
CREATE OR REPLACE FUNCTION create_host_earning()
RETURNS trigger AS $$
DECLARE
  class_price integer;
  host_user_id uuid;
  host_earning_amount integer;
BEGIN
  -- Get class price and host_id
  SELECT price, host_id INTO class_price, host_user_id
  FROM classes
  WHERE id = NEW.class_id;
  
  -- Calculate 80% for host (20% platform fee)
  host_earning_amount := ROUND(class_price * 0.8);
  
  -- Create earning record
  INSERT INTO earnings (
    host_id,
    class_id,
    ticket_id,
    amount,
    currency,
    status
  ) VALUES (
    host_user_id,
    NEW.class_id,
    NEW.id,
    host_earning_amount,
    'NGN',
    'pending'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Triggers for updated_at columns
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for creating earnings
DROP TRIGGER IF EXISTS create_earning_on_ticket_creation ON tickets;
CREATE TRIGGER create_earning_on_ticket_creation
  AFTER INSERT ON tickets
  FOR EACH ROW EXECUTE FUNCTION create_host_earning();