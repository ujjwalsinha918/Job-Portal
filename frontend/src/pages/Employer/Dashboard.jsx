import { Routes, Route } from "react-router-dom";
import { Briefcase, FileText, Users, PlusCircle, Settings } from "lucide-react";
import DashboardNavbar from "../../components/Navbar";
import ModernSidebar from "../../components/ModernSidebar";
import ProtectedRoute from "../../components/ProtectedRoute";

import PostJob from "./PostJob";
import ManageJobs from "./ManageJobs";
import Applications from "./Applications";

export default function EmployerDashboard() {
  // Menu items with icons
  const employerMenu = [
    { 
      label: "Post New Job", 
      path: "/employer/post-job",
      icon: PlusCircle
    },
    { 
      label: "Manage Jobs", 
      path: "/employer/manage-jobs",
      icon: Briefcase
    },
    { 
      label: "Applications", 
      path: "/employer/applications",
      icon: Users
    },
    { 
      label: "Settings", 
      path: "/employer/settings",
      icon: Settings
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <DashboardNavbar userRole="employer" userName="Employer Name" />
      <div className="flex flex-1 overflow-hidden">
        <ModernSidebar items={employerMenu} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            <Routes>
              <Route
                path="post-job"
                element={
                  <ProtectedRoute role="employer">
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manage-jobs"
                element={
                  <ProtectedRoute role="employer">
                    <ManageJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="applications"
                element={
                  <ProtectedRoute role="employer">
                    <Applications />
                  </ProtectedRoute>
                }
              />
              {/* Default Route - Dashboard Overview */}
              <Route
                index
                element={
                  <ProtectedRoute role="employer">
                    <EmployerOverview />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

// Dashboard Overview Component
function EmployerOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your hiring overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Active Jobs"
          value="12"
          icon={Briefcase}
          color="blue"
        />
        <StatsCard
          title="Total Applications"
          value="48"
          icon={Users}
          color="green"
        />
        <StatsCard
          title="New Candidates"
          value="8"
          icon={FileText}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
            <PlusCircle className="text-blue-600 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">Post a New Job</h3>
            <p className="text-sm text-gray-600">Create and publish job listings</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
            <Users className="text-green-600 mb-2" size={24} />
            <h3 className="font-medium text-gray-900">Review Applications</h3>
            <p className="text-sm text-gray-600">Check new candidate applications</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Stats Card Component
function StatsCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}