import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/jobs"; 
import ProtectedRoute from "../../components/ProtectedRoute";

function ProfileContent() {
  const [profile, setProfile] = useState({ name: "", email: "", skills: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          disabled
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2">Skills</label>
        <textarea
          name="skills"
          value={profile.skills}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
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
