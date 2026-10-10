import React from "react";
import OrgNavbar from "../components/OrgNavbar";
import TaskManagementModule from "../components/organization/TaskManagementModule";

export default function OrgDashboard() {
  return (
    <>
      <OrgNavbar />
      <div className="org-dashboard-content">
        <TaskManagementModule />
      </div>
    </>
  );
}
