// JobCard.jsx
// ✅ Reusable component that displays a single job card with title, company, location, description, and "View Details" button.

export default function JobCard({ job, onView }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
      {/* Job Title */}
      <h2 className="text-xl font-semibold">{job.title}</h2>

      {/* Company name + job location */}
      <p className="text-gray-600">
        {job.company} • {job.location}
      </p>

      {/* Short job description (2 lines max, rest truncated with line-clamp) */}
      <p className="text-gray-500 line-clamp-2">{job.description}</p>

      {/* Button to view job details (navigates to JobDetails page) */}
      <button
        onClick={() => onView(job.id)} // When clicked, call parent function with jobId
        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        View Details
      </button>
    </div>
  );
}
