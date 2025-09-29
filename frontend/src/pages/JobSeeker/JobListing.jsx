import { useEffect, useState } from "react";
import { getJobs, applyForJob } from "../../api/jobs";
import JobCard from "../../components/JobCard";
import ProtectedRoute from "../../components/ProtectedRoute"; // <-- wrap in ProtectedRoute

function JobListingContent() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div>Loading jobs...</div>;
  if (jobs.length === 0) return <div>No jobs found.</div>;

  const handleApply = async (jobId) => {
    try {
      await applyForJob(jobId);
      alert("Applied successfully!");
    } catch (err) {
      console.error("Application error:", err.response?.data || err);
      alert("Failed to apply. Try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onView={() => {}}
            onApply={handleApply}
          />
        ))}
      </div>
    </div>
  );
}

export default function JobListing() {
  return (
    <ProtectedRoute role="jobseeker">
      <JobListingContent />
    </ProtectedRoute>
  );
}
