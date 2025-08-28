const dummyUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Job Seeker" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Employer" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Admin" },
];

export default function Users() {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {dummyUsers.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
    )
}