import { Routes, Route } from "react-router-dom";
import DashboardNavbar from "../../components/Navbar";
import SidebarMenu from "../../components/ModernSidebar";
import ProtectedRoute from "../../components/ProtectedRoute";

import Users from "./Users";
import Jobs from "./Jobs";
import Analytics from "./Analytics";
import Approvals from "./Approvals";

export default function AdminDashboard() {
  const adminMenu = [
    { label: "Users", path: "/admin/users" },
    { label: "Jobs", path: "/admin/jobs" },
    { label: "Analytics", path: "/admin/analytics" },
    { label: "Approvals", path: "/admin/approvals" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <DashboardNavbar />
      <div className="flex flex-1">
        <SidebarMenu items={adminMenu} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route
              path="users"
              element={
                <ProtectedRoute role="admin">
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="jobs"
              element={
                <ProtectedRoute role="admin">
                  <Jobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="analytics"
              element={
                <ProtectedRoute role="admin">
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="approvals"
              element={
                <ProtectedRoute role="admin">
                  <Approvals />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
