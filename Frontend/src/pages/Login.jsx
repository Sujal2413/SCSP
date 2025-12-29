import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "./Auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("📝 Login Form: Form submitted with:", { username, password });

    try {
      console.log("🚀 Login Form: Calling AuthContext login function...");
      await login({ username, password });
      console.log("✅ Login Form: Login successful, navigating to home...");
      navigate("/");
    } catch (err) {
      console.error("❌ Login Form: Login error:", err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        console.error("Server error status:", err.response.status);
        console.error("Server error data:", err.response.data);
        
        const data = err.response.data;
        if (data) {
          if (data.error) {
            setError(data.error);
          } else if (typeof data === "object") {
            // Handle validation errors from Django
            const firstKey = Object.keys(data)[0];
            const firstError = data[firstKey]?.[0];
            if (firstError) {
              setError(firstError);
            } else {
              setError("Login failed. Please check your credentials and try again.");
            }
          } else {
            setError("Server error. Please try again later.");
          }
        } else {
          setError("Server error. Please try again later.");
        }
        
      } else if (err.request) {
        // Network error - no response received
        console.error("Network error:", err.message);
        setError("Network error. Please check your internet connection and try again.");
        
      } else {
        // Other errors
        console.error("Other error:", err.message);
        setError(err.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      console.log("🏁 Login Form: Login process completed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <p className="auth-subtitle">
          Access your scholarship dashboard
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="auth-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />

          <div className="remember-row">
            <label className="remember-label">
              <input type="checkbox" />
              Remember me
            </label>

            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
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
    maxWidth: 420,
    background: "#ffffff",
    padding: "44px 40px",
    borderRadius: 28,
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 34,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  input: {
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#ffffff",     // ✅ WHITE input
    color: "#111827",          // ✅ Dark readable text
    fontSize: 15,
    outline: "none",
    transition: "border 0.2s, box-shadow 0.2s",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    color: "#4b5563",
  },

  button: {
    marginTop: 22,
    padding: "14px",
    borderRadius: 999,
    border: "none",
    background: "#2f2a28",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },

  error: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "left",
  },

  footer: {
    marginTop: 26,
    fontSize: 14,
    color: "#4b5563",
  },

  link: {
    color: "#2f2a28",
    fontWeight: 600,
    textDecoration: "none",
  },
};
