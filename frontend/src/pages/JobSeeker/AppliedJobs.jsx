import JobCard from "../../components/JobCard";

export default function AppliedJobs () {
  const appliedJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Google",
      location: "Remote",
      description: "Build scalable UI with React & Tailwind."
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
     <h1 className="text-2xl font-bold mb-4">Applied Jobs</h1>
     {appliedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appliedJobs.map((job) => (
            <JobCard key={job.id} job={job} onView={() => {}} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
      )}
    </div>
  )
}

