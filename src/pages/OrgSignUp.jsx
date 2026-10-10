import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import "../styles/org-auth.css";

export default function OrgSignUp() {
  const { orgSignUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFile = (e) => {
    setCertificate(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!certificate) {
      setError("Please upload an organization certificate.");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("password", password);
      form.append("certificate", certificate);

      const data = await orgSignUp(form);

      if (data && data.user && data.user.id) {
        navigate(`/organization/${data.user.id}/opportunities`, { replace: true });
        return;
      }

      navigate("/organization/login", { replace: true });
    } catch (err) {
      setError(err.message || "Signup failed");
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
            <Link to="/organization/login" className="tab">Login</Link>
            <div className="tab active">Sign Up</div>
          </div>

          <h2 className="auth-title">Create Organization Account</h2>
          <p className="auth-sub">Upload your organization certificate for verification</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="form-label">
              Organization Name
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Organization name"
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
                placeholder="Create a password"
                required
              />
            </label>

            <label className="form-label">
              Organization Certificate (PDF / Image)
              <input
                className="form-input"
                type="file"
                accept=".pdf,image/*"
                onChange={handleFile}
                required
              />
            </label>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Sign up"}
            </button>

            {error && <p className="form-error">{error}</p>}
          </form>

          <div className="auth-footer">
            <p>
              Already registered? <Link to="/organization/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}