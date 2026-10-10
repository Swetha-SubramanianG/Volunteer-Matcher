import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireOrgAuth({ children }) {
  const { user, token } = useAuth();
  const location = useLocation();

  // if no token or user or role not organization -> redirect to org login
  if (!token || !user || user.role !== "organization") {
    return <Navigate to="/organization/login" state={{ from: location }} replace />;
  }

  return children;
}