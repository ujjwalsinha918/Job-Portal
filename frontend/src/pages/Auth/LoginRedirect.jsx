  import { useEffect, useState } from "react";
  import { useLocation, useNavigate } from "react-router-dom";

  export default function LoginRedirect() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showRoleSelect, setShowRoleSelect] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      const handleOAuthRedirect = async () => {
        try {
          const queryParams = new URLSearchParams(location.search);
          const newUser = queryParams.get("new_user") === "1";
          const success = queryParams.get("success");
          const errorParam = queryParams.get("error");

          console.log("OAuth redirect params:", { newUser, success, errorParam });

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);

          if (errorParam) {
            setError("Authentication failed. Please try again.");
            setLoading(false);
            return;
          }

          if (success !== "oauth_login") {
            setError("Invalid authentication response");
            setLoading(false);
            return;
          }

          if (newUser) {
            // New user - show role selection
            setShowRoleSelect(true);
            setLoading(false);
          } else {
            // Existing user - check role and redirect
            await redirectExistingUser();
          }
        } catch (err) {
          console.error("OAuth redirect error:", err);
          setError("Failed to process authentication");
          setLoading(false);
        }
      };

      const redirectExistingUser = async () => {
        try {
          const response = await fetch("http://localhost:8000/auth/me", {
            credentials: "include"
          });
          

          if (response.ok) {
            const userData = await response.json();
            
            if (userData.role === "jobseeker") {
              navigate("/jobseeker");
            } else if (userData.role === "employer") {
              navigate("/employer");
            } else if (userData.role === "admin") {
              navigate("/admin");
            } else {
              navigate("/unauthorized");
            }
          } else {
            throw new Error("Failed to get user data");
          }
        } catch (err) {
          console.error("Error checking user role:", err);
          navigate("/login?error=auth_failed");
        }
      };

      handleOAuthRedirect();
    }, [location.search, navigate]);

    const handleRoleSelect = async (role) => {
      try {
        const response = await fetch("http://localhost:8000/auth/set-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ role }),
        });
        console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

        if (response.ok) {
          alert(`Welcome! Your role has been set to ${role}.`);
          
          if (role === "jobseeker") {
            navigate("/jobseeker");
          } else if (role === "employer") {
            navigate("/employer");
          }
        } else {
          const errorData = await response.json();
        console.error("Role setting failed:", errorData);
        alert("Failed to set role: " + (errorData.detail || "Unknown error"));
        }
      } catch (err) {
        console.error("Role selection error:", err);
        alert("Failed to set role. Please try again.");
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Processing authentication...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      );
    }

    if (showRoleSelect) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Job Portal!</h2>
              <p className="text-gray-600">
                Your Google account has been connected successfully. Please select your role:
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelect("jobseeker")}
                className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <div className="font-semibold">Job Seeker</div>
                <div className="text-sm text-blue-100">I'm looking for job opportunities</div>
              </button>

              <button
                onClick={() => handleRoleSelect("employer")}
                className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <div className="font-semibold">Employer</div>
                <div className="text-sm text-green-100">I want to post jobs and find candidates</div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }