import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Organization from "../pages/Organization/Organization";
import OrgDashboard from "../pages/Organization/OrgDashboard";
import OrganizationOpportunities from "../pages/Organization/OrganizationOpportunities";

const OrgRoutes = () => {
  return (
    <Routes>
      <Route path="/organization" element={<Organization />}>
        <Route index element={<OrgDashboard />} />
        <Route path="opportunities" element={<OrganizationOpportunities />} />
      </Route>

      <Route path="*" element={<Navigate to="/organization" />} />
    </Routes>
  );
};

export default OrgRoutes;
