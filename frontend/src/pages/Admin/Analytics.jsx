import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const userData = [
  { name: "Job Seekers", value: 400 },
  { name: "Employers", value: 200 },
  { name: "Admins", value: 50 },
];

const jobsData = [
  { month: "Jan", jobs: 30 },
  { month: "Feb", jobs: 45 },
  { month: "Mar", jobs: 60 },
  { month: "Apr", jobs: 80 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function Analytics() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Analytics Dashboard</h2>

      <div className="grid grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="p-4 border rounded-lg bg-white shadow">
          <h3 className="font-semibold mb-4">User Distribution</h3>
          <PieChart width={300} height={300}>
            <Pie data={userData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
              {userData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Line Chart */}
        <div className="p-4 border rounded-lg bg-white shadow">
          <h3 className="font-semibold mb-4">Jobs Posted Over Time</h3>
          <LineChart width={400} height={300} data={jobsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="jobs" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
