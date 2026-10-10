import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import "../styles/org-auth.css";

export default function OrgSignIn() {
  const { orgSignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await orgSignIn({ email, password });
      if (data && data.user && data.user.id) {
        navigate(`/organization/${data.user.id}/opportunities`, { replace: true });
      } else {
        const from = location.state?.from?.pathname || "/organization";
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Organization login failed");
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
            <div className="tab active">Login</div>
            <Link to="/organization/signup" className="tab">Sign Up</Link>
          </div>

          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-sub">Organization sign in</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="form-label">
              Email
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                required
              />
            </label>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>

            {error && <p className="form-error">{error}</p>}
          </form>

          <div className="auth-footer">
            <p>
              Don't have an organization account?{" "}
              <Link to="/organization/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}