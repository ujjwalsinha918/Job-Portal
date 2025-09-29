import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineTeam, AiOutlineGoogle } from "react-icons/ai";

export default function Register() {
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().oneOf(["jobseeker", "employer", "admin"], "Invalid role").required("Role is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post("http://localhost:8000/auth/register", values);
      alert("Registration successful!");
      resetForm();
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8000/auth/login/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <Formik
          initialValues={{ name: "", email: "", password: "", role: "jobseeker" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            {/* Name */}
            <div className="relative">
              <AiOutlineUser className="absolute top-3 left-3 text-gray-400" />
              <Field
                name="name"
                type="text"
                placeholder="Name"
                className="w-full border p-2 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Email */}
            <div className="relative">
              <AiOutlineMail className="absolute top-3 left-3 text-gray-400" />
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="w-full border p-2 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Password */}
            <div className="relative">
              <AiOutlineLock className="absolute top-3 left-3 text-gray-400" />
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="w-full border p-2 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Role */}
            <div className="relative">
              <AiOutlineTeam className="absolute top-3 left-3 text-gray-400" />
              <Field
                as="select"
                name="role"
                className="w-full border p-2 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
            >
              Register
            </button>
          </Form>
        </Formik>

        {/* Google Signup */}
        <div className="mt-6 text-center">
          <p className="text-gray-500">Or sign up with</p>
          <button
            onClick={handleGoogleSignup}
            className="mt-2 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors w-full"
          >
            <AiOutlineGoogle /> Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
}
