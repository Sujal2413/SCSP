import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { initiateRegister, verifyRegistrationOtp, resendRegistrationOtp } =
    useContext(AuthContext);
  const navigate = useNavigate();

  // "form" → collect details, "otp" → verify code
  const [step, setStep] = useState("form");

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [duplicateEmail, setDuplicateEmail] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const otpRef = useRef(null);

  const onChange = (e) => {
    setDuplicateEmail(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "otp" && otpRef.current) otpRef.current.focus();
  }, [step]);

  const showOtpNotice = (data) => {
    setNotice(data?.message || "A 6-digit code has been sent to your email.");
  };

  // ---- step 1: submit details, request OTP ----
  const onSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    setDuplicateEmail(false);
    setNotice("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await initiateRegister({
        full_name: form.fullName,
        username: form.username,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });
      showOtpNotice(data);
      setStep("otp");
      setCooldown(30);
    } catch (err) {
      const message = extractError(err, "Could not start registration. Please try again.");
      setError(message);
      setDuplicateEmail(isDuplicateEmailError(message));
    } finally {
      setLoading(false);
    }
  };

  // ---- step 2: verify OTP ----
  const onVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code sent to your email.");
      return;
    }

    setLoading(true);
    try {
      await verifyRegistrationOtp({ email: form.email, otp });
      navigate("/");
    } catch (err) {
      setError(extractError(err, "Verification failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (cooldown > 0) return;
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const data = await resendRegistrationOtp(form.email);
      showOtpNotice(data);
      setCooldown(30);
    } catch (err) {
      setError(extractError(err, "Could not resend the code."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {step === "form" ? (
          <>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>
              We’ll email you a code to verify your address.
            </p>

            <form onSubmit={onSubmitForm} style={styles.form}>
              <input name="fullName" value={form.fullName} onChange={onChange}
                placeholder="Full Name" style={styles.input} required />
              <input name="username" value={form.username} onChange={onChange}
                placeholder="Username" style={styles.input} required />
              <input name="email" type="email" value={form.email} onChange={onChange}
                placeholder="Email Address" style={styles.input} required />
              <input name="mobile" value={form.mobile} onChange={onChange}
                placeholder="Mobile Number" style={styles.input} required />
              <input type="password" name="password" value={form.password} onChange={onChange}
                placeholder="Password (minimum 8 characters)" style={styles.input} required />
              <input type="password" name="confirmPassword" value={form.confirmPassword}
                onChange={onChange} placeholder="Confirm Password" style={styles.input} required />

              {error && <div style={styles.error}>{error}</div>}
              {duplicateEmail && (
                <div style={styles.inlineAction}>
                  <span>This email already has an account.</span>
                  <Link to="/login" style={styles.actionLink}>
                    Go to login
                  </Link>
                </div>
              )}

              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Sending code…" : "Continue"}
              </button>
            </form>

            <p style={styles.footer}>
              Already have an account?{" "}
              <Link to="/login" style={styles.link}>Login</Link>
            </p>
          </>
        ) : (
          <>
            <h1 style={styles.title}>Verify your email</h1>
            <p style={styles.subtitle}>
              Enter the 6-digit code we sent to
              <br />
              <strong>{form.email}</strong>
            </p>

            <form onSubmit={onVerify} style={styles.form}>
              <input
                ref={otpRef}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="––––––"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                style={styles.otpInput}
                required
              />

              {notice && <div style={styles.notice}>{notice}</div>}
              {error && <div style={styles.error}>{error}</div>}

              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Verifying…" : "Verify & Create Account"}
              </button>
            </form>

            <div style={styles.resendRow}>
              <button
                type="button"
                onClick={onResend}
                disabled={cooldown > 0 || loading}
                style={{
                  ...styles.linkBtn,
                  opacity: cooldown > 0 || loading ? 0.5 : 1,
                  cursor: cooldown > 0 || loading ? "default" : "pointer",
                }}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setError("");
                  setNotice("");
                }}
                style={styles.linkBtn}
              >
                Edit details
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function extractError(err, fallback) {
  const data = err?.response?.data;
  if (data && typeof data === "object") {
    if (data.error) return data.error;
    const firstKey = Object.keys(data)[0];
    const firstError = Array.isArray(data[firstKey])
      ? data[firstKey][0]
      : data[firstKey];
    if (firstError) return firstError;
  }
  return fallback;
}

function isDuplicateEmailError(message) {
  return /email already registered/i.test(message || "");
}

const styles = {
  page: {
    minHeight: "calc(100vh - 90px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#faf5ec",
  },
  card: {
    width: "100%",
    maxWidth: 460,
    background: "#ffffff",
    padding: "44px 40px",
    borderRadius: 28,
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: { fontSize: 34, fontWeight: 700, color: "#1f2937", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#6b7280", marginBottom: 24, lineHeight: 1.5 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  input: {
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#111827",
    fontSize: 15,
    outline: "none",
  },
  otpInput: {
    padding: "16px 18px",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#111827",
    fontSize: 30,
    fontWeight: 700,
    letterSpacing: "0.5em",
    textAlign: "center",
    outline: "none",
  },
  button: {
    marginTop: 12,
    padding: "14px",
    borderRadius: 999,
    border: "none",
    background: "#16526e",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: { color: "#dc2626", fontSize: 14, textAlign: "left" },
  inlineAction: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    color: "#4b5563",
    fontSize: 14,
    textAlign: "left",
  },
  actionLink: {
    flex: "0 0 auto",
    color: "#16526e",
    fontWeight: 700,
    textDecoration: "none",
  },
  notice: { color: "#15803d", fontSize: 14, textAlign: "left" },
  resendRow: {
    marginTop: 22,
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#16526e",
    fontWeight: 600,
    fontSize: 14,
    padding: 0,
    cursor: "pointer",
  },
  footer: { marginTop: 26, fontSize: 14, color: "#4b5563" },
  link: { color: "#16526e", fontWeight: 600, textDecoration: "none" },
};
