import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import "./Organization.css";

const Organization = () => {
  return (
    <div className="organization-layout">
      <Navbar />

      <div className="organization-content">
        {/* This renders child routes like Dashboard, Opportunities, etc */}
        <Outlet />
      </div>
    </div>
  );
};

export default Organization;
