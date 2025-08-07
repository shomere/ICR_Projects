// Test Supabase connection
// You can run this in your browser console or import it in a component to test the connection

import { supabase, supabaseUtils } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test 1: Check if client is initialized
    console.log('✅ Supabase client initialized:', !!supabase);
    
    // Test 2: Test database connection by fetching session
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.log('ℹ️ No active session (this is normal for new users):', sessionError.message);
    } else {
      console.log('✅ Session check successful:', !!session);
    }
    
    // Test 3: Test a simple database query (this will fail if tables don't exist yet)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact' })
        .limit(0);
      
      if (error) {
        console.log('⚠️ Database query failed (tables may not exist yet):', error.message);
      } else {
        console.log('✅ Database connection successful, profiles table accessible');
      }
    } catch (dbError) {
      console.log('⚠️ Database connection test failed:', dbError);
    }
    
    // Test 4: Test utility functions
    console.log('✅ Supabase utilities available:', !!supabaseUtils);
    
    // Test 5: Check environment variables
    console.log('✅ Environment variables loaded:', {
      hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      urlPreview: import.meta.env.VITE_SUPABASE_URL?.substring(0, 30) + '...'
    });
    
    console.log('🎉 Supabase connection test completed!');
    
    return {
      success: true,
      client: !!supabase,
      session: !!session,
      envVars: {
        url: !!import.meta.env.VITE_SUPABASE_URL,
        anonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
      }
    };
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Usage example:
// import { testSupabaseConnection } from './utils/testSupabaseConnection';
// testSupabaseConnection();
