import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerUser({ name, username, email, password });
      navigate("/login");
    } catch (err) {
      const message = err?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.title}>Create account</h1>
          <p style={styles.subtitle}>Start organizing projects with TaskFlow.</p>
        </header>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <Field label="Full name" id="name">
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </Field>

          <Field label="Username" id="username">
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </Field>

          <Field label="Email" id="email">
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </Field>

          <Field label="Password" id="password">
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              minLength={6}
              required
            />
          </Field>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, id, children }) {
  return (
    <label htmlFor={id} style={styles.field}>
      <span style={styles.label}>{label}</span>
      {children}
    </label>
  );
}

export default Register;

const styles = {
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "32px 24px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "32px",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06)",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 600,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    color: "#64748b",
    lineHeight: 1.5,
  },
  error: {
    margin: "0 0 16px",
    padding: "10px 12px",
    fontSize: "13px",
    color: "#b91c1c",
    background: "#fef2f2",
    borderRadius: "8px",
    border: "1px solid #fecaca",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#334155",
  },
  input: {
    padding: "10px 12px",
    fontSize: "14px",
    color: "#0f172a",
    background: "#fff",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
  },
  button: {
    marginTop: "8px",
    padding: "11px 16px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    background: "#0f172a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  footer: {
    margin: "20px 0 0",
    fontSize: "13px",
    color: "#64748b",
    textAlign: "center",
  },
  footerLink: {
    color: "#0f172a",
    fontWeight: 500,
    textDecoration: "none",
  },
};
