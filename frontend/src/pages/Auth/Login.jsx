import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock, AiOutlineGoogle } from "react-icons/ai";

export default function Login() {
  const [oauthError, setOauthError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const success = urlParams.get("success");
    const email = urlParams.get("email");

    if (error) {
      const errorMessages = {
        state_mismatch:
          "Authentication failed due to security validation. Please try again.",
        token_exchange_failed:
          "Failed to complete Google authentication. Please try again.",
        user_info_failed: "Could not retrieve user information from Google.",
        network_error:
          "Network error during authentication. Please check your connection.",
        no_email: "Google account does not have an associated email address.",
        database_error: "Server error during login. Please try again later.",
        authentication_failed:
          "Google authentication failed. Please try again.",
        login_processing_failed: "Failed to process login. Please try again.",
      };
      setOauthError(errorMessages[error] || "Authentication failed.");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (success === "oauth_login") {
      alert(`Google login successful! Welcome ${email || "user"}!`);
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => navigate("/dashboard"), 1000);
    }
  }, [navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/auth/login", values, {
        withCredentials: true,
      });
      const role = res.data.role;
      if (role === "jobseeker") navigate("/jobseeker");
      else if (role === "employer") navigate("/employer");
      else if (role === "admin") navigate("/admin");
      else navigate("/unauthorized");
    } catch (err) {
      setOauthError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setOauthError("");
    window.location.href = "http://localhost:8000/auth/login/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white shadow-xl p-10 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Login</h2>

        {oauthError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {oauthError}
          </div>
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div className="relative">
                <AiOutlineMail className="absolute top-3 left-3 text-gray-400" />
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  autoFocus
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="relative">
                <AiOutlineLock className="absolute top-3 left-3 text-gray-400" />
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <p className="text-gray-500 mb-3">Or login with</p>
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition"
          >
            <AiOutlineGoogle className="mr-2" /> Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}
