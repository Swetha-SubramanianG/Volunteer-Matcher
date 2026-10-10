import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import "./OrgAuth.css";

const OrgLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Logging in:", email, password);

    navigate("/organization"); // ✅ correct route
  };

  return (
    <>
      <Navbar />

      <div className="org-auth-container">
        <div className="org-auth-card">
          <div className="auth-tabs">
            <button className="active-tab">Login</button>
            <button onClick={() => navigate("/organization/signup")}>Sign Up</button>
          </div>

          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to your account</p>

          <form className="auth-form" onSubmit={handleLogin}>
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="auth-btn" type="submit">
              Login
            </button>
          </form>

          <p className="auth-footer">
            Don’t have an account?{" "}
            <span className="auth-link" onClick={() => navigate("/organization/signup")}>
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default OrgLogin;
