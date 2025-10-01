import React, { useEffect, useState } from "react";
import { Users, Mail, Calendar, Filter } from "lucide-react";
import { getEmployerApplications } from "../../api/jobs";
import ProtectedRoute from "../../components/ProtectedRoute";
import axios from "axios";

function EmployerApplicationsContent() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getEmployerApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/applications/${applicationId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update application status");
    }
  };

  const filteredApplications = applications.filter((app) =>
    filter === "all" ? true : app.status === filter
  );

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-600 mt-2">Manage candidates who applied to your jobs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total" value={stats.total} color="blue" />
        <StatsCard title="Pending" value={stats.pending} color="yellow" />
        <StatsCard title="Accepted" value={stats.accepted} color="green" />
        <StatsCard title="Rejected" value={stats.rejected} color="red" />
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <Filter size={20} className="text-gray-600" />
          <div className="flex space-x-2">
            {["all", "pending", "accepted", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No {filter !== "all" && filter} Applications
          </h3>
          <p className="text-gray-600">No applications match your current filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                {/* Applicant Info */}
                <div className="flex-1 mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {app.job.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users size={16} className="mr-2" />
                      <span className="font-medium">{app.jobseeker.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2" />
                      <a
                        href={`mailto:${app.jobseeker.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {app.jobseeker.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span>Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="flex flex-col items-end">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Application Status
                  </label>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      app.status === "pending"
                        ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                        : app.status === "accepted"
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-red-300 bg-red-50 text-red-700"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatsCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

export default function Applications() {
  return (
    <ProtectedRoute role="employer">
      <EmployerApplicationsContent />
    </ProtectedRoute>
  );
}