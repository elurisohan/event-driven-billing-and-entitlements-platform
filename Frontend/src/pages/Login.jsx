import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token);
      navigate('/home');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const errorMessage =
    loginMutation.error?.message ||
    (loginMutation.isError ? 'Login failed. Please try again.' : null);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.title}>Sign in</h1>
          <p style={styles.subtitle}>Welcome back to TaskFlow.</p>
        </header>

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </Field>

          <button
            type="submit"
            style={styles.button}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" style={styles.footerLink}>
            Create one
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

export default Login;

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px 24px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: '6px 0 0',
    fontSize: '14px',
    color: '#64748b',
    lineHeight: 1.5,
  },
  error: {
    margin: '0 0 16px',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#b91c1c',
    background: '#fef2f2',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#334155',
  },
  input: {
    padding: '10px 12px',
    fontSize: '14px',
    color: '#0f172a',
    background: '#fff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    outline: 'none',
  },
  button: {
    marginTop: '8px',
    padding: '11px 16px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    background: '#0f172a',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  footer: {
    margin: '20px 0 0',
    fontSize: '13px',
    color: '#64748b',
    textAlign: 'center',
  },
  footerLink: {
    color: '#0f172a',
    fontWeight: 500,
    textDecoration: 'none',
  },
};
