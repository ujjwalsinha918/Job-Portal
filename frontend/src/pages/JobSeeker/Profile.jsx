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
    console.log("🔄 Fetching profile from server...");
    try {
      const data = await getProfile();
      console.log("✅ Profile data received from server:", data);
      console.log("Resume value from server:", data.resume);
      console.log("Resume type:", typeof data.resume);
      
      setProfile({
        name: data.name || "",
        email: data.email || "",
        skills: data.skills || "",
        resume: data.resume || null,
      });
      
      console.log("📝 Profile state set. resume value:", data.resume || null);
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };
  fetchProfile();
  console.log("📌 resumeFile state changed to:", resumeFile);
}, [resumeFile]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    console.log("💾 Saving profile changes...");
    try {
      await updateProfile({
        name: profile.name,
        skills: profile.skills
      });
      console.log("✅ Profile updated successfully");
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("Failed to update profile: " + (err.response?.data?.detail || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleResumeChange = (e) => {
console.log("🎯 handleResumeChange TRIGGERED");
  console.log("Event object:", e);
  console.log("Files array:", e.target.files);
  
  const file = e.target.files[0];
  console.log("📄 Resume file selected:", file ? file.name : "none");
  console.log("File object details:", file);
  
  setResumeFile(file);
  console.log("✅ setResumeFile called with:", file);
  
  setUploadMessage("");
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      console.warn("⚠️ No file selected for upload");
      return alert("Please select a file first.");
    }
    
    console.log("📤 Step 1: File selected");
    console.log("File details:", {
      name: resumeFile.name,
      size: resumeFile.size,
      type: resumeFile.type
    });

    const formData = new FormData();
    formData.append("file", resumeFile);
    console.log("📦 Step 2: FormData created");

    try {
      console.log("🔄 Step 3: Calling uploadResume API...");
      console.log("API endpoint: /profiles/upload-resume");
      const res = await uploadResume(formData);
      console.log("✅ Step 4: API response received");
      console.log("Full response object:", res);
      console.log("Response detail:", res.detail);
      console.log("Response resume value:", res.resume);
      
      console.log("📝 Step 5: Updating profile state");
      console.log("Previous profile.resume:", profile.resume);
      // Update profile state to show resume is now available
      setProfile(prev => {
        const updated = { ...prev, resume: true };
        console.log("📝 Updated profile state after upload:", updated);
        return updated;
      });
      
      setUploadMessage(res.detail || "Resume uploaded successfully!");
      setResumeFile(null);
      
      console.log("✅ Step 6: Upload complete - State updated");
      console.log("=== UPLOAD PROCESS COMPLETED ===");
      
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
    } catch (err) {
      console.error("❌ UPLOAD FAILED");
    console.error("Error object:", err);
    console.error("Error response:", err.response);
    console.error("Error response data:", err.response?.data);
    console.error("Error message:", err.message);
    console.error("=== UPLOAD PROCESS FAILED ===");
      setUploadMessage(err.response?.data?.detail || "Failed to upload resume");
    }
  };
  const handleResumeDownload = async () => {
    console.log("📥 Starting resume download...");
    console.log("Current profile.resume value:", profile.resume);
    
    try {
      console.log("🔄 Fetching resume from server...");
      const blob = await downloadResume();
      console.log("✅ Resume blob received:", {
        size: blob.size,
        type: blob.type
      });
      
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      
      console.log("🖱️ Triggering download...");
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log("✅ Resume download complete");
    } catch (err) {
      console.error("❌ Resume download failed:", err);
      console.error("Error details:", err.response?.data);
      alert("Failed to download resume: " + (err.response?.data?.detail || "Unknown error"));
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

  console.log("🎨 Rendering profile. Current resume status:", profile.resume);

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
        <div className="border-t pt-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Resume Management</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload New Resume
              </label>
              <input 
                type="file" 
                onChange={handleResumeChange}
                accept=".pdf,.doc,.docx"
                id="resume-file-input"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
              />
              {/* ADD THIS LINE to show selected file */}
    <p className="mt-2 text-xs text-gray-600">
      {resumeFile ? `Selected: ${resumeFile.name}` : "No file selected"}
    </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleResumeUpload}
                disabled={!resumeFile}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload Resume
              </button>
              
              {profile.resume && (
                <button
                  type="button"
                  onClick={handleResumeDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  <span>Download Resume</span>
                </button>
              )}
            </div>
            
            {uploadMessage && (
              <div className={`p-3 rounded-lg ${
                uploadMessage.includes("success") 
                  ? "bg-green-50 text-green-800 border border-green-200" 
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                {uploadMessage}
              </div>
            )}
            
            {profile.resume && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✓ Resume is uploaded and available for download
                </p>
              </div>
            )}
          </div>
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