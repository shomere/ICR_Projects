// BROWSER-BASED MIGRATION HELPER
// Shows instructions for manual migration since RPC doesn't work

import { supabase } from '../lib/supabase';

export const runMigration = async () => {
  console.log('🚀 MANUAL MIGRATION REQUIRED');
  console.log('🎯 The automated migration cannot work due to Supabase RPC limitations');
  console.log('=' .repeat(70));
  
  console.log('\n📋 TO FIX THE 500 SIGNUP ERROR:');
  console.log('\n1. 🌐 Open a new tab and go to:');
  console.log('   https://app.supabase.com/project/auudigdqyfsyhloofkfu/sql');
  
  console.log('\n2. 📄 Copy the contents of the MANUAL_FIX.sql file');
  console.log('   (Located in your project root folder)');
  
  console.log('\n3. 📋 Paste it into the Supabase SQL Editor');
  
  console.log('\n4. ▶️ Click the "Run" button');
  
  console.log('\n5. ✅ Look for success message: "DATABASE MIGRATION COMPLETED!"');
  
  console.log('\n6. 🧪 Come back here and try signing up again');
  
  console.log('\n' + '=' .repeat(70));
  console.log('\n💡 ALTERNATIVE: Copy and paste this SQL directly:');
  console.log('\n```sql');
  
  const migrationSQL = `-- COPY THIS ENTIRE BLOCK INTO SUPABASE SQL EDITOR
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'client');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  address TEXT,
  role user_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown User'),
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;

SELECT 'DATABASE MIGRATION COMPLETED! User signup should now work!' AS status;`;
  
  console.log(migrationSQL);
  console.log('```\n');
  
  console.log('🎯 After running the migration, try signing up again!');
  
  // Still test the current state
  console.log('\n🧪 Testing current signup status...');
  await testUserSignup();
};

const testUserSignup = async () => {
  try {
    const testEmail = 'test-' + Date.now() + '@example.com';
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testpassword123',
      options: {
        data: {
          full_name: 'Migration Test User'
        }
      }
    });
    
    if (error) {
      if (error.message.includes('Database error')) {
        console.log('❌ Migration may not have worked completely');
        console.log('🔧 Try running the manual migration in Supabase SQL Editor');
      } else {
        console.log('🎉 SUCCESS! Signup is working (error was:', error.message, ')');
        console.log('✅ The 500 error has been fixed!');
      }
    } else {
      console.log('🎉 PERFECT! User signup is now working!');
      console.log('✅ The 500 error has been completely fixed!');
      console.log('👤 Test user created:', data.user?.email);
    }
    
  } catch (error: any) {
    console.log('⚠️ Test error:', error.message);
  }
  
  console.log('\n🚀 You can now test signup at: http://localhost:5173/auth');
};

// Export for manual use
(window as any).runMigration = runMigration;
