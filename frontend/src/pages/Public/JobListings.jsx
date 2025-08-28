// JobListings.jsx
// ✅ Page that lists all available jobs. For now, uses dummy jobs. Later → fetch from backend API.

import { useNavigate } from "react-router-dom";
import JobCard from "../../components/JobCard";

export default function JobListings() {
  const navigate = useNavigate(); // React Router hook to navigate programmatically

  // Dummy job data (this will be replaced by API data later)
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Google",
      location: "Remote",
      description: "Build UI with React & Tailwind."
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "Amazon",
      location: "Bangalore",
      description: "Work with FastAPI & PostgreSQL."
    },
  ];

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>

      {/* Display jobs in grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map(job => (
          // Pass job data to JobCard
          // onView = navigate to details page of that job (dynamic route: /jobs/:id)
          <JobCard
            key={job.id}
            job={job}
            onView={(id) => navigate(`/jobs/${id}`)}
          />
        ))}
      </div>
    </div>
  );
}
