import React, { useEffect, useState } from "react";
import { getEmployerApplications } from "../../api/jobs";
import ProtectedRoute from "../../components/ProtectedRoute"; // <-- import
import axios from "axios";


function EmployerApplicationsContent() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
      { withCredentials: true } // include cookie
    );

    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  } catch (err) {
    console.error("Failed to update status:", err);
  }
};


  if (loading) return <div>Loading applications...</div>;
  if (applications.length === 0) return <div>No one has applied yet.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Applicants</h2>
      <ul className="space-y-2">
        {applications.map((app) => (
          <li key={app.id} className="border p-2">
            <strong>{app.job.title}</strong> – {app.jobseeker.name} ({app.jobseeker.email}) applied on{" "}
            {new Date(app.applied_at).toLocaleDateString()}

            {/* status dropdown for employer */}
            <div className="mt-2">
              <label className="mr-2">Status:</label>
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                className="border rounded p-1"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>  
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Wrap in ProtectedRoute for role-based access
export default function Applications() {
  return (
    <ProtectedRoute role="employer">
      <EmployerApplicationsContent />
    </ProtectedRoute>
  );
}
