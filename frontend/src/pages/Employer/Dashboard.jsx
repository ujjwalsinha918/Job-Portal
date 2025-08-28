import { Routes, Route } from "react-router-dom";
import DashboardNavbar from "../../components/Navbar";
import SidebarMenu from "../../components/SidebarMenu";

import PostJob from "./PostJob";
import ManageJobs from "./ManageJobs";
import Applications from "./Applications";

export default function EmployerDashboard() {
  const employerMenu = [
    { label: "Post Job", path: "/employer/post-job" },
    { label: "Manage Jobs", path: "/employer/manage-jobs" },
    { label: "Applications", path: "/employer/applications" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <DashboardNavbar />
      <div className="flex flex-1">
        <SidebarMenu items={employerMenu} />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="post-job" element={<PostJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="applications" element={<Applications />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
