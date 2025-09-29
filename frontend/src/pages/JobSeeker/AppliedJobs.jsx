import React, { useEffect, useState } from "react";
import { getMyApplications } from "../../api/jobs";
import JobCard from "../../components/JobCard";
import ProtectedRoute from "../../components/ProtectedRoute"; // <-- wrap in ProtectedRoute

function AppliedJobsContent() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading your applications...</div>;
  if (applications.length === 0)
    return <div>You haven’t applied to any jobs yet.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      <ul className="space-y-4">
        {applications.map((app) => (
          <li key={app.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{app.job.title}</h2>
            <p className="text-gray-600">{app.job.company}</p>
            <p className="text-gray-600">{app.job.location}</p>
            <p className="text-sm text-gray-500">
              Applied on: {new Date(app.applied_at).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">Status: {app.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AppliedJobs() {
  return (
    <ProtectedRoute role="jobseeker">
      <AppliedJobsContent />
    </ProtectedRoute>
  );
}
