const dummyApprovals = [
  { id: 1, type: "Job Post", requestBy: "Tech Corp", status: "Pending" },
  { id: 2, type: "Employer Registration", requestBy: "CodeWorks", status: "Approved" },
  { id: 3, type: "Job Post", requestBy: "DesignHub", status: "Rejected" },
];

export default function Approvals() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Approvals</h2>
      <ul className="space-y-3">
        {dummyApprovals.map((req)=> (
          <li key={req.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <p><strong>Type:</strong>{req.type}</p>
            <p><strong>Requested By:</strong> {req.requestBy}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 text-xs rounded ${
                  req.status === "Pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : req.status === "Approved"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {req.status}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
