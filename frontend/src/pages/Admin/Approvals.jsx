import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Briefcase } from "lucide-react";
import api from "../../api/jobs";

export default function Approvals() {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        const res = await api.get("/admin/jobs/pending");
        setPendingJobs(res.data);
      } catch (err) {
        console.error("Error fetching pending jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingJobs();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/jobs/${id}/approve`);
      setPendingJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to approve job");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/jobs/${id}/reject`);
      setPendingJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Rejection error:", err);
      alert("Failed to reject job");
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Job Approvals</h1>
        <p className="text-gray-600 mt-2">Review and approve pending job postings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{pendingJobs.length}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Job List */}
      {pendingJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
          <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Jobs</h3>
          <p className="text-gray-600">All job postings have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <Briefcase size={16} className="mr-1" />
                          {job.location}
                        </span>
                        {job.employer && (
                          <span>Posted by: {job.employer.name}</span>
                        )}
                      </div>
                      <p className="text-gray-700 line-clamp-2">{job.description}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(job.id)}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={20} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(job.id)}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle size={20} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}