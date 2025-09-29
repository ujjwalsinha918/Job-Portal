// Import core routing components from react-router-dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Import all page components
import Landing from "./pages/Public/Landing";
import Login from "./pages/Auth/Login";
import Unauthorized from "./pages/Auth/Unauthorized";
import Register from "./pages/Auth/Register";
import JobSeekerDashboard from "./pages/JobSeeker/Dashboard";  // ✅ fixed: should be JobSeeker/Dashboard
import Profile from "./pages/JobSeeker/Profile";
import AppliedJobs from "./pages/JobSeeker/AppliedJobs"; // ✅ fixed: should
import PostJob from "./pages/Employer/PostJob";
import Applications from "./pages/Employer/Applications";
import ManageJobs from "./pages/Employer/ManageJobs";
import EmployerDashboard from "./pages/Employer/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";
import Analytics from "./pages/Admin/Analytics";
import Approvals from "./pages/Admin/Approvals";
import LoginRedirect from "./pages/Auth/LoginRedirect";
import JobListing from "./pages/JobSeeker/JobListing";



function App() {
  return (
    <Router>
      {/* Routes define which component will render for each URL */}
      <Routes>

        {/* Public Landing Page (default route when user visits "/") */}
        <Route path="/" element={<Landing />} />
        <Route path="/oauth-redirect" element={<LoginRedirect />} />


        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} /> 
        <Route path="/register" element={<Register />} />

        
        {/* Role-based Protected Routes */}
        <Route 
          path="/jobseeker/*"
          element={
            <ProtectedRoute role="jobseeker">
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
          />
        <Route path="/jobseeker/jobs" element={<JobListing />} />
        <Route path="/jobseeker/profile" element={<Profile />} />
        <Route path="/jobseeker/applied-jobs" element={<AppliedJobs />} />
        <Route path="/employer/post-job" element={<PostJob />} />
        <Route path="/employer/applications" element={<Applications />} />
        <Route path="/employer/manage-jobs" element={<ManageJobs />} />
        
        <Route
          path="/employer/*"
          element={
            <ProtectedRoute role="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/approvals" element={<Approvals />} />
      </Routes>
    </Router>
  );
}

export default App;
