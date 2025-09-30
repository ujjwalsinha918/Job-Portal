import axios from "axios";

const API_BASE = "http://localhost:8000"; // your FastAPI backend URL

const api = axios.create({
    // base URL for all API requests made with this instance
    baseURL: API_BASE,
    withCredentials: true, // include cookies in requests
}); 

// Asynchronously fetches all job listings from the backend
export const getJobs = async () => {
    const res = await api.get("/jobs/");
    return res.data;
};

// Asynchronously creates a new job listing.
// It takes an object 'jobData' containing the job's details.
export const createJob = async (jobData) => {
    // jobData = { title, description, location }
    const res = await api.post("/jobs/", jobData);
    return res.data;
};

// Asynchronously fetches the applications of the currently logged-in user.
export const getMyApplications = async () => {
    const res = await api.get("/applications/jobseeker");
    return res.data;
};

// Asynchronously submits a job application.
// It takes 'job_id' as an argument, which is the ID of the job to apply for.
export const applyForJob = async (job_id) => {
  try {
    const res = await api.post(`/applications/apply/${job_id}`);
    console.log("Headers sent:", res.config.headers);
    console.log("Data received:", res.data);
    return res.data;
  } catch (err) {
    console.error("applyForJob error:", err.response?.data, err.response?.status);
    throw err;
  }
}

// update
export const updateJob = async (id, jobData) => {
  const res = await api.put(`/jobs/${id}`, jobData);
  return res.data;
};

// delete
export const deleteJob = async (id) => {
  const res = await api.delete(`/jobs/${id}`);
  return res.data;
};
// Fetch applications for jobs posted by the current employer
export const getEmployerApplications = async () => {
  const res = await api.get("/applications/employer");
  return res.data;
};

export const updateApplicationStatus = async (id, status) => {
  const res = await api.put(`/applications/${id}/status`, null, {
    params: { status },
  });
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/profiles/users/me"); // updated path
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put("/profiles/users/me", profileData); // updated path
  return res.data;
};

export default api;