# Supabase Integration Guide

This project is integrated with Supabase for backend services including authentication, database, and storage.

## 🚀 Quick Start

### 1. Environment Variables
Your `.env` file should contain the following Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project API keys** → `anon` `public` → `VITE_SUPABASE_ANON_KEY`

### 3. Current Configuration Status ✅

Your project already has:
- ✅ Supabase client library installed (`@supabase/supabase-js`)
- ✅ Supabase client configured in `src/lib/supabase.ts`
- ✅ Environment variables set up
- ✅ TypeScript interfaces for database schema
- ✅ Utility functions for common operations

## 📊 Database Schema

Your application uses the following main tables:
- **profiles** - User profiles with role-based access
- **products** - Product catalog
- **product_requests** - Client product requests
- **orders** - Order management
- **order_items** - Order line items
- **contact_messages** - Contact form submissions
- **inventory** - Stock management

## 🔧 Available Utilities

The `supabaseUtils` object provides common operations:

```typescript
import { supabase, supabaseUtils } from './lib/supabase';

// Check authentication
const isLoggedIn = await supabaseUtils.isAuthenticated();

// Get current user
const user = await supabaseUtils.getCurrentUser();

// Sign out
await supabaseUtils.signOut();

// Upload file
const uploadResult = await supabaseUtils.uploadFile('bucket-name', 'path/file.jpg', file);

// Get public URL
const publicUrl = supabaseUtils.getPublicUrl('bucket-name', 'path/file.jpg');
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already configured in `.gitignore`
2. **Use Row Level Security (RLS)** in Supabase for data protection
3. **Validate data** both client and server-side
4. **Use service role key** only for server-side operations (never in client)

## 🛠️ Common Operations

### Authentication
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### Database Queries
```typescript
// Fetch products
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true);

// Insert new record
const { data, error } = await supabase
  .from('contact_messages')
  .insert([{ name, email, message }]);
```

### Real-time Subscriptions
```typescript
// Subscribe to changes
const subscription = supabase
  .channel('public:orders')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe();
```

## 🚀 Next Steps

1. **Set up your database tables** in Supabase dashboard
2. **Configure Row Level Security** policies
3. **Set up storage buckets** if you need file uploads
4. **Test the connection** by running your development server

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

## ⚠️ Troubleshooting

### "Missing Supabase environment variables" Error
- Check that `.env` file exists and contains the required variables
- Ensure variable names start with `VITE_` (required for Vite)
- Restart your development server after changing `.env`

### Connection Issues
- Verify your Supabase project is active
- Check that your API keys haven't expired
- Ensure your project URL is correct
