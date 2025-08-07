/*
  # Icungo Ceramics Database Schema

  1. New Tables
    - `profiles` - User profiles extending Supabase auth
    - `products` - Product catalog with categories and specifications
    - `product_requests` - Client product requests and inquiries
    - `orders` - Order management system
    - `order_items` - Individual items within orders
    - `inventory` - Product inventory tracking
    - `contact_messages` - Contact form submissions

  2. Security
    - Enable RLS on all tables
    - Add policies for admin and client access
    - Secure data access based on user roles

  3. Features
    - Complete product management
    - Order tracking system
    - Inventory management
    - Client request handling
    - Admin dashboard controls
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'client');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE request_status AS ENUM ('pending', 'reviewed', 'quoted', 'approved', 'rejected');
CREATE TYPE product_category AS ENUM ('floor_tiles', 'ceramic_mugs', 'dinnerware', 'sanitary_wares', 'decorative', 'industrial');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  company_name text,
  phone text,
  address text,
  role user_role DEFAULT 'client',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category product_category NOT NULL,
  price decimal(10,2),
  image_url text,
  specifications jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity_available integer DEFAULT 0,
  minimum_stock integer DEFAULT 10,
  last_updated timestamptz DEFAULT now()
);

-- Product requests table
CREATE TABLE IF NOT EXISTS product_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_category product_category,
  product_name text NOT NULL,
  description text NOT NULL,
  quantity integer DEFAULT 1,
  budget_range text,
  deadline date,
  status request_status DEFAULT 'pending',
  admin_notes text,
  quote_amount decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  shipping_address text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  product_interest product_category,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products policies
CREATE POLICY "Anyone can read active products"
  ON products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Inventory policies
CREATE POLICY "Admins can manage inventory"
  ON inventory
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Product requests policies
CREATE POLICY "Clients can read own requests"
  ON product_requests
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Clients can create requests"
  ON product_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins can manage all requests"
  ON product_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Clients can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Clients can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Order items policies
CREATE POLICY "Clients can read own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Contact messages policies
CREATE POLICY "Admins can manage contact messages"
  ON contact_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample products
INSERT INTO products (name, description, category, price, image_url, specifications) VALUES
('Premium Floor Tiles', 'High-quality ceramic floor tiles perfect for residential and commercial spaces', 'floor_tiles', 25.99, 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg', '{"size": "30x30cm", "thickness": "8mm", "finish": "matte"}'),
('Ceramic Coffee Mugs', 'Handcrafted ceramic mugs with traditional Rwandan designs', 'ceramic_mugs', 12.50, 'https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg', '{"capacity": "350ml", "material": "ceramic", "dishwasher_safe": true}'),
('Dinner Plate Set', 'Elegant ceramic dinner plates for fine dining', 'dinnerware', 45.00, 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg', '{"pieces": 6, "diameter": "27cm", "microwave_safe": true}'),
('Modern Toilet Suite', 'Water-efficient ceramic toilet with modern design', 'sanitary_wares', 299.99, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', '{"water_usage": "4.5L", "height": "standard", "installation": "floor_mounted"}'),
('Decorative Vase', 'Artistic ceramic vase with traditional patterns', 'decorative', 35.00, 'https://images.pexels.com/photos/1582183/pexels-photo-1582183.jpeg', '{"height": "25cm", "style": "traditional", "handcrafted": true}'),
('Industrial Ceramic Tiles', 'Heavy-duty ceramic tiles for industrial applications', 'industrial', 89.99, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg', '{"size": "60x60cm", "load_capacity": "high", "chemical_resistant": true}');

-- Insert inventory for products
INSERT INTO inventory (product_id, quantity_available, minimum_stock)
SELECT id, 100, 20 FROM products;

-- Generate order numbers function
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
BEGIN
  RETURN 'IC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;