import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post("http://localhost:8000/auth/login", values);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      alert("Login successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Invalid credentials"));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:8000/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      alert("Google login successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Google login failed", err);
      alert("Google login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <Formik initialValues={{ email: "", password: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form className="space-y-4">
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

            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Login
            </button>
          </Form>
        </Formik>

        <div className="mt-4 text-center">
          <p className="text-gray-500">Or login with</p>
          <div className="flex justify-center mt-2">
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert("Google login failed")} />
          </div>
        </div>
      </div>
    </div>
  );
}
