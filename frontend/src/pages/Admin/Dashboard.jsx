import { Routes, Route } from "react-router-dom";
import DashboardNavbar from "../../components/Navbar";
import SidebarMenu from "../../components/SidebarMenu";

import Users from "./Users";
import Jobs from "./Jobs"
import Analytics from "./Analytics";
import Approvals from "./Approvals";

export default function AdminDashboard() {
    const adminMenu = [
    { label: "Users", path: "/admin/dashboard/users" },
    { label: "Jobs", path: "/admin/dashboard/jobs" },
    { label: "Analytics", path: "/admin/dashboard/analytics" },
    { label: "Approvals", path: "/admin/dashboard/approvals" },
    ];

    return (
        <div className="flex flex-col h-screen">
            <DashboardNavbar />
            <div className="flex flex-1">
                <SidebarMenu items={adminMenu} />
                <main className="flex-1 p-6 overflow-y-auto">
                  <Routes>
                    <Route path="users" element={<Users />} />
                    <Route path="jobs" element={<Jobs />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="approvals" element={<Approvals />} />
                  </Routes>
                </main>    
            </div>
        </div>
    )
}