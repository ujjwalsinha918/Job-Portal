import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import JobCard from "../../components/JobCard";
import { getSavedJobs, applyForJob, unsaveJob } from "../../api/jobs";

function SavedJobsContent() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const jobs = await getSavedJobs();
        setSavedJobs(jobs);
        // If your backend returns `applications` info, map applied jobs
        const appliedIds = new Set(jobs.filter(j => j.hasApplied).map(j => j.id));
        setAppliedJobIds(appliedIds);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleApply = async (jobId) => {
    if (appliedJobIds.has(jobId)) return alert("Already applied");
    try {
      await applyForJob(jobId);
      setAppliedJobIds(prev => new Set([...prev, jobId]));
      alert("Applied successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!savedJobs.length)
    return <div className="text-center mt-12">No saved jobs yet!</div>;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {savedJobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          hasApplied={appliedJobIds.has(job.id)}
          onApply={handleApply}
          isSaved={true}
          onSave={() => handleUnsave(job.id)}
        />
      ))}
    </div>
  );
}

export default function SavedJobs() {
  return (
    <ProtectedRoute role="jobseeker">
      <SavedJobsContent />
    </ProtectedRoute>
  );
}
