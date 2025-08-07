import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

// Create and export the Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Utility functions for common Supabase operations
export const supabaseUtils = {
  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Upload file to storage
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    if (error) throw error;
    return data;
  },

  // Get public URL for file
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  }
};

// Database types
export type UserRole = 'admin' | 'client';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type RequestStatus = 'pending' | 'reviewed' | 'quoted' | 'approved' | 'rejected';
export type ProductCategory = 'floor_tiles' | 'ceramic_mugs' | 'dinnerware' | 'sanitary_wares' | 'decorative' | 'industrial';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  phone?: string;
  address?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price?: number;
  image_url?: string;
  specifications: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductRequest {
  id: string;
  client_id: string;
  product_category: ProductCategory;
  product_name: string;
  description: string;
  quantity: number;
  budget_range?: string;
  deadline?: string;
  status: RequestStatus;
  admin_notes?: string;
  quote_amount?: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Order {
  id: string;
  client_id: string;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  products?: Product;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  product_interest?: ProductCategory;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Inventory {
  id: string;
  product_id: string;
  quantity_available: number;
  minimum_stock: number;
  last_updated: string;
  products?: Product;
}