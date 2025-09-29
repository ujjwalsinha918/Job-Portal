import { useEffect, useState } from "react";
import api from "../../api/jobs";

export default function Approvals() {
  const [pendingJobs, setPendingJobs] = useState([]);

  useEffect(() => {
    const fetchPendingJobs = async () => {
      const res = await api.get("/admin/jobs/pending"); // fetch pending jobs
      setPendingJobs(res.data);
    };
    fetchPendingJobs();
  }, []);

  const handleApprove = async (id) => {
    await api.put(`/admin/jobs/${id}/approve`); // approve job
    setPendingJobs((prev) => prev.filter((job) => job.id !== id));// remove from UI
  };

  const handleReject = async (id) => {
    await api.put(`/admin/jobs/${id}/reject`); // reject job
    setPendingJobs((prev) => prev.filter((job) => job.id !== id));// remove from UI
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Job Approvals</h2>
      <ul className="space-y-3">
        {pendingJobs.map((job) => (
          <li key={job.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <p><strong>Title:</strong> {job.title}</p>
            {/* <p><strong>Posted by:</strong> {job.employer.name}</p> */}
            <button onClick={() => handleApprove(job.id)} className="mr-2 bg-green-200 p-2 rounded">Approve</button>
            <button onClick={() => handleReject(job.id)} className="bg-red-200 p-2 rounded">Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
