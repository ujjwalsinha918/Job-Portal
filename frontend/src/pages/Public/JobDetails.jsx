import { useParams } from "react-router-dom";

export default function JobDetails(){
  const { id } = useParams(); // Get jobId from URL (e.g. /jobs/1 → id=1)
  
  // Dummy job data (later replace with API call using id)
  const job = {
    id,
    title: "Frontend Developer",
    company: "Google",
    location: "Remote",
    description: "You will build scalable UI with React, Tailwind, and TypeScript...",
    requirements: ["React", "Tailwind", "API integration"],
    salary: "₹15-25 LPA"
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Job Title */}
      <h1 className="text-3xl font-bold">{job.title}</h1>

      {/* Company + Location */}
      <p className="text-gray-600">
        {job.company} • {job.location}
      </p>

      {/* Job Description */}
      <p className="mt-4 text-gray-700">{job.description}</p>

      {/* Job Requirements */}
      <h3 className="mt-6 font-semibold">Requirements:</h3>
      <ul className="list-disc list-inside">
        {job.requirements.map((req, idx) => (
          <li key={idx}>{req}</li>
        ))}
      </ul>

      {/* Salary */}
      <p className="mt-4">
        <strong>Salary:</strong> {job.salary}
      </p>

      {/* Apply button (later connect to /applications/apply API) */}
      <button className="mt-6 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
        Apply Now
      </button>
    </div>
  )
}