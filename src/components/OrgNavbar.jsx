import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OrgNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/organization/login");
  };

  return (
    <nav className="org-navbar">
      <div className="org-brand">Organization Dashboard</div>
      <div className="org-links">
        <NavLink to="/organization" end className={({isActive}) => isActive ? "nav-active" : ""}>Dashboard</NavLink>
        <NavLink to="/organization/opportunities" className={({isActive}) => isActive ? "nav-active" : ""}>Opportunities</NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? "nav-active" : ""}>Tasks</NavLink>
        <button className="btn-ghost" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}