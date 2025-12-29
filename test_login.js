// Simple test to debug frontend login issue
const axios = require('axios');

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

async function testLogin() {
  try {
    console.log("Testing login...");
    const res = await api.post("/api/accounts/login/", {
      username: "testuser",
      password: "password123",
    });
    
    console.log("Success:", res.data);
  } catch (error) {
    console.log("Error:", error.response?.data || error.message);
    console.log("Status:", error.response?.status);
  }
}

testLogin();
