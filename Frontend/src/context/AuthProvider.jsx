import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

export function Authprovider({ children }) {
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('token') ?? null;
  });

  useEffect(() => {
    const handleLogout = () => setToken(null);
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = (newToken) => {
    sessionStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
