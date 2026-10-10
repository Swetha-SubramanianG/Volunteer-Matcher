import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/global.css";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) =>
    location.pathname === path ? "nav-item active" : "nav-item";

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="page-navbar">
      <div className="nav-logo">Volunteer Matcher</div>
      <div className="nav-links">
        <Link to="/" className={isActive("/")}>
          Home
        </Link>
        <Link to="/volunteer" className={isActive("/volunteer")}>
          Volunteer
        </Link>
        <Link to="/organization" className={isActive("/organization")}>
          Organizations
        </Link>
        <Link to="/tasks" className={isActive("/tasks")}>
          Tasks
        </Link>
        <Link to="/map" className={isActive("/map")}>
          Map
        </Link>
      </div>
      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            {user?.role === 'volunteer' && (
              <Link to="/my-applications" className="nav-link">My Applications</Link>
            )}
            <span className="nav-user-name">Hi, {user?.fullName}</span>
            <button className="nav-btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn-outline">Sign In</Link>
            
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
