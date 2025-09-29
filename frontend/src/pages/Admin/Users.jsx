const dummyJobs = [
  { id: 1, title: "Frontend Developer", company: "Tech Corp", status: "Open" },
  { id: 2, title: "Backend Developer", company: "CodeWorks", status: "Closed" },
  { id: 3, title: "UI/UX Designer", company: "DesignHub", status: "Open" },
];

export default function Jobs() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Jobs</h2>
      <ul className="space-y-3">
        {dummyJobs.map((job) => (
          <li key={job.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company}</p>
            <span
              className={`text-xs px-2 py-1 rounded ${
                job.status === "Open"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {job.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
