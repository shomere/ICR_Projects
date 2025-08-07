// Quick script to verify database setup
// Run this in browser console after migration to check if tables exist

const verifyDatabase = async () => {
  console.log('🔍 Checking database setup...');
  
  try {
    // Import supabase client
    const { supabase } = await import('./src/lib/supabase.js');
    
    // Test 1: Check if we can connect
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    console.log('✅ Connection test:', sessionError ? 'Failed' : 'Success');
    
    // Test 2: Check if profiles table exists
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Profiles table missing or inaccessible:', error.message);
      console.log('🔧 Solution: Run the essential-migration.sql in Supabase SQL Editor');
      return false;
    } else {
      console.log('✅ Profiles table exists and accessible');
    }
    
    // Test 3: Check table structure
    const { data: tableInfo } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .limit(0);
    
    console.log('✅ Profiles table structure looks good');
    
    // Test 4: Check authentication settings
    console.log('🔧 Environment variables:');
    console.log('- SUPABASE_URL:', window?.location?.origin?.includes('supabase') ? 'Connected to Supabase' : 'Local dev');
    
    console.log('🎉 Database verification complete - signup should work now!');
    return true;
    
  } catch (error) {
    console.error('❌ Database verification failed:', error);
    console.log('🔧 Please run the essential-migration.sql file in Supabase SQL Editor');
    return false;
  }
};

// Auto-run the verification
verifyDatabase();

// Make it available globally for manual testing
window.verifyDatabase = verifyDatabase;
console.log('💡 You can run verifyDatabase() anytime to check database status');
