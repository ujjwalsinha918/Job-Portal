import axios from "axios";

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const res = await axios.get("http://localhost:8000/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data; // { id, email, role, ... }
    } catch {
        return null;
    }
};
// checks if the user is logged in and fetches the logged-in user's details from the backend using the saved JWT token