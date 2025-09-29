import React, { useState } from "react";
import { createJob } from "../../api/jobs";
import ProtectedRoute from "../../components/ProtectedRoute"; // <-- wrap in ProtectedRoute

function PostJobContent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createJob({ title, description, location });
      alert("Job posted successfully!");
      setTitle("");
      setDescription("");
      setLocation("");
    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Post a Job</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Job Title"
          className="border p-2 w-full"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Job Description"
          className="border p-2 w-full"
          required
        ></textarea>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          type="text"
          placeholder="Location"
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}

export default function PostJob() {
  return (
    <ProtectedRoute role="employer">
      <PostJobContent />
    </ProtectedRoute>
  );
}
