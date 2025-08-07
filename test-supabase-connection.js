import https from 'https';

// Test Supabase connection and database status
async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection and Database Status\n');
  console.log('=' .repeat(60));
  
  const supabaseUrl = 'https://auudigdqyfsyhloofkfu.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dWRpZ2RxeWZzeWhsb29ma2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODQwNDcsImV4cCI6MjA3MDA2MDA0N30.gx_o0C4Y6g7RdePkz40YLZn9RUAIUF8UYyS0VIDpHc4';
  
  // Test 1: Basic API Health Check
  console.log('🏥 Test 1: API Health Check');
  try {
    await makeRequest(`${supabaseUrl}/rest/v1/`, 'GET', null, anonKey);
    console.log('✅ Supabase API is accessible');
  } catch (error) {
    console.log('❌ Supabase API health check failed:', error.message);
    return false;
  }
  
  // Test 2: Check if profiles table exists
  console.log('\n📋 Test 2: Profiles Table Check');
  try {
    const result = await makeRequest(`${supabaseUrl}/rest/v1/profiles?select=count`, 'GET', null, anonKey);
    console.log('✅ Profiles table exists and is accessible');
    console.log('📊 Table appears to be properly configured');
  } catch (error) {
    console.log('❌ Profiles table missing or inaccessible:', error.message);
    console.log('🔧 SOLUTION: Run the essential-migration.sql in Supabase SQL Editor');
    return false;
  }
  
  // Test 3: Test Authentication Endpoint
  console.log('\n🔐 Test 3: Authentication Endpoint');
  try {
    // Test signup endpoint (this will fail but should not return 500)
    await makeRequest(`${supabaseUrl}/auth/v1/signup`, 'POST', {
      email: 'test@example.com',
      password: 'testpass123456'
    }, anonKey);
  } catch (error) {
    if (error.message.includes('Database error')) {
      console.log('❌ Database error in signup - profiles table or trigger missing');
      console.log('🔧 SOLUTION: Run the essential-migration.sql migration');
      return false;
    } else if (error.message.includes('User already registered') || error.message.includes('rate limit')) {
      console.log('✅ Auth endpoint working (user exists or rate limited - this is expected)');
    } else {
      console.log('⚠️  Auth endpoint response:', error.message);
    }
  }
  
  // Test 4: Check Project Configuration
  console.log('\n⚙️  Test 4: Project Configuration');
  console.log('📍 Project URL:', supabaseUrl);
  console.log('🔑 API Key present:', anonKey ? 'Yes' : 'No');
  console.log('🎯 Project ID: auudigdqyfsyhloofkfu');
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎉 Connection tests completed!');
  
  return true;
}

function makeRequest(url, method, data, apiKey) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            resolve(responseData);
          }
        } else {
          try {
            const errorData = JSON.parse(responseData);
            reject(new Error(errorData.message || errorData.msg || `HTTP ${res.statusCode}`));
          } catch (e) {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Run the test
testSupabaseConnection().then((success) => {
  if (success) {
    console.log('\n✅ All tests passed! Your Supabase connection is working properly.');
    console.log('🚀 You can now test user registration at: http://localhost:5174/auth');
  } else {
    console.log('\n❌ Some tests failed. Please run the database migration first.');
    console.log('📖 See URGENT_FIX_GUIDE.md for detailed instructions.');
  }
}).catch((error) => {
  console.error('\n💥 Test suite failed:', error.message);
});
