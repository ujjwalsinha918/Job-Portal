import React, { useEffect, useState } from "react";
import { getJobs, updateJob, deleteJob } from "../../api/jobs";
import ProtectedRoute from "../../components/ProtectedRoute"; // <-- wrap in ProtectedRoute

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
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <div>Loading jobs...</div>;
  if (jobs.length === 0) return <div>No jobs posted yet.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Jobs</h2>
      <ul className="space-y-2">
        {jobs.map((job) => (
          <li key={job.id} className="border p-2 flex flex-col">
            {editingJob === job.id ? (
              <>
                <input
                  className="border p-1 mb-2"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <textarea
                  className="border p-1 mb-2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <input
                  className="border p-1 mb-2"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
                <div>
                  <button
                    onClick={() => handleUpdate(job.id)}
                    className="text-green-500 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingJob(null)}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span>{job.title}</span>
                <div>
                  <button
                    onClick={() => handleEdit(job)}
                    className="text-blue-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
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
