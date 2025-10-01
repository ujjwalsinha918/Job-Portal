import React, { useState } from "react";
import { PlusCircle, Briefcase, MapPin, FileText } from "lucide-react";
import { createJob } from "../../api/jobs";
import ProtectedRoute from "../../components/ProtectedRoute";

function PostJobContent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createJob(formData);
      alert("Job posted successfully!");
      setFormData({ title: "", description: "", location: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details to create a new job posting
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Briefcase size={18} />
                <span>Job Title</span>
              </div>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior Software Engineer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <MapPin size={18} />
                <span>Location</span>
              </div>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York, NY (Remote Available)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <FileText size={18} />
                <span>Job Description</span>
              </div>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, requirements, and benefits..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Be specific about responsibilities, qualifications, and what makes this role unique
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setFormData({ title: "", description: "", location: "" })}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  <span>Post Job</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips Card */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">Tips for a Great Job Post</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Write a clear, concise job title that accurately reflects the position</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Include specific requirements and qualifications</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Highlight what makes your company and this role unique</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Mention salary range and benefits to attract quality candidates</span>
          </li>
        </ul>
      </div>
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