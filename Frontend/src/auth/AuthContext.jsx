import React, { createContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../api/axios";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [access, setAccess] = useState(localStorage.getItem("scsp_access") || "");
  const [refresh, setRefresh] = useState(localStorage.getItem("scsp_refresh") || "");
  const [me, setMe] = useState(null);

  // Attach token to axios headers
  useEffect(() => {
    setAuthToken(access || null);
  }, [access]);

  // Fetch logged-in user profile
  useEffect(() => {
    (async () => {
      if (!access) {
        setMe(null);
        return;
      }

      try {
        const res = await api.get("/api/accounts/profile/");
        setMe(res.data);
      } catch {
        setMe(null);
      }
    })();
  }, [access]);

  // 🔐 LOGIN (FIXED)
  const login = async ({ username, password }) => {
    console.log("🔐 AuthContext: Starting login process", { username });
    
    try {
      console.log("📡 AuthContext: Making API request...");
      const res = await api.post("/api/accounts/login/", {
        username,
        password,
      });
      
      console.log("✅ AuthContext: API response received:", res.data);

      const { access: a, refresh: r } = res.data;
      
      if (!a || !r) {
        console.error("❌ AuthContext: Missing tokens in response:", res.data);
        throw new Error("Authentication failed - missing tokens");
      }

      console.log("💾 AuthContext: Storing tokens in localStorage...");
      localStorage.setItem("scsp_access", a);
      localStorage.setItem("scsp_refresh", r);

      console.log("🔄 AuthContext: Updating state...");
      setAccess(a);
      setRefresh(r);
      
      console.log("✅ AuthContext: Login process completed successfully");
      return true;
      
    } catch (error) {
      console.error("❌ AuthContext: Login failed:", error);
      
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        throw error; // Re-throw to let component handle it
      } else if (error.request) {
        console.error("Network error:", error.message);
        throw new Error("Network error - please check your connection");
      } else {
        console.error("Request error:", error.message);
        throw error;
      }
    }
  };

  // 📝 REGISTER (FIXED)
  const register = async ({
    username,
    email,
    password,
    full_name,
    mobile,
  }) => {
    await api.post("/api/accounts/register/", {
      username,
      email,
      password,
      full_name,
      mobile,
    });

    // Auto-login after register
    return login({ username, password });
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("scsp_access");
    localStorage.removeItem("scsp_refresh");
    setAccess("");
    setRefresh("");
    setMe(null);
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({
      isAuthed: !!access,
      access,
      refresh,
      me,
      login,
      register,
      logout,
    }),
    [access, refresh, me]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
