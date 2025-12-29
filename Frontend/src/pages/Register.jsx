import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register({
        full_name: form.fullName,
        username: form.username,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });

      navigate("/");
    } catch (err) {
      const data = err?.response?.data;

      // ✅ Handle DRF validation errors safely
      if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const firstError = data[firstKey]?.[0];
        if (firstError) {
          setError(firstError);
          return;
        }
      }

      // ✅ Fallback for HTML / network / unknown errors
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>

        <form onSubmit={onSubmit} style={styles.form}>
          <input
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            placeholder="Full Name"
            style={styles.input}
            required
          />

          <input
            name="username"
            value={form.username}
            onChange={onChange}
            placeholder="Username"
            style={styles.input}
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email Address"
            style={styles.input}
            required
          />

          <input
            name="mobile"
            value={form.mobile}
            onChange={onChange}
            placeholder="Mobile Number"
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Password (minimum 8 characters)"
            style={styles.input}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="Confirm Password"
            style={styles.input}
            required
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
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
    maxWidth: 460,
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

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  input: {
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#111827",
    fontSize: 15,
    outline: "none",
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
