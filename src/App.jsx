import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import OrgDashboard from "./pages/OrgDashboard";
import TaskPage from "./pages/TaskPage";      // shows list of tasks
import TaskDetailsPage from "./pages/TaskDetailsPage";  // shows single task
import VolunteerRegistration from "./components/registration/VolunteerRegistration";
import AuthPage from "./pages/AuthPage";
import VolunteerOpportunityDetails from "./pages/VolunteerOpportunityDetails";
import OrganizationOpportunities from "./pages/OrganizationOpportunities";
import OrgSignIn from "./pages/OrgSignIn";
import OrgSignUp from "./pages/OrgSignUp";
import RequireOrgAuth from "./components/RequireOrgAuth";
import MyApplications from "./pages/MyApplications";
import MapPage from "./pages/MapPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/volunteer/opportunity/:id" element={<VolunteerOpportunityDetails />} />
          <Route
            path="/organization"
            element={
              <RequireOrgAuth>
                <OrgDashboard />
              </RequireOrgAuth>
            }
          />
          <Route path="/organization/login" element={<OrgSignIn />} />
          <Route path="/organization/signup" element={<OrgSignUp />} />
          <Route
            path="/organization/:id/opportunities"
            element={
              <RequireOrgAuth>
                <OrganizationOpportunities />
              </RequireOrgAuth>
            }
          />

          {/* ✅ Task Routes */}
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />

          <Route path="/my-applications" element={<MyApplications />} />

          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/register" element={<VolunteerRegistration />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
