import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Plans from './pages/Plans.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

/*const secondaryNavLinks = [
  { to: '/signup', label: 'Sign up' },
  { to: '/home', label: 'Home' },
  { to: '/plans', label: 'Plans' },
];

function AppNav() {
  const { pathname } = useLocation();

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        {secondaryNavLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              ...styles.navLink,
              ...(pathname === to ? styles.navLinkActive : {}),
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function AppShell() {
  return (
    <div style={styles.app}>
      <AppNav />
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/plans" element={<Plans />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f8fafc',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    background: '#fff',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    fontSize: '15px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#475569',
    fontWeight: 500,
  },
  navLinkActive: {
    color: '#0f172a',
    fontWeight: 600,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
};
*/
import React, { useState, useRef } from 'react';

function TimerAndFocus() {
  const [seconds, setSeconds] = useState(0);
  
  // 1. Storing a DOM reference
  const inputRef = useRef(null);

  // 2. Storing mutable data (Interval ID) without triggering re-renders
  const timerIdRef = useRef(null);

  const startTimer = () => {
    if (timerIdRef.current !== null) return;
    
    timerIdRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerIdRef.current);
    timerIdRef.current = null; // Mutating ref.current does NOT re-render the component
  };

  const focusInput = () => {
    // Directly focus the input DOM node
    inputRef.current.focus();
  };

  return (
    <div>
      <h2>Timer: {seconds}s</h2>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>

      <hr />

      <input ref={inputRef} type="text" placeholder="Type something..." />
      <button onClick={focusInput}>Focus Input Field</button>
    </div>
  );
}

export default TimerAndFocus;
