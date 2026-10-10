import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ THIS WAS MISSING
import { useAuth } from "../../context/AuthContext";
import "../../styles/global.css";
import "./OrgAuth.css";

function OrgSignup() {
  const navigate = useNavigate();                  // ✅ MUST BE DECLARED
  const { orgSignup } = useAuth();

  const [form, setForm] = useState({
    orgName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await orgSignup(form);
      navigate("/organization/login");            // ✅ Now it will work
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="org-auth-container">
      <h2>Create Organization Account</h2>

      <form className="org-auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="orgName"
          placeholder="Organization Name"
          value={form.orgName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="org-auth-btn">
          Sign Up
        </button>
      </form>

      <p className="switch-auth">
        Already have an account?{" "}
        <span onClick={() => navigate("/organization/login")}>
          Log in
        </span>
      </p>
    </div>
  );
}

export default OrgSignup;
