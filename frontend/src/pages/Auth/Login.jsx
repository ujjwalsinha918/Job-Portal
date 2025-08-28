import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Login Component
export default function Login() {
  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Handle form submit
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Call backend API
      const res = await axios.post("http://localhost:8000/auth/login", values);

      console.log("Logged in:", res.data);

      // Store token in localStorage
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      alert("Login successful!");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.detail || "Invalid credentials"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Formik wrapper */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Field name="email" type="email" className="w-full border p-2 rounded" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <Field name="password" type="password" className="w-full border p-2 rounded" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
