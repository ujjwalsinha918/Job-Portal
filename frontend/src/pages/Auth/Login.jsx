import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock, AiOutlineGoogle, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Login() {
  const [oauthError, setOauthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-6 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2 transition">
            ← Back to Home
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white shadow-2xl p-8 md:p-10 rounded-3xl backdrop-blur-sm bg-opacity-95">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <AiOutlineLock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          {/* Error Message */}
          {oauthError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-pulse">
              <p className="font-medium">⚠️ {oauthError}</p>
            </div>
          )}

          {/* Login Form */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <AiOutlineMail className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full border-2 border-gray-200 rounded-xl p-3.5 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      autoFocus
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1.5 ml-1"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <AiOutlineLock className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full border-2 border-gray-200 rounded-xl p-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="w-5 h-5" />
                      ) : (
                        <AiOutlineEye className="w-5 h-5" />
                      )}
                    </button>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1.5 ml-1"
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <AiOutlineGoogle className="w-6 h-6 text-red-500" />
            Sign in with Google
          </button>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold transition">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">Trusted by 50,000+ users worldwide</p>
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              🔒 Secure Login
            </span>
            <span className="flex items-center gap-1">
              ✓ Privacy Protected
            </span>
            <span className="flex items-center gap-1">
              ⚡ Fast Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}