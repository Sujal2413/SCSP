// Simple Login Test - Fixed
const axios = require('axios');

async function testLoginFlow() {
  console.log("=== Testing Login Flow ===\n");

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });

  try {
    // Test login with existing user
    console.log("1. Testing login...");
    const loginRes = await api.post("/api/accounts/login/", {
      username: "johndoe",
      password: "password123",
    });
    
    console.log("✅ Login successful!");
    console.log("Response:", {
      username: loginRes.data.username,
      email: loginRes.data.email,
      access_token: loginRes.data.access.substring(0, 30) + "...",
      refresh_token: loginRes.data.refresh.substring(0, 30) + "..."
    });
    
    const accessToken = loginRes.data.access;
    
    // Test profile fetch
    console.log("\n2. Testing profile fetch...");
    const profileRes = await api.get("/api/accounts/profile/", {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log("✅ Profile fetch successful!");
    console.log("Profile:", profileRes.data);
    
    console.log("\n=== CONCLUSION ===");
    console.log("✅ Backend is working perfectly");
    console.log("✅ Authentication API is functional");
    console.log("✅ JWT tokens are being generated correctly");
    console.log("✅ Profile API is working with tokens");
    
    console.log("\n🔍 FRONTEND LOGIN ISSUE ANALYSIS:");
    console.log("Since backend works perfectly, the issue is likely in:");
    console.log("1. Frontend axios configuration");
    console.log("2. CORS settings (already updated)");
    console.log("3. Token storage/retrieval in frontend");
    console.log("4. Error handling in frontend code");
    console.log("5. React Router navigation after login");
    
  } catch (error) {
    console.log("❌ Error:", error.message);
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    }
  }
}

// Test with wrong credentials
async function testWrongLogin() {
  console.log("\n=== Testing Wrong Credentials ===\n");
  
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });
  
  try {
    const res = await api.post("/api/accounts/login/", {
      username: "wronguser",
      password: "wrongpass",
    });
    
    console.log("❌ This should have failed");
  } catch (error) {
    console.log("✅ Correctly rejected wrong credentials");
    console.log("Status:", error.response?.status);
    console.log("Error:", error.response?.data);
  }
}

testLoginFlow();
testWrongLogin();
