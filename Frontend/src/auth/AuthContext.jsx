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
    try {
      const res = await api.post("/api/accounts/login/", {
        username,
        password,
      });

      const { access: a, refresh: r } = res.data;
      
      if (!a || !r) {
        throw new Error("Authentication failed - missing tokens");
      }

      localStorage.setItem("scsp_access", a);
      localStorage.setItem("scsp_refresh", r);

      setAccess(a);
      setRefresh(r);
      
      return true;
      
    } catch (error) {
      if (error.request && !error.response) {
        throw new Error("Network error - please check your connection");
      }
      throw error;
    }
  };

  // 📝 REGISTER — step 1: validate details & send OTP to email
  const initiateRegister = async ({
    username,
    email,
    password,
    full_name,
    mobile,
  }) => {
    const res = await api.post("/api/accounts/register/", {
      username,
      email,
      password,
      full_name,
      mobile,
    });
    return res.data; // { message, email }
  };

  // ✅ REGISTER — step 2: verify OTP, create account & sign in
  const verifyRegistrationOtp = async ({ email, otp }) => {
    const res = await api.post("/api/accounts/register/verify/", {
      email,
      otp,
    });

    const { access: a, refresh: r } = res.data;
    if (!a || !r) {
      throw new Error("Verification succeeded but no tokens were returned.");
    }

    localStorage.setItem("scsp_access", a);
    localStorage.setItem("scsp_refresh", r);
    setAccess(a);
    setRefresh(r);
    return true;
  };

  // 🔁 REGISTER — resend the OTP
  const resendRegistrationOtp = async (email) => {
    const res = await api.post("/api/accounts/register/resend/", { email });
    return res.data; // { message }
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
      initiateRegister,
      verifyRegistrationOtp,
      resendRegistrationOtp,
      logout,
    }),
    [access, refresh, me]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
