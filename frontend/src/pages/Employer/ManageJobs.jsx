import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Save, X, Briefcase } from "lucide-react";
import { getJobs, updateJob, deleteJob } from "../../api/jobs";
import ProtectedRoute from "../../components/ProtectedRoute";

function ManageJobsContent() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleEdit = (job) => {
    setEditingJob(job.id);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const updated = await updateJob(id, formData);
      setJobs((prev) => prev.map((job) => (job.id === id ? updated : job)));
      setEditingJob(null);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update job");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete job");
    }
  };

  const handleCancel = () => {
    setEditingJob(null);
    setFormData({ title: "", description: "", location: "" });
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
        <p className="text-gray-600 mt-2">Edit or remove your job postings</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
        <div className="flex items-center space-x-3">
          <Briefcase className="text-blue-600" size={24} />
          <div>
            <p className="text-sm text-gray-600">Total Active Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
          <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Posted</h3>
          <p className="text-gray-600 mb-4">Start by posting your first job</p>
          <button
            onClick={() => window.location.href = "/employer/post-job"}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Post a Job
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {editingJob === job.id ? (
                // Edit Mode
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Job</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        <X size={18} />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={() => handleUpdate(job.id)}
                        className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Save size={18} />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{job.location}</p>
                      <p className="text-gray-700 line-clamp-2">{job.description}</p>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(job)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Job"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManageJobs() {
  return (
    <ProtectedRoute role="employer">
      <ManageJobsContent />
    </ProtectedRoute>
  );
}