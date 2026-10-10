import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import "../styles/auth.css";

export default function AuthPage() {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  // Signup state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Shared UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await register({ fullName, email, password, confirmPassword });
      if (result?.success) {
        navigate("/tasks", { replace: true });
      } else {
        setError(result.error || "Signup failed");
      }
    } catch (err) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Email and password required");
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result?.success) {
        navigate("/tasks", { replace: true });
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={activeTab === "login" ? "tab active" : "tab"}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={activeTab === "signup" ? "tab active" : "tab"}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="form-error">{error}</div>}

          {activeTab === "signup" ? (
            <form onSubmit={handleSignupSubmit} className="auth-form">
              <h2 className="auth-title">Create Account</h2>
              <label className="form-label">
                Full Name
                <input
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </label>

              <label className="form-label">
                Email
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="form-label">
                Password
                <input
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
              </label>

              <label className="form-label">
                Confirm Password
                <input
                  className="form-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                />
              </label>

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Sign Up"}
              </button>

              <p className="auth-footer">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  style={{ background: "none", border: "none", color: "#5b3bfd", cursor: "pointer", textDecoration: "underline" }}
                >
                  Login
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <h2 className="auth-title">Welcome Back</h2>
              <label className="form-label">
                Email
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="form-label">
                Password
                <input
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                />
              </label>

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </button>

              <p className="auth-footer">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  style={{ background: "none", border: "none", color: "#5b3bfd", cursor: "pointer", textDecoration: "underline" }}
                >
                  Sign up
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}