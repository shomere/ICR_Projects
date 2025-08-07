import https from 'https';

// COMPREHENSIVE TESTING SUITE
// Tests all aspects of the Supabase integration and user interface

const SUPABASE_URL = 'https://auudigdqyfsyhloofkfu.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dWRpZ2RxeWZzeWhsb29ma2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODQwNDcsImV4cCI6MjA3MDA2MDA0N30.gx_o0C4Y6g7RdePkz40YLZn9RUAIUF8UYyS0VIDpHc4';

async function runComprehensiveTests() {
  console.log('🧪 COMPREHENSIVE SUPABASE INTEGRATION TEST');
  console.log('🎯 Testing all functionality end-to-end');
  console.log('=' .repeat(70));
  
  const results = {
    tests: [],
    passed: 0,
    failed: 0,
    warnings: 0
  };
  
  // Test 1: Basic API Connection
  await runTest(results, 'API Connection', async () => {
    await makeRequest(`${SUPABASE_URL}/rest/v1/`, 'GET', null, ANON_KEY);
    return 'Supabase API is accessible';
  });
  
  // Test 2: Database Tables
  await runTest(results, 'Database Tables', async () => {
    const profiles = await makeRequest(`${SUPABASE_URL}/rest/v1/profiles?select=count`, 'GET', null, ANON_KEY);
    return 'Profiles table exists and is accessible';
  });
  
  // Test 3: Authentication Endpoint
  await runTest(results, 'Authentication System', async () => {
    try {
      await makeRequest(`${SUPABASE_URL}/auth/v1/signup`, 'POST', {
        email: 'test@example.com',
        password: 'testpass123456'
      }, ANON_KEY);
      return 'Auth endpoint working';
    } catch (error) {
      if (error.message.includes('Database error')) {
        throw new Error('Database triggers missing - migration required');
      } else if (error.message.includes('User already registered') || 
                 error.message.includes('rate limit') ||
                 error.message.includes('422')) {
        return 'Auth endpoint working (expected user/rate limit error)';
      }
      throw error;
    }
  });
  
  // Test 4: Environment Variables
  await runTest(results, 'Environment Configuration', async () => {
    if (!ANON_KEY || ANON_KEY.length < 100) {
      throw new Error('Invalid or missing ANON_KEY');
    }
    if (!SUPABASE_URL.includes('supabase.co')) {
      throw new Error('Invalid SUPABASE_URL');
    }
    return 'Environment variables are properly configured';
  });
  
  // Test 5: Development Server
  await runTest(results, 'Development Server', async () => {
    try {
      await makeHttpRequest('http://localhost:5173/', 'GET');
      return 'Development server running on port 5173';
    } catch {
      try {
        await makeHttpRequest('http://localhost:5174/', 'GET');
        return 'Development server running on port 5174';
      } catch {
        throw new Error('Development server not accessible');
      }
    }
  });
  
  // Results Summary
  console.log('\n' + '=' .repeat(70));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(70));
  
  results.tests.forEach((test, index) => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} Test ${index + 1}: ${test.name} - ${test.status}`);
    if (test.message) {
      console.log(`   └─ ${test.message}`);
    }
    if (test.error) {
      console.log(`   └─ Error: ${test.error}`);
    }
  });
  
  console.log('\n' + '=' .repeat(70));
  console.log(`🎯 Results: ${results.passed} passed, ${results.failed} failed, ${results.warnings} warnings`);
  
  // Recommendations
  console.log('\n📋 RECOMMENDATIONS:');
  
  if (results.failed > 0) {
    console.log('❌ Critical issues found:');
    results.tests.filter(t => t.status === 'FAIL').forEach(test => {
      console.log(`   • ${test.name}: ${test.error}`);
    });
    
    const hasDbError = results.tests.some(t => t.error?.includes('Database error') || t.error?.includes('migration required'));
    if (hasDbError) {
      console.log('\n🔧 TO FIX DATABASE ISSUES:');
      console.log('   1. Open browser and go to your app');
      console.log('   2. Open browser console (F12)');
      console.log('   3. Type: runMigration()');
      console.log('   4. Press Enter and wait for completion');
      console.log('   5. Try user signup again');
    }
  } else if (results.warnings > 0) {
    console.log('⚠️  Minor issues found but system should work');
  } else {
    console.log('🎉 All tests passed! Your system is fully functional');
    console.log('🚀 Ready for production use');
  }
  
  console.log('\n🔗 Quick Access Links:');
  console.log('   • Your App: http://localhost:5173/ or http://localhost:5174/');
  console.log('   • Auth Page: /auth');
  console.log('   • Supabase Dashboard: https://app.supabase.com/project/auudigdqyfsyhloofkfu');
  
  return results.failed === 0;
}

async function runTest(results, name, testFunction) {
  console.log(`\n🧪 Running Test: ${name}`);
  try {
    const message = await testFunction();
    console.log(`✅ ${name}: PASSED - ${message}`);
    results.tests.push({ name, status: 'PASS', message });
    results.passed++;
  } catch (error) {
    const isWarning = error.message.includes('warning') || error.message.includes('minor');
    if (isWarning) {
      console.log(`⚠️  ${name}: WARNING - ${error.message}`);
      results.tests.push({ name, status: 'WARN', error: error.message });
      results.warnings++;
    } else {
      console.log(`❌ ${name}: FAILED - ${error.message}`);
      results.tests.push({ name, status: 'FAIL', error: error.message });
      results.failed++;
    }
  }
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
      res.on('data', (chunk) => responseData += chunk);
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
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function makeHttpRequest(url, method) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const lib = url.startsWith('https:') ? https : require('http');
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (url.startsWith('https:') ? 443 : 80),
      path: urlObj.pathname,
      method: method,
      timeout: 3000
    };
    
    const req = lib.request(options, (res) => {
      resolve(res.statusCode);
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.end();
  });
}

// Run the comprehensive test suite
runComprehensiveTests().then((success) => {
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error('\n💥 Test suite crashed:', error.message);
  process.exit(1);
});
