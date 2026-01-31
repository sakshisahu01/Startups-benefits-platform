'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User } from './api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isInitialized = useRef(false);

  const setAuth = useCallback((u: User, t: string) => {
    setToken(t);
    if (typeof window !== 'undefined') localStorage.setItem('token', t);
    setUser(u);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initAuth = async () => {
      setLoading(true);
      const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!t) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }
      setToken(t);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      try {
        const response = await fetch(`${API_BASE}/auth/me`, { 
          headers: { Authorization: `Bearer ${t}` }, 
          credentials: 'include' 
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
