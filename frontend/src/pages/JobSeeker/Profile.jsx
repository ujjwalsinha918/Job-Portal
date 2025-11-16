import { useEffect, useState } from "react";
import { User, Mail, Award, Save, Download } from "lucide-react";
import { getProfile, updateProfile, uploadResume, downloadResume } from "../../api/jobs";
import ProtectedRoute from "../../components/ProtectedRoute";

function ProfileContent() {
  const [profile, setProfile] = useState({ name: "", email: "", skills: "", resume: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          skills: data.skills || "",
          resume: data.resume || null, // <-- fetch resume info
        });
      } catch (err) {
        console.error("Error fetching profile", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: profile.name,
        skills: profile.skills
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Failed to update profile: " + (err.response?.data?.detail || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
    setUploadMessage("");
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return alert("Please select a file first.");
    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      const res = await uploadResume(formData);
      setUploadMessage(res.detail || "Resume uploaded successfully!");
      setResumeFile(null);
      // <-- Update state without page reload
    setProfile(prev => ({ ...prev, resume: true }));
    setUploadMessage("Resume uploaded successfully!");
    } catch (err) {
      setUploadMessage(err.response?.data?.detail || "Failed to upload resume");
    }
  };

  // --- NEW: Download resume
  const handleResumeDownload = async () => {
    try {
      const blob = await downloadResume();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf"); // can also detect original filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download resume");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your personal information, skills, and resume</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <User size={18} />
                <span>Full Name</span>
              </div>
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Mail size={18} />
                <span>Email Address</span>
              </div>
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-2 text-sm text-gray-500">Email cannot be changed</p>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Award size={18} />
                <span>Skills & Expertise</span>
              </div>
            </label>
            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="Enter your skills, separated by commas"
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Resume Section */}
        <div className="space-y-2">
          <h2 className="font-semibold">Resume</h2>
          <input type="file" onChange={handleResumeChange} />
          <div className="flex items-center space-x-4 mt-2">
            <button
              type="button"
              onClick={handleResumeUpload}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Upload Resume
            </button>
            {profile.resume && (
              <button
                type="button"
                onClick={handleResumeDownload}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Download size={16} className="mr-2" /> View / Download Resume
              </button>
            )}
          </div>
          {uploadMessage && <p className="text-sm text-gray-600">{uploadMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute role="jobseeker">
      <ProfileContent />
    </ProtectedRoute>
  );
}
