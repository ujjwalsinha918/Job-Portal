import { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute"; // <-- wrap in ProtectedRoute

function ProfileContent() {
  const [profile, setProfile] = useState({
    name: "Ujjwal Sinha",
    email: "ujjwal@example.com",
    skills: "React, FastAPI, PostgreSQL",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Updated:", profile);
    alert("Profile updated successfully! (Later save to backend)");
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
