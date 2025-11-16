import { Routes, Route } from "react-router-dom";
import DashboardNavbar from "../../components/Navbar";
import SidebarMenu from "../../components/ModernSidebar";
import JobListing from "./JobListing";
import Profile from "./Profile";
import AppliedJobs from "./AppliedJobs";
import ProtectedRoute from "../../components/ProtectedRoute";
import SavedJobs from "./SavedJobs";

export default function JobSeekerDashboard() {
  const jobSeekerMenu = [
    { label: "Profile", path: "/jobseeker/profile" },
    { label: "Browse Jobs", path: "/jobseeker/jobs" },
    { label: "Applied Jobs", path: "/jobseeker/applied-jobs" },
    { label: "Saved Jobs", path: "/jobseeker/saved-jobs" }, // ✅ corrected path casing
    {
      label: "Charts",
      submenu: [
        { label: "Pie charts", path: "/jobseeker/charts/pie" },
        { label: "Line charts", path: "/jobseeker/charts/line" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <DashboardNavbar />
      <div className="flex flex-1">
        <SidebarMenu items={jobSeekerMenu} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route
              path="profile"
              element={
                <ProtectedRoute role="jobseeker">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="applied-jobs"
              element={
                <ProtectedRoute role="jobseeker">
                  <AppliedJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="jobs"
              element={
                <ProtectedRoute role="jobseeker">
                  <JobListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="saved-jobs"
              element={
                <ProtectedRoute role="jobseeker">
                  <SavedJobs />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
