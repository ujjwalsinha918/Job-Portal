import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Register Component
export default function Register() {
  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().oneOf(["jobseeker", "employer", "admin"], "Invalid role").required("Role is required"),
  });

  // Handle form submit
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Call backend API
      const res = await axios.post("http://localhost:8000/auth/register", values);

      console.log("Registered:", res.data);

      alert("Registration successful!");
      resetForm();
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.detail || "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Formik wrapper */}
        <Formik
          initialValues={{ name: "", email: "", password: "", role: "jobseeker" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <Field name="name" type="text" className="w-full border p-2 rounded" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

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

            {/* Role Dropdown */}
            <div>
              <label className="block mb-1 font-medium">Role</label>
              <Field as="select" name="role" className="w-full border p-2 rounded">
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Register
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
