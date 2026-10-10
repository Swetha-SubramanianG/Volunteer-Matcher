import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Temporary hardcoded backend URL for debugging — remove once .env works
const API_BASE = "http://localhost:5000";

console.log("🔍 DEBUG API_BASE:", API_BASE);
console.log("🔍 import.meta.env:", import.meta.env);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // VOLUNTEER LOGIN
  const login = async (email, password) => {
    try {
      console.log('Volunteer login:', `${API_BASE}/api/volunteer/login`);
      const res = await fetch(`${API_BASE}/api/volunteer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let msg = text;
        try { msg = JSON.parse(text).message || text; } catch {}
        throw new Error(msg || `${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      // call saveAuth to persist login state
      saveAuth(data);
      return { success: true, data };
    } catch (error) {
      console.error("Volunteer login error:", error);
      return { success: false, error: error.message };
    }
  };

  // VOLUNTEER REGISTER (SIGNUP)
  const register = async (userData) => {
    try {
      console.log('Volunteer register:', `${API_BASE}/api/volunteer/signup`, userData);
      const res = await fetch(`${API_BASE}/api/volunteer/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword
        })
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let msg = text;
        try { msg = JSON.parse(text).message || text; } catch {}
        throw new Error(msg || `${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      // call saveAuth to persist signup state
      saveAuth(data);
      return { success: true, data };
    } catch (error) {
      console.error("Volunteer register error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // ORGANIZATION SIGN-IN
  async function orgSignIn({ email, password }) {
    try {
      console.log('Org login:', `${API_BASE}/api/org/login`);
      const res = await fetch(`${API_BASE}/api/org/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let msg = text;
        try { msg = JSON.parse(text).message || text; } catch {}
        throw new Error(msg || `${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      console.error("Org login error:", err);
      throw err;
    }
  }

  // ORGANIZATION SIGN-UP
  async function orgSignUp(formData) {
    try {
      console.log('Org signup:', `${API_BASE}/api/org/signup`);
      const res = await fetch(`${API_BASE}/api/org/signup`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let msg = text;
        try { msg = JSON.parse(text).message || text; } catch {}
        throw new Error(msg || `${res.status} ${res.statusText}`);
      }

      const data = await res.json().catch(() => null);
      if (data && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      console.error("Org signup error:", err);
      throw err;
    }
  }

  // VERIFY SESSION
  async function verifySession() {
    const t = localStorage.getItem("token");
    if (!t) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      if (!res.ok) throw new Error("session invalid");
      const data = await res.json();
      setToken(t);
      setUser(data.user);
    } catch {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  // call this after successful login/register
  const saveAuth = (data) => {
    if (data?.token) {
      setToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem('token', data.token);
    }
    if (data?.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    orgSignIn,
    orgSignUp,
    verifySession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

