import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().oneOf(["jobseeker", "employer", "admin"], "Invalid role").required("Role is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await axios.post("http://localhost:8000/auth/register", values);
      alert("Registration successful!");
      resetForm();
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:8000/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      alert("Google signup successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Google signup failed", err);
      alert("Google signup failed");
    }
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
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <Field name="name" type="text" className="w-full border p-2 rounded" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Field name="email" type="email" className="w-full border p-2 rounded" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <Field name="password" type="password" className="w-full border p-2 rounded" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Role</label>
              <Field as="select" name="role" className="w-full border p-2 rounded">
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Register
            </button>
          </Form>
        </Formik>

        <div className="mt-4 text-center">
          <p className="text-gray-500">Or sign up with</p>
          <div className="flex justify-center mt-2">
            <GoogleLogin onSuccess={handleGoogleSignup} onError={() => alert("Google signup failed")} />
          </div>
        </div>
      </div>
    </div>
  );
}
