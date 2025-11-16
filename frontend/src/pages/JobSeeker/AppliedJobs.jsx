import React, { useEffect, useState } from "react";
import { Clock, MapPin, Building, Calendar, CheckCircle, XCircle } from "lucide-react";
import { getMyApplications } from "../../api/jobs";
import ProtectedRoute from "../../components/ProtectedRoute";

function AppliedJobsContent() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-2">Track the status of your job applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Applied" value={stats.total} color="blue" />
        <StatsCard title="Pending" value={stats.pending} color="yellow" />
        <StatsCard title="Accepted" value={stats.accepted} color="green" />
        <StatsCard title="Rejected" value={stats.rejected} color="red" />
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
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

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
          <Building className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === "all" ? "No Applications Yet" : `No ${filter} Applications`}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === "all" 
              ? "Start applying to jobs to see them here"
              : "No applications match your current filter"}
          </p>
          {filter === "all" && (
            <button
              onClick={() => window.location.href = "/jobseeker/jobs"}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Jobs
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {app.job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Building size={16} className="mr-1" />
                        <span>{app.job.company}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        <span>{app.job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        <span>Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <StatusBadge status={app.status} />
                  </div>
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

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    accepted: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
  };

  const icons = {
    pending: <Clock size={16} />,
    accepted: <CheckCircle size={16} />,
    rejected: <XCircle size={16} />,
  };

  return (
    <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
      {icons[status]}
      <span className="capitalize">{status}</span>
    </span>
  );
}

export default function AppliedJobs() {
  return (
    <ProtectedRoute role="jobseeker">
      <AppliedJobsContent />
    </ProtectedRoute>
  );
}