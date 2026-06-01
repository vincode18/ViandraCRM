import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../utils/api';
import { syncUserToSupabase } from '../utils/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ut_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('ut_token') || null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(token && user);

  const login = useCallback(async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password, rememberMe });
      const { data } = res.data;

      localStorage.setItem('ut_token', data.token);
      localStorage.setItem('ut_user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      // Sync to Supabase app_users table (fire-and-forget)
      syncUserToSupabase(data.user, new Date().toISOString());

      return { success: true, user: data.user };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        'Login failed. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Swallow – always clear local state
    }
    localStorage.removeItem('ut_token');
    localStorage.removeItem('ut_user');
    setToken(null);
    setUser(null);
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ut_token' && !e.newValue) {
        setToken(null);
        setUser(null);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
