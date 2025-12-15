import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineTeam, AiOutlineGoogle, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().oneOf(["jobseeker", "employer", "admin"], "Invalid role").required("Role is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8000/auth/register", values, {
        withCredentials: true,
      });
      
      // Redirect based on role
      const role = values.role;
      if (role === "jobseeker") {
        navigate("/jobseeker");
      } else if (role === "employer") {
        navigate("/employer");
      } else if (role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
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

        {/* Register Card */}
        <div className="bg-white shadow-2xl p-8 md:p-10 rounded-3xl backdrop-blur-sm bg-opacity-95">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <AiOutlineUser className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600">Join thousands of job seekers and employers</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              <p className="font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Register Form */}
          <Formik
            initialValues={{ name: "", email: "", password: "", role: "jobseeker" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <AiOutlineUser className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
                    <Field
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full border-2 border-gray-200 rounded-xl p-3.5 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      autoFocus
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1.5 ml-1" />
                  </div>
                </div>

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
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1.5 ml-1" />
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
                      placeholder="Create a strong password"
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
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1.5 ml-1" />
                  </div>
                </div>

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    I am a
                  </label>
                  <div className="relative">
                    <AiOutlineTeam className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
                    <Field
                      as="select"
                      name="role"
                      className="w-full border-2 border-gray-200 rounded-xl p-3.5 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white cursor-pointer"
                    >
                      <option value="jobseeker">Job Seeker - Looking for opportunities</option>
                      <option value="employer">Employer - Hiring talent</option>
                      <option value="admin">Admin - Platform management</option>
                    </Field>
                    <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1.5 ml-1" />
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      Privacy Policy
                    </a>
                  </label>
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
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
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
              <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with</span>
            </div>
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <AiOutlineGoogle className="w-6 h-6 text-red-500" />
            Sign up with Google
          </button>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">Join 50,000+ users worldwide</p>
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              🔒 Secure Registration
            </span>
            <span className="flex items-center gap-1">
              ✓ Free Forever
            </span>
            <span className="flex items-center gap-1">
              ⚡ Instant Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}