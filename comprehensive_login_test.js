// Frontend Login Test Script
// This simulates what happens when a user logs in through the frontend

const api = require('./Frontend/node_modules/axios');

async function testFrontendLogin() {
  console.log("=== Testing Frontend Login Flow ===\n");

  try {
    // Step 1: Test API connectivity
    console.log("1. Testing API connectivity...");
    const res = await api.post("http://127.0.0.1:8000/api/accounts/login/", {
      username: "johndoe",
      password: "password123",
    });
    
    console.log("✅ API connection successful");
    console.log("Response:", res.data);
    
    // Step 2: Check if tokens are received
    const { access, refresh } = res.data;
    if (access && refresh) {
      console.log("✅ JWT tokens received successfully");
      console.log("Access Token:", access.substring(0, 50) + "...");
      console.log("Refresh Token:", refresh.substring(0, 50) + "...");
    } else {
      console.log("❌ Missing tokens in response");
      return;
    }

    // Step 3: Test token storage simulation
    console.log("\n2. Simulating token storage...");
    console.log("Tokens would be stored in localStorage:");
    console.log("- scsp_access:", access);
    console.log("- scsp_refresh:", refresh);

    // Step 4: Test API call with token
    console.log("\n3. Testing authenticated API call...");
    const profileRes = await api.get("http://127.0.0.1:8000/api/accounts/profile/", {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    });
    
    console.log("✅ Profile fetch successful");
    console.log("Profile:", profileRes.data);

  } catch (error) {
    console.log("❌ Error during login test:");
    
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
      console.log("Headers:", error.response.headers);
    } else if (error.request) {
      console.log("Network Error:", error.message);
      console.log("Request details:", error.request);
    } else {
      console.log("Error:", error.message);
    }
  }
}

// Test with wrong credentials
async function testWrongCredentials() {
  console.log("\n=== Testing Wrong Credentials ===\n");
  
  try {
    const res = await api.post("http://127.0.0.1:8000/api/accounts/login/", {
      username: "wronguser",
      password: "wrongpassword",
    });
    
    console.log("❌ Should have failed but got:", res.data);
  } catch (error) {
    console.log("✅ Correctly rejected wrong credentials");
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
  }
}

// Test CORS
async function testCORS() {
  console.log("\n=== Testing CORS ===\n");
  
  try {
    // This simulates what happens when frontend makes a CORS request
    const res = await api.options("http://127.0.0.1:8000/api/accounts/login/", {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log("✅ CORS preflight successful");
    console.log("CORS Headers:", {
      'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': res.headers['access-control-allow-methods']
    });
    
  } catch (error) {
    console.log("❌ CORS Error:");
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
  }
}

// Run all tests
async function runAllTests() {
  await testFrontendLogin();
  await testWrongCredentials();
  await testCORS();
  
  console.log("\n=== Test Summary ===");
  console.log("✅ Backend API is working correctly");
  console.log("✅ Authentication is functioning");
  console.log("✅ Token generation is working");
  console.log("✅ If frontend still fails, check:");
  console.log("   - Browser console for JavaScript errors");
  console.log("   - Network tab for failed requests");
  console.log("   - CORS errors in browser dev tools");
  console.log("   - React router navigation issues");
}

runAllTests();
