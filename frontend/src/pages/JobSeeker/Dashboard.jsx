import { Routes, Route } from "react-router-dom";
import DashboardNavbar from "../../components/Navbar";
import SidebarMenu from "../../components/SidebarMenu";

function Profile() {
  return <h2 className="text-xl font-bold">My Profile</h2>;
}
function AppliedJobs() {
  return <h2 className="text-xl font-bold">Applied Jobs</h2>;
}

export default function JobSeekerDashboard() {
  const jobSeekerMenu = [
    { label: "Profile", path: "/jobseeker/profile" },
    { label: "Applied Jobs", path: "/jobseeker/applied-jobs" },
    {
      label: "Charts",
      submenu: [
        { label: "Pie charts", path: "/jobseeker/charts/pie" },
        { label: "Line charts", path: "/jobseeker/charts/line" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <DashboardNavbar />
      <div className="flex flex-1">
        <SidebarMenu items={jobSeekerMenu} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="profile" element={<Profile />} />
            <Route path="applied-jobs" element={<AppliedJobs />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
