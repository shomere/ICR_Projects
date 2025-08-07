-- Supabase Database Schema Migration
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/auudigdqyfsyhloofkfu/sql

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('admin', 'client');
create type order_status as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
create type request_status as enum ('pending', 'reviewed', 'quoted', 'approved', 'rejected');
create type product_category as enum ('floor_tiles', 'ceramic_mugs', 'dinnerware', 'sanitary_wares', 'decorative', 'industrial');

-- Create profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text not null,
  company_name text,
  phone text,
  address text,
  role user_role not null default 'client',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  category product_category not null,
  price decimal(10,2),
  image_url text,
  specifications jsonb default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create product_requests table
create table public.product_requests (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  product_category product_category not null,
  product_name text not null,
  description text not null,
  quantity integer not null check (quantity > 0),
  budget_range text,
  deadline date,
  status request_status default 'pending',
  admin_notes text,
  quote_amount decimal(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  order_number text unique not null,
  total_amount decimal(10,2) not null,
  status order_status default 'pending',
  shipping_address text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order_items table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null check (quantity > 0),
  unit_price decimal(10,2) not null,
  total_price decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create contact_messages table
create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text,
  product_interest product_category,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create inventory table
create table public.inventory (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity_available integer not null default 0,
  minimum_stock integer not null default 0,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create function to handle updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger products_updated_at before update on public.products
  for each row execute procedure public.handle_updated_at();

create trigger product_requests_updated_at before update on public.product_requests
  for each row execute procedure public.handle_updated_at();

create trigger orders_updated_at before update on public.orders
  for each row execute procedure public.handle_updated_at();

-- Create function to automatically create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Unknown User'),
    'client'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Generate unique order numbers
create or replace function public.generate_order_number()
returns trigger as $$
begin
  new.order_number = 'ORD-' || extract(year from now()) || '-' || lpad(nextval('order_number_seq')::text, 6, '0');
  return new;
end;
$$ language plpgsql;

-- Create sequence for order numbers
create sequence if not exists order_number_seq start 1;

-- Create trigger for order number generation
create trigger orders_generate_number before insert on public.orders
  for each row execute procedure public.generate_order_number();

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_requests enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.inventory enable row level security;

-- Create RLS policies

-- Profiles policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Products policies
create policy "Anyone can view active products" on public.products
  for select using (is_active = true);

create policy "Admins can manage products" on public.products
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Product requests policies
create policy "Clients can view their own requests" on public.product_requests
  for select using (auth.uid() = client_id);

create policy "Clients can create requests" on public.product_requests
  for insert with check (auth.uid() = client_id);

create policy "Clients can update their pending requests" on public.product_requests
  for update using (
    auth.uid() = client_id and status = 'pending'
  );

create policy "Admins can view all requests" on public.product_requests
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update requests" on public.product_requests
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Orders policies
create policy "Clients can view their own orders" on public.orders
  for select using (auth.uid() = client_id);

create policy "Admins can view all orders" on public.orders
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Order items policies
create policy "Users can view order items for their orders" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where id = order_id and (client_id = auth.uid() or exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
      ))
    )
  );

-- Contact messages policies
create policy "Anyone can create contact messages" on public.contact_messages
  for insert with check (true);

create policy "Admins can view contact messages" on public.contact_messages
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update contact messages" on public.contact_messages
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Inventory policies
create policy "Admins can manage inventory" on public.inventory
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert sample data (optional)
-- Sample products
insert into public.products (name, description, category, price, specifications, is_active) values
  ('Classic Floor Tiles', 'High-quality ceramic floor tiles suitable for residential and commercial use', 'floor_tiles', 25.00, '{"size": "30x30cm", "material": "ceramic", "finish": "matte"}', true),
  ('Coffee Mugs Set', 'Handcrafted ceramic coffee mugs with beautiful patterns', 'ceramic_mugs', 15.00, '{"capacity": "300ml", "material": "ceramic", "dishwasher_safe": true}', true),
  ('Dinner Plate Set', 'Elegant dinnerware set perfect for formal occasions', 'dinnerware', 45.00, '{"pieces": 12, "material": "porcelain", "microwave_safe": true}', true),
  ('Bathroom Sink', 'Modern ceramic bathroom sink with contemporary design', 'sanitary_wares', 120.00, '{"dimensions": "60x40x15cm", "installation": "countertop"}', true);

-- Create admin user (you'll need to update the email to match your account)
-- insert into public.profiles (id, email, full_name, role) values
--   ('your-user-id-here', 'admin@example.com', 'Admin User', 'admin');

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

-- Success message
select 'Database schema created successfully! 🎉' as message;
